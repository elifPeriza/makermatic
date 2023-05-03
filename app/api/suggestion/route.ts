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
  title: string;
  todos: Todo[];
};

type SingleTask = {
  project: string;
  taskDate: string;
};

const generateMostRecentTasks = (
  tasks: ProjectWithTasks[],
  taskStatus: "open" | "completed"
) =>
  tasks.reduce((accumulator: SingleTask[], project: ProjectWithTasks) => {
    const recentlyUpdatedTasks = project.todos
      .filter(({ isCompleted }) =>
        taskStatus === "completed" ? isCompleted : !isCompleted
      )
      .map((todo) =>
        taskStatus === "completed" ? todo.completedAt : todo.createdAt
      );

    recentlyUpdatedTasks.forEach((taskDate) => {
      if (taskDate && accumulator.length === 0) {
        accumulator.push({ project: project.title, taskDate });
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
          project: project.title,
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
          project: project.title,
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
  }, []);

const generateMostRecentProject = (projects: Project[]) => {
  console.log("generateMostRecentProject called");

  const tasks = projects
    .filter(({ isCompleted }) => isCompleted === false)
    .map(({ title, todos }) => {
      return { title, todos };
    });

  const recentlyCompletedTasks = generateMostRecentTasks(tasks, "completed");
  const recentlyCreatedTasks = generateMostRecentTasks(tasks, "open");

  return [...recentlyCompletedTasks, ...recentlyCreatedTasks];
};

console.log(generateMostRecentProject(projects));
