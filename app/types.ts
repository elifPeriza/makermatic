export type TagLabel = "all" | "in progress" | "done";

export type Project = {
  id: number;
  title: string;
  description: string | undefined;
  created_at: string;
  completed_at: string | undefined;
  notes: string | undefined;
  tutorials: string | undefined;
  materials: string[];
  todos: Todo[];
  isCompleted: boolean;
};

export type Todo = {
  text: string;
  created_at: string;
  completed_at: string | undefined;
  isCompleted: boolean;
};
