export const taskService = {
  // Lấy danh sách tasks (initial mock data)
  getTasks: () => {
    return [
      {
        id: 1,
        title: "Hoàn thành báo cáo",
        status: "Đang thực hiện",
        priority: "Cao",
        date: "2025-04-05",
      },
      {
        id: 2,
        title: "Gặp khách hàng",
        status: "Chưa bắt đầu",
        priority: "Trung bình",
        date: "2025-04-06",
      },
    ];
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
};
