import { Task } from "@/types";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    })),
}));
