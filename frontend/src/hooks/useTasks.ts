import { useState, useContext, useCallback } from "react";
import type { Task } from "../types/task";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axiosInstance";

export const useTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTask = useCallback(
    async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      try {
        const response = await API.post("/tasks", task);
        setTasks([...tasks, response.data]);
        return response.data;
      } catch {
        setError("Failed to create task");
        throw new Error("Failed to create task");
      }
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      try {
        const response = await API.put(`/tasks/${id}`, updates);
        setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
        return response.data;
      } catch {
        setError("Failed to update task");
        throw new Error("Failed to update task");
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await API.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t.id !== id));
      } catch {
        setError("Failed to delete task");
        throw new Error("Failed to delete task");
      }
    },
    [tasks]
  );

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
