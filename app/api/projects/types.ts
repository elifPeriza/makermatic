export type TagLabel = "all" | "in progress" | "done";

export type Project = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string | null;
  completedAt: string | null;
  notes: string | null;
  tutorials?: string | null;
  materialsAtHand?: string[];
  missingMaterials?: string[];
  todos?: Todo[];
  isCompleted: boolean | number;
};

export type Todo = {
  task: string;
  createdAt: string;
  completedAt?: string;
  isCompleted: boolean;
};
