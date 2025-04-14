import { apiTask } from "../config/apiConfig";
import Cookies from "js-cookie";

export const taskService = {
  getToken: () => {
    // Lấy token từ Cookie
    const token = Cookies.get("authToken");
    console.log("Token:", token);
    if (!token) {
      console.log("No token found");
      return null;
    }
    return token;
  },
  getTasks: async () => {
    const token = taskService.getToken();
    console.log("Token:", token);

    if (token) {
      try {
        const { data : { data }} = await apiTask.get("/tasks");
        console.log("Tasks response:", data);
        return data || [];
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
      }
    }

    return null;
  },
  // Thêm task mới
  addTask: async (tasks, newTask) => {
    console.log("Tasks before adding:", tasks);
    console.log("Adding task21312312:", newTask);

    // Validate required fields
    if (!newTask || !newTask.title || !newTask.date || !newTask.status || !newTask.priority) {
      console.error("Invalid task data provided. All fields are required:", newTask);
      return tasks;
    }

    try {
      const token = taskService.getToken();
      console.log("Token:", token);
      if (token) {
        const { data } = await apiTask.post("/tasks", newTask);
        console.log("Add task response:", data);
        return [...tasks, { id: data.id, ...data }];
      }
    } catch (error) {
      console.error("Error adding task:", error);
      return tasks;
    }

    return tasks;
  },

  // Cập nhật task
  updateTask: async (tasks, updatedTask) => {
    if (!updatedTask.title || !updatedTask.date) {
      console.error("Invalid task data. Title and date are required.", updatedTask);
      return tasks;
    }

    try {
      const token = taskService.getToken();
      if (!token) {
        console.error("No token found. Cannot update task.");
        return tasks;
      }

      const { data } = await apiTask.put(`/tasks/${updatedTask.id}`, updatedTask);
      return tasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...data } : task
      );
    } catch (error) {
      console.error("Error updating task:", error);
      return tasks;
    }
  },

  // Xóa task
  deleteTask: async (tasks, id) => {
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
  // Tìm kiếm task
  searchTask: (tasks, keyword) => {
    if (!keyword) return taskService.getTasks();
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(keyword.toLowerCase())
    );
  },
  // Lọc task theo trạng thái
  filterTaskByStatus: (tasks, status) => {
    if (!status) return tasks;
    return tasks.filter((task) => task.status === status);
  },
  // Lọc task theo độ ưu tiên
  filterTaskByPriority: (tasks, priority) => {
    if (!priority) return tasks;
    return tasks.filter((task) => task.priority === priority);
  },
  // Lọc task theo ngày
  filterTaskByDate: (tasks, date) => {
    if (!date) return tasks;
    return tasks.filter((task) => task.date === date);
  },
  // set tasks
  setTasks: (tasks, newTasks) => {
    return newTasks;
  },
};
