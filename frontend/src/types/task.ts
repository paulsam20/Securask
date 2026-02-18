export interface Task {
  id: string;
  title: string;
  description: string;
  status: "active" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "active" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
