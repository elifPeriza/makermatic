import projects from "../projects/projects.json";
import { NextResponse } from "next/server";
import { Project } from "../projects/types";
import { Todo } from "../projects/types";
import openai from "@/app/utils/openai";

type ProjectWithTasks = {
  projectID: number;
  todos: Todo[];
};

type SingleTask = {
  projectID: number;
  taskDate: string;
};

// function to transform project tasks to a string for prompt
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
  // early return for when there are no active projects
  if (projects.length === 0 || projects === undefined)
    return `No active projects at the moment`;

  const projectsWithTasks = projects
    .filter(({ isCompleted }) => isCompleted === false)
    .map(({ id: projectID, todos }) => {
      return { projectID, todos };
    });

  if (projectsWithTasks.length === 0) return `No active projects at the moment`;

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
  ) as Project; // type assertion as we know that at this point the calculcated projectID does exist & we have an early return
  return mostRecentProject;
};

const mostRecentProject = calculateMostRecentProject(projects);

const generatePrompt = (
  project: Project | "No active projects at the moment"
) => {
  const promptMessage = `You are a task assistant. The user will give you the status of his/her recently most active project and you will suggest a single task for todays date and calculate the approximate time the task will take.
  If there are missing materials required for a task, then you should only suggest to buy that missing material as a task for this day. Do not ever suggest tasks that require any missing material. Do not suggest more than one task.
  
  Calculate the estimated time generously as the target audience are DIY-Beginners and consider all steps the tasks entails (for example driving to the hardware store). Use an enthusiastic and encouraging language and appreciate the users recent accomplishments. Write from the 1st person perspective.
  
  If there are no active projects at the moment, instead of the task suggestion ask some questions that will inspire the user to create diy ideas. Use the book "The Art of Noticing" from Rob Walker as a reference but do not ever mention the book explicitly. Do not ever use sentences that incentivise the user to ask you further questions.
  
  You always respond in the following structure:
  
  Task Suggestion:
  Hey [suggestion]
  
  Estimated time: [x] [hour(s)] [y] [minute(s)]`;

  if (project === "No active projects at the moment") {
    return promptMessage + project;
  } else {
    return ` ${promptMessage}\n\nProject: ${
      project.title
    }\nMaterials at hand: ${project.materialsAtHand.join(
      ", "
    )}\nMissing materials: ${project.missingMaterials.join(
      ", "
    )}${createTasksString(project.todos, "completed")}${createTasksString(
      project.todos,
      "open"
    )}`;
  }
};

export async function GET() {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: generatePrompt(mostRecentProject) }],
      max_tokens: 150,
    });

    return NextResponse.json(completion.data.choices[0].message);
  } catch (error) {
    console.error(error);
  }
}
