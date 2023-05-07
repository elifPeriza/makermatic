import projects from "../projects/projects.json";
import { NextResponse } from "next/server";
import { Project } from "../projects/types";
import { Todo } from "../projects/types";

/* 
Project data string for GPT prompt: 

Project: Arched Garden Shelf
Materials at hand: drywall, oak shelves  
Missing materials: plywood
Completed tasks:
- Buy jigsaw, completed on 2023-4-14
- Research jigsaw type, completed on 2023-04-13
Open tasks:
- Take measurements for materials, created on 2023-04-11
- Cut plywood, created on 2023-04-11

Project: wood art
Materials at hand: wood
Missing materials: wood paint
Completed tasks:
- Decide on wood arrangement, completed on 2023-04-15
Open tasks:
- Cut wood, created on 2023-04-15
- Paint wood cuts, created on 2023-04-15
 */

type ProjectWithTasks = {
  projectID: number;
  todos: Todo[];
};

type SingleTask = {
  projectID: number;
  taskDate: string;
};

const generateMostRecentTasks = (
  projectsWithTasks: ProjectWithTasks[],
  taskStatus: "open" | "completed"
) =>
  projectsWithTasks.reduce(
    (accumulator: SingleTask[], project: ProjectWithTasks) => {
      const taskDates = project.todos
        .filter(({ isCompleted }) =>
          taskStatus === "completed" ? isCompleted : !isCompleted
        )
        .map((todo) =>
          taskStatus === "completed" ? todo.completedAt : todo.createdAt
        );

      taskDates.forEach((taskDate) => {
        if (taskDate && accumulator.length === 0) {
          accumulator.push({ projectID: project.projectID, taskDate });
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
        accumulator.sort((taskA: SingleTask, taskB: SingleTask) => {
          const dateA = new Date(taskA.taskDate);
          const dateB = new Date(taskB.taskDate);
          return dateA.getTime() - dateB.getTime();
        });
      });

      return accumulator;
    },
    []
  );

const calculateMostRecentProject = (projects: Project[]) => {
  const projectsWithTasks = projects
    .filter(({ isCompleted }) => isCompleted === false)
    .map(({ id: projectID, todos }) => {
      return { projectID, todos };
    });

  const recentlyCompletedTasks = generateMostRecentTasks(
    projectsWithTasks,
    "completed"
  );
  const recentlyCreatedTasks = generateMostRecentTasks(
    projectsWithTasks,
    "open"
  );

  const mostRecentTasks = [...recentlyCompletedTasks, ...recentlyCreatedTasks];

  let taskCountPerProject: { [key: string]: number } = {};

  mostRecentTasks.forEach((task) => {
    taskCountPerProject[task.projectID] ??= 0;
    taskCountPerProject[task.projectID]++;
  });

  const projectIDWithMostRecentTasks = parseInt(
    Object.keys(taskCountPerProject).reduce((acc, curr) =>
      taskCountPerProject[acc] >= taskCountPerProject[curr] ? acc : curr
    )
  );

  const mostRecentProject = projects.find(
    (project) => project.id === projectIDWithMostRecentTasks
  );
  return mostRecentProject;
};

console.log(calculateMostRecentProject(projects));
