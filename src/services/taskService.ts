import { apiTask } from "../config/apiConfig";
import Cookies from "js-cookie";
import { Task } from "../models/Task.ts";

export const taskService = {
  getToken: (): string | null => {
    const token = Cookies.get("authToken");
    return token || null;
  },
  getTasks: async (): Promise<Task[] | null> => {
    const token = taskService.getToken();
    if (token) {
      try {
        const {
          data: { data },
        } = await apiTask.get("/tasks");
        console.log("Fetched tasks:", data);
        return data || [];
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
      }
    }
    return null;
  },
  addTask: async (
    tasks: Task[],
    newTask: Omit<Task, "id">
  ): Promise<Task[]> => {
    if (
      !newTask.title ||
      !newTask.date ||
      !newTask.status ||
      !newTask.priority ||
      !newTask.contactName
    ) {
      console.error(
        "Invalid task data provided. All fields are required:",
        newTask
      );
      return tasks;
    }

    try {
      const token = taskService.getToken();
      if (token) {
        const { data } = await apiTask.post("/tasks", newTask);
        return [...tasks, { id: data.id, ...data }];
      }
    } catch (error) {
      console.error("Error adding task:", error);
      return tasks;
    }

    return tasks;
  },

  updateTask: async (tasks: Task[], updatedTask: Task): Promise<Task[]> => {
    if (
      !updatedTask.title ||
      !updatedTask.date 
  
    ) {
      console.error(
        "Invalid task data. Title, date, contact info are required.",
        updatedTask
      );
      return tasks;
    }

    try {
      const token = taskService.getToken();
      if (!token) {
        console.error("No token found. Cannot update task.");
        return tasks;
      }

      const { data } = await apiTask.put(
        `/tasks/${updatedTask.id}`,
        updatedTask
      );
      return tasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...data } : task
      );
    } catch (error) {
      console.error("Error updating task:", error);
      return tasks;
    }
  },

  deleteTask: async (tasks: Task[], id: string): Promise<Task[]> => {
    try {
      const token = taskService.getToken();
      if (!token) {
        console.error("No token found. Cannot delete task.");
        return tasks;
      }

      await apiTask.delete(`/tasks/${id}`);
      return tasks.filter((task) => task.id !== id);
    } catch (error) {
      console.error("Error deleting task:", error);
      return tasks;
    }
  },
  searchTask: (tasks: Task[], keyword: string): Task[] => {
    if (!Array.isArray(tasks)) return tasks;
    if (!keyword.trim()) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(keyword.toLowerCase())
    );
  },
  filterTaskByStatus: (tasks: Task[], status: string): Task[] => {
    if (!status) return tasks;
    return tasks.filter((task) => task.status === status);
  },
  filterTaskByPriority: (tasks: Task[], priority: string): Task[] => {
    if (!priority) return tasks;
    return tasks.filter((task) => task.priority === priority);
  },
  filterTaskByDate: (tasks: Task[], date: string): Task[] => {
    if (!date) return tasks;
    return tasks.filter((task) => task.date === date);
  },
};
