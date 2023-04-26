import projects from "../projects/projects.json";
import { NextResponse } from "next/server";
import { Project } from "../projects/types";

// type TaskForPrompt = {
//   task: string;
//   createdAt: string;
//   completedAt?: string;
// };

// type ProjectDataForPrompt = {
//   title: string;
//   createdAt: string;
//   materialsAtHand: string[];
//   missingMaterials: string[];
//   recentlyCompletedTasks: TaskForPrompt[];
//   openTasks: TaskForPrompt[];
// };

const generateProjectDataForPrompt = (projects: Project[]) => {
  if (projects.length === 0) return `No projects created yet`;

  const openProjects = projects.filter(
    ({ isCompleted }) => isCompleted === false
  );

  const newProjectsArray = openProjects.map(
    ({ title, createdAt, materialsAtHand, missingMaterials, todos }) => {
      const openTasks = todos
        .filter(({ isCompleted }) => isCompleted === false)
        .map((openTodo) => {
          const { isCompleted, completedAt, ...newOpenTodo } = openTodo;
          return newOpenTodo;
        });
      const recentlyCompletedTasks = todos
        .filter(({ isCompleted }) => isCompleted === true)
        .map((todo) => {
          const { isCompleted, ...newTodo } = todo;
          return newTodo;
        }) // sort functionality to take only tasks completed in the last 30 days? or take the newest completed tasks?
        .sort((a, b) =>
          a.completedAt && b.completedAt
            ? new Date(a.completedAt).getTime() -
              new Date(b.completedAt).getTime()
            : 0
        );
      return {
        [title]: {
          createdAt,
          materialsAtHand,
          missingMaterials,
          recentlyCompletedTasks,
          openTasks,
        },
      };
    }
  );

  return newProjectsArray;
};

type ProjectDataForPrompt = ReturnType<typeof generateProjectDataForPrompt>;

console.log(generateProjectDataForPrompt(projects));
