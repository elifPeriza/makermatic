import { Task } from "@/db/schema";

export type ProjectContent = {
  tasks: Task[];
  materialTasks: Task[];
  notes: string | null;
};

export type ProjectContentCategories = "tasks" | "materials" | "notes";

export type Colors = {
  color1: string;
  color2: string;
  color3: string;
};
