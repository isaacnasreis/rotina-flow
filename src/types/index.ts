export type CategoryType =
  | "deepwork"
  | "flow"
  | "recharge"
  | "connect"
  | "ops";

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isCompleted: boolean;
  category?: string;
  blockId?: string;
  createdAt: Date;
}

export interface Block {
  id: string;
  name: string;
  order: number;
  userId: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  tasks: Task[];
}

export const CategoryColors: Record<string, string> = {
  deepwork: "#d946ef",
  flow: "#06b6d4",
  recharge: "#10b981",
  connect: "#f97316",
  ops: "#94a3b8",
};
