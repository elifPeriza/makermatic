export type TagLabel = "all" | "in progress" | "done";

export type Project = {
  id: number;
  title: string;
  description: string | undefined;
  createdAt: string;
  completedAt: string | undefined;
  notes: string | undefined;
  tutorials: string | undefined;
  materialsAtHand: string[];
  missingMaterials: string[];
  todos: Todo[];
  isCompleted: boolean;
};

export type Todo = {
  task: string;
  createdAt: string;
  completedAt?: string;
  isCompleted: boolean;
};
