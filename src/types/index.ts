export type CategoryType =
  | "estudo"
  | "trabalho"
  | "saude"
  | "lazer"
  | "essencial";

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isCompleted: boolean;
  category: CategoryType;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  tasks: Task[];
}

export const CategoryColors: Record<CategoryType, string> = {
  estudo: "#3B82F6",
  trabalho: "#EF4444",
  saude: "#10B981",
  lazer: "#F59E0B",
  essencial: "#8B5CF6",
};
