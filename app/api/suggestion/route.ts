import projects from "../projects/projects.json";
import { NextResponse } from "next/server";
import { Project } from "../projects/types";
import { Todo } from "../projects/types";
import openai from "@/app/utils/openai";
import {
  promptMessageTimeEstimation,
  promptMessageTaskSuggestion,
} from "@/app/utils/prompts";

type ProjectWithTasks = {
  projectID: number;
  todos: Todo[];
};

type SingleTask = {
  projectID: number;
  taskDate: string;
};

// function to transform project tasks to a string for prompt
const createTasksString = (
  todos: Todo[],
  taskStatus: "open" | "completed"
) => {
  const tasks = todos
    .filter(({ isCompleted }) =>
      taskStatus === "completed"
        ? isCompleted === true
        : isCompleted === false
    )
    .map(
      ({ task, isCompleted, completedAt, createdAt }) => {
        return `- ${task}, ${
          isCompleted
            ? "completed on " + completedAt
            : "created on " + createdAt
        }`;
      }
    );
  return `\n${
    taskStatus === "open" ? "Open" : "Completed"
  } tasks:\n${tasks.join("\n")}`;
};

const generateMostRecentTasks = (
  projectsWithTasks: ProjectWithTasks[],
  taskStatus: "open" | "completed"
) =>
  projectsWithTasks.reduce(
    (
      accumulator: SingleTask[],
      project: ProjectWithTasks
    ) => {
      const taskDates = project.todos
        .filter(({ isCompleted }) =>
          taskStatus === "completed"
            ? isCompleted
            : !isCompleted
        )
        .map((todo) =>
          taskStatus === "completed"
            ? todo.completedAt
            : todo.createdAt
        );

      taskDates.forEach((taskDate) => {
        if (taskDate && accumulator.length === 0) {
          accumulator.push({
            projectID: project.projectID,
            taskDate,
          });
          return;
        }

        if (
          taskDate &&
          taskDate > accumulator.slice(-1)[0].taskDate &&
          accumulator.length >= 3
        )
          return;

        if (taskDate && accumulator.length <= 3) {
          accumulator.push({
            projectID: project.projectID,
            taskDate,
          });
        }

        if (
          taskDate &&
          taskDate <= accumulator.slice(-1)[0].taskDate &&
          accumulator.length > 3
        ) {
          accumulator.pop();
          accumulator.push({
            projectID: project.projectID,
            taskDate,
          });
        }
        accumulator.sort(
          (taskA: SingleTask, taskB: SingleTask) => {
            const dateA = new Date(taskA.taskDate);
            const dateB = new Date(taskB.taskDate);
            return dateA.getTime() - dateB.getTime();
          }
        );
      });

      return accumulator;
    },
    []
  );

const calculateMostRecentProject = (
  projects: Project[]
) => {
  // early return for when there are no active projects
  if (projects.length === 0 || projects === undefined)
    return `No active projects at the moment`;

  const projectsWithTasks = projects
    .filter(({ isCompleted }) => isCompleted === false)
    .map(({ id: projectID, todos }) => {
      return { projectID, todos };
    });

  if (projectsWithTasks.length === 0)
    return `No active projects at the moment`;

  const recentlyCompletedTasks = generateMostRecentTasks(
    projectsWithTasks,
    "completed"
  );
  const recentlyCreatedTasks = generateMostRecentTasks(
    projectsWithTasks,
    "open"
  );

  const mostRecentTasks = [
    ...recentlyCompletedTasks,
    ...recentlyCreatedTasks,
  ];

  let taskCountPerProject: { [key: string]: number } = {};

  mostRecentTasks.forEach((task) => {
    taskCountPerProject[task.projectID] ??= 0;
    taskCountPerProject[task.projectID]++;
  });

  const projectIDWithMostRecentTasks = parseInt(
    Object.keys(taskCountPerProject).reduce((acc, curr) =>
      taskCountPerProject[acc] >= taskCountPerProject[curr]
        ? acc
        : curr
    )
  );

  const mostRecentProject = projects.find(
    (project) => project.id === projectIDWithMostRecentTasks
  ) as Project; // type assertion as we know that at this point the calculcated projectID does exist & we have an early return
  return mostRecentProject;
};

const mostRecentProject =
  calculateMostRecentProject(projects);

const generatePromptTaskSuggestion = (
  project: Project | "No active projects at the moment"
) => {
  if (project === "No active projects at the moment") {
    return promptMessageTaskSuggestion + project;
  } else {
    return ` ${promptMessageTaskSuggestion}\n\nProject: ${
      project.title
    }\nMaterials at hand: ${project.materialsAtHand.join(
      ", "
    )}\nMissing materials: ${project.missingMaterials.join(
      ", "
    )}${createTasksString(
      project.todos,
      "completed"
    )}${createTasksString(project.todos, "open")}`;
  }
};

export async function getOpenAIResponse(
  prompt: string,
  maxToken: number,
  temperature: number
) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: maxToken,
    temperature: temperature,
  });

  return completion.data.choices[0].text;
}

export async function GET() {
  const taskSuggestion = await getOpenAIResponse(
    generatePromptTaskSuggestion(mostRecentProject),
    150,
    0.6
  ).catch(() => null);

  if (!taskSuggestion)
    return NextResponse.json(
      { message: "Failed to generate task suggestion" },
      { status: 500 }
    );

  const promptTimeEstimation =
    promptMessageTimeEstimation + taskSuggestion;
  const estimatedTime = await getOpenAIResponse(
    promptTimeEstimation,
    10,
    0.3
  ).catch(() => null);

  return NextResponse.json({
    taskSuggestion,
    estimatedTime,
  });
}
