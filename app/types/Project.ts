import { Task } from "@/db/schema";

export type ProjectContent = {
  tasks: Task[];
  materialTasks: Task[];
  notes: string | null;
};

export type ProjectContentCategories = "tasks" | "materials" | "notes";
