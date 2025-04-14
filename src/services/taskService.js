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
  addTask: (tasks, newTask) => {
    if (!newTask.title || !newTask.date) return tasks;
    return [...tasks, { id: tasks.length + 1, ...newTask }];
  },

  // Cập nhật task
  updateTask: (tasks, updatedTask) => {
    if (!updatedTask.title || !updatedTask.date) return tasks;
    return tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
  },

  // Xóa task
  deleteTask: (tasks, id) => {
    return tasks.filter((task) => task.id !== id);
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
