import projects from "../projects/projects.json";
import { NextResponse } from "next/server";
import { Project } from "../projects/types";
import { Todo } from "../projects/types";
import openai from "@/app/utils/openai";
import {
  promptMessageTimeEstimation as systemMessageTimeEstimation,
  promptMessageTaskSuggestion as systemMessageTaskSuggestion,
} from "@/app/utils/prompts";

const generateMostRecentProject = (projects: Project[]) => {
  if (!projects || projects.length === 0)
    return "No active projects at the moment";

  const projectsWithTask = projects.filter((project: Project) => {
    return (
      project.todos && project.todos.length > 0 && project.isCompleted === false
    );
  });

  const sortedProjects = projectsWithTask.sort((a, b) => {
    if (!a.todos && !b.todos) return 0;
    if (!b.todos) return -1;
    if (!a.todos) return 1;

    let score = 0;
    const latestToDoDateA = a.todos
      .filter((todo) => !todo.isCompleted)
      .sort((toDoA, toDoB) =>
        toDoA.createdAt < toDoB.createdAt ? 1 : -1
      )[0].createdAt;
    const latestToDoDateB = b.todos
      .filter((todo) => !todo.isCompleted)
      .sort((toDoA, toDoB) =>
        toDoA.createdAt < toDoB.createdAt ? 1 : -1
      )[0].createdAt;
    if (latestToDoDateA && latestToDoDateB)
      score += latestToDoDateA < latestToDoDateB ? 1 : -1;

    const completedTaskArrayA = a.todos.filter((toDo) => toDo.isCompleted);
    const completedTaskArrayB = b.todos.filter((toDo) => toDo.isCompleted);

    const latestCompletedToDoDateA = completedTaskArrayA?.sort((toDoA, toDoB) =>
      toDoA.createdAt < toDoB.createdAt ? 1 : -1
    )[0].completedAt;

    const latestCompletedToDoDateB = completedTaskArrayB?.sort((toDoA, toDoB) =>
      toDoA.createdAt < toDoB.createdAt ? 1 : -1
    )[0].completedAt;

    if (latestCompletedToDoDateA && latestCompletedToDoDateB)
      score += latestCompletedToDoDateA < latestCompletedToDoDateB ? 2 : -2;

    if (completedTaskArrayA && completedTaskArrayB)
      score +=
        completedTaskArrayA.length / a.todos.length >
        completedTaskArrayB.length / b.todos.length
          ? -1
          : 1;

    return score;
  });

  return sortedProjects[0];
};

const createTasksString = (todos: Todo[], taskStatus: "open" | "completed") => {
  const tasks = todos
    .filter(({ isCompleted }) =>
      taskStatus === "completed" ? isCompleted === true : isCompleted === false
    )
    .map(({ task, isCompleted, completedAt, createdAt }) => {
      return `- ${task}, ${
        isCompleted ? "completed on " + completedAt : "created on " + createdAt
      }`;
    });
  return `\n${
    taskStatus === "open" ? "Open" : "Completed"
  } tasks:\n${tasks.join("\n")}`;
};

const generatePromptTaskSuggestion = (
  project: Project | "No active projects at the moment"
) => {
  if (project === "No active projects at the moment") {
    return project;
  }
  if (!project.todos) return null;

  return ` Project: ${
    project.name
  }\nMaterials at hand: ${project.materialsAtHand?.join(
    ", "
  )}\nMissing materials: ${project.missingMaterials?.join(
    ", "
  )}${createTasksString(project.todos, "completed")}${createTasksString(
    project.todos,
    "open"
  )}`;
};

export async function getOpenAIResponse(
  prompt: string,
  systemMessage: string,
  maxToken: number,
  temperature: number
) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt },
    ],
    max_tokens: maxToken,
    temperature: temperature,
  });

  return completion.data.choices[0].message?.content;
}

export async function GET() {
  const latestProject = generateMostRecentProject(projects);

  const promptText = generatePromptTaskSuggestion(latestProject);

  if (!promptText)
    return NextResponse.json({
      taskSuggestion:
        "Looks like you have no open todos, hop over to your projects and start planning!",
      estimatedTime: "30 min",
    });

  const taskSuggestion = await getOpenAIResponse(
    promptText,
    systemMessageTaskSuggestion,
    150,
    0.6
  ).catch((e) => console.log(e));

  if (!taskSuggestion)
    return NextResponse.json({
      error:
        "Hey, our AI buddy seems to be sleeping right now, check back again later for new suggestions!",
    });

  const estimatedTime = await getOpenAIResponse(
    taskSuggestion,
    systemMessageTimeEstimation,
    10,
    0.3
  ).catch(() => null);

  return NextResponse.json({
    taskSuggestion,
    estimatedTime,
  });
}
