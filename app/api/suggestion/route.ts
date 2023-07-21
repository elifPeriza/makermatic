import isOlderThan24Hours from "@/app/utils/date";
import openai from "@/app/utils/openai";
import { systemMessageTaskSuggestion } from "@/app/utils/prompts";
import { db } from "@/db/drizzle";
import { taskSuggestions, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const getAllProjects = async () => {
  const allProjects = await db.query.projects.findMany({
    with: {
      tasks: true,
    },
  });
  return allProjects;
};

const generateMostRecentProject = async () => {
  const projects = await getAllProjects();
  if (!projects || projects.length === 0)
    return "No active projects at the moment";

  const projectsWithTask = projects.filter(
    (project) => project.tasks.length > 0 && !project.isCompleted
  );

  if (projectsWithTask.length === 0)
    return "No projects with tasks at the moment";

  const sortedProjects = projectsWithTask.sort((projectA, projectB) => {
    if (!projectA.tasks && !projectB.tasks) return 0;
    if (!projectA.tasks) return 1;
    if (!projectB.tasks) return -1;

    let score = 0;

    const latestOpenToDoDateA = projectA.tasks
      .filter((task) => !task.isCompleted)
      .sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      })[0].createdAt;

    const latestOpenToDoDateB = projectB.tasks
      .filter((task) => !task.isCompleted)
      .sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      })[0].createdAt;

    if (latestOpenToDoDateA && latestOpenToDoDateB)
      score += latestOpenToDoDateA > latestOpenToDoDateB ? -1 : 1;

    const allCompletedTasksA = projectA.tasks.filter(
      (task) => task.isCompleted
    );

    const allCompletedTasksB = projectB.tasks.filter(
      (task) => task.isCompleted
    );

    const latestCompletedToDoDateA = allCompletedTasksA.sort((a, b) => {
      if (!a.completedAt && !b.completedAt) return 0;
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      if (a.completedAt && b.completedAt) {
        return a.completedAt > b.completedAt ? -1 : 1;
      }
      return 0;
    })[0].completedAt;

    const latestCompletedToDoDateB = allCompletedTasksB.sort((a, b) => {
      if (!a.completedAt && !b.completedAt) return 0;
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      if (a.completedAt && b.completedAt) {
        return a.completedAt > b.completedAt ? -1 : 1;
      }
      return 0;
    })[0].completedAt;

    if (latestCompletedToDoDateA && latestCompletedToDoDateB)
      score += latestCompletedToDoDateA > latestCompletedToDoDateB ? -2 : 2;

    if (allCompletedTasksA && allCompletedTasksB) {
      return allCompletedTasksA.length / projectA.tasks.length >
        allCompletedTasksB.length / projectB.tasks.length
        ? -1
        : 1;
    }

    return score;
  });
  return sortedProjects[0];
};

const createPromptText = async () => {
  const latestProject = await generateMostRecentProject();

  if (latestProject === "No active projects at the moment") return undefined;
  if (latestProject === "No projects with tasks at the moment")
    return undefined;

  const materialsAtHand = latestProject.tasks
    .filter(({ type, isCompleted }) => type === "material" && isCompleted)
    .map(({ description }) => description);

  const missingMaterials = latestProject.tasks
    .filter(({ type, isCompleted }) => type === "material" && !isCompleted)
    .map(({ description, id }) => {
      return `- ${description}, id: ${id}`;
    });

  const tasksWithoutMaterials = latestProject.tasks.filter(
    ({ type }) => type === "to-do"
  );

  const completedTasks = tasksWithoutMaterials
    .filter(({ isCompleted }) => isCompleted)
    .map(
      ({ id, description, completedAt }) =>
        `- ${description}, completed on ${completedAt}, id: ${id}`
    );

  const openTasks = tasksWithoutMaterials
    .filter(({ isCompleted }) => !isCompleted)
    .map(
      ({ id, description, createdAt }) =>
        `- ${description}, created at ${createdAt}, id: ${id}`
    );

  return `Project: ${latestProject.name}
  \nMaterials at hand: ${materialsAtHand.join(", ")}
  \nMissing materials:\n${missingMaterials.join("\n")}
  \nCompleted tasks: \n${completedTasks.join("\n")}
  \nOpen tasks: \n${openTasks.join("\n")}`;
};

async function getOpenAIResponse(
  prompt: string,
  systemMessage: string,
  maxToken: number,
  temperature: number
) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt },
    ],
    functions: [
      {
        name: "store_motivating_task_suggestion",
        description: "Store the task suggestion message with the task id",
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The id of the task or missing material",
            },
            motivatingMessage: {
              type: "string",
              description: "A motivating message for the user",
            },
            estimatedTimeToCompleteInMinutes: {
              type: "number",
              description:
                "Estimated time in minutes to complete the suggested task",
            },
          },
          required: [
            "id",
            "motivatingMessage",
            "estimatedTimeToCompleteInMinutes",
          ],
        },
      },
    ],
    max_tokens: maxToken,
    temperature: temperature,
  });

  const taskSuggestionArguments =
    completion.data.choices[0].message?.function_call?.arguments;

  if (!taskSuggestionArguments) return undefined;
  try {
    const taskSuggestion: {
      id: number;
      motivatingMessage: string;
      estimatedTimeToCompleteInMinutes: number;
    } = JSON.parse(taskSuggestionArguments);

    const TaskSuggestion = z.object({
      id: z.number().positive(),
      motivatingMessage: z.string(),
      estimatedTimeToCompleteInMinutes: z.number().gte(5).lte(600),
    });

    TaskSuggestion.parse(taskSuggestion);

    return taskSuggestion;
  } catch (error) {
    console.log("Failed to parse arguments");
    return undefined;
  }
}

export async function GET() {
  const taskSuggestion = await db
    .select({
      id: taskSuggestions.taskId,
      motivatingMessage: taskSuggestions.content,
      estimatedTimeToCompleteInMinutes: taskSuggestions.estimatedTime,
      createdAt: taskSuggestions.createdAt,
    })
    .from(taskSuggestions)
    .all();

  if (taskSuggestion.length > 0) {
    const isSuggestionOlderThan24Hours = isOlderThan24Hours(
      taskSuggestion[0].createdAt
    );
    if (!isSuggestionOlderThan24Hours) {
      return NextResponse.json(taskSuggestion[0]);
    }
  }

  const promptText = await createPromptText();

  if (!promptText)
    return NextResponse.json({
      motivatingMessage:
        "Looks like you have no open todos or active projects. Hop over to your projects to start planning or create a new project!",
      estimatedTimeToCompleteInMinutes: "30 min",
    });

  const newTaskSuggestion = await getOpenAIResponse(
    promptText,
    systemMessageTaskSuggestion,
    150,
    0.6
  ).catch((e) => console.log(e));

  if (!newTaskSuggestion)
    return NextResponse.json({
      error:
        "Hey, our AI buddy seems to be sleeping right now, check back again later for new suggestions!",
    });

  const suggestedTaskWithProjectRelation = await db.query.tasks.findFirst({
    columns: {
      id: true,
      projectId: true,
    },
    where: eq(tasks.id, newTaskSuggestion.id),
    with: {
      project: true,
    },
  });

  const suggestedTaskUserId = suggestedTaskWithProjectRelation?.project?.userId;

  if (!suggestedTaskUserId)
    return NextResponse.json({
      error:
        "Hey, our AI buddy seems to be sleeping right now, check back again later for new suggestions!",
    });

  const taskValues = {
    id: 1,
    userId: suggestedTaskUserId,
    content: newTaskSuggestion.motivatingMessage,
    taskId: newTaskSuggestion.id,
    estimatedTime: newTaskSuggestion.estimatedTimeToCompleteInMinutes,
    createdAt: new Date().toISOString(),
  };

  const updatedTaskSuggestion = await db
    .insert(taskSuggestions)
    .values(taskValues)
    .onConflictDoUpdate({ target: taskSuggestions.id, set: taskValues })
    .returning({
      id: taskSuggestions.taskId,
      motivatingMessage: taskSuggestions.content,
      estimatedTimeToCompleteInMinutes: taskSuggestions.estimatedTime,
      createdAt: taskSuggestions.createdAt,
    })
    .all();

  if (!updatedTaskSuggestion)
    return NextResponse.json({
      error:
        "Hey, our AI buddy seems to be sleeping right now, check back again later for new suggestions!",
    });
  return NextResponse.json(updatedTaskSuggestion);
}
