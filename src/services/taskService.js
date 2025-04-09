export const taskService = {
  // Lấy danh sách tasks (initial mock data)
  getTasks: () => {
    return [
      { id: 1, title: "Complete report", status: "In Progress", priority: "High", date: "2025-04-05" },
      { id: 2, title: "Meet with client", status: "Not Started", priority: "Medium", date: "2025-04-06" },
      { id: 3, title: "Design interface", status: "Completed", priority: "Low", date: "2025-04-04" },
      { id: 4, title: "Plan project", status: "In Progress", priority: "High", date: "2025-04-07" },
      { id: 5, title: "Review source code", status: "Not Started", priority: "Medium", date: "2025-04-08" },
      { id: 6, title: "Team meeting", status: "In Progress", priority: "Low", date: "2025-04-05" },
      { id: 7, title: "Update documents", status: "Completed", priority: "Medium", date: "2025-04-03" },
      { id: 8, title: "Write test cases", status: "Not Started", priority: "High", date: "2025-04-09" },
      { id: 9, title: "Fix interface bugs", status: "In Progress", priority: "High", date: "2025-04-10" },
      { id: 10, title: "Deploy beta version", status: "Not Started", priority: "High", date: "2025-04-11" },
      { id: 11, title: "Evaluate performance", status: "Completed", priority: "Low", date: "2025-04-02" },
      { id: 12, title: "Research new technology", status: "In Progress", priority: "Medium", date: "2025-04-06" },
      { id: 13, title: "Create feedback form", status: "Not Started", priority: "Low", date: "2025-04-12" },
      { id: 14, title: "Prepare presentation slides", status: "In Progress", priority: "Medium", date: "2025-04-07" },
      { id: 15, title: "Prepare demo", status: "Completed", priority: "High", date: "2025-04-04" },
      { id: 16, title: "Update system", status: "In Progress", priority: "Medium", date: "2025-04-08" },
      { id: 17, title: "Backup data", status: "Not Started", priority: "High", date: "2025-04-09" },
      { id: 18, title: "Compile feedback statistics", status: "Completed", priority: "Low", date: "2025-04-05" },
      { id: 19, title: "Optimize website speed", status: "In Progress", priority: "High", date: "2025-04-10" },
      { id: 20, title: "Check security", status: "Not Started", priority: "High", date: "2025-04-11" },
      { id: 21, title: "Analyze user data", status: "In Progress", priority: "Medium", date: "2025-04-12" },
      { id: 22, title: "Create new wireframe", status: "Completed", priority: "Low", date: "2025-04-03" },
      { id: 23, title: "Study AI course", status: "Not Started", priority: "High", date: "2025-04-13" },
      { id: 24, title: "Review colleague's code", status: "Completed", priority: "Medium", date: "2025-04-04" },
      { id: 25, title: "Design new logo", status: "Not Started", priority: "Low", date: "2025-04-15" },
      { id: 26, title: "Build search function", status: "In Progress", priority: "High", date: "2025-04-07" },
      { id: 27, title: "Write blog post", status: "Not Started", priority: "Medium", date: "2025-04-16" },
      { id: 28, title: "Test system performance", status: "In Progress", priority: "High", date: "2025-04-17" },
      { id: 29, title: "Update README", status: "Completed", priority: "Low", date: "2025-04-05" },
      { id: 30, title: "Train new employees", status: "Not Started", priority: "High", date: "2025-04-18" },
      { id: 31, title: "Run A/B testing", status: "In Progress", priority: "Medium", date: "2025-04-19" },
      { id: 32, title: "Prepare financial report", status: "Completed", priority: "High", date: "2025-04-06" },
      { id: 33, title: "Plan advertising campaign", status: "Not Started", priority: "Medium", date: "2025-04-20" },
      { id: 34, title: "Write API documentation", status: "In Progress", priority: "Low", date: "2025-04-21" },
      { id: 35, title: "Fix login issues", status: "In Progress", priority: "High", date: "2025-04-22" },
      { id: 36, title: "Work with partners", status: "Not Started", priority: "Medium", date: "2025-04-23" },
      { id: 37, title: "Prepare internal workshop", status: "Completed", priority: "Low", date: "2025-04-07" },
      { id: 38, title: "Write automation script", status: "In Progress", priority: "Medium", date: "2025-04-24" },
      { id: 39, title: "Maintain server", status: "Not Started", priority: "High", date: "2025-04-25" },
      { id: 40, title: "Test product", status: "In Progress", priority: "High", date: "2025-04-26" },
      { id: 41, title: "Evaluate staff", status: "Not Started", priority: "Medium", date: "2025-04-27" },
      { id: 42, title: "Create learning roadmap", status: "Completed", priority: "High", date: "2025-04-08" },
      { id: 43, title: "Read technology book", status: "Not Started", priority: "Low", date: "2025-04-28" },
      { id: 44, title: "Test new framework", status: "In Progress", priority: "Medium", date: "2025-04-29" },
      { id: 45, title: "Send quotation", status: "Completed", priority: "High", date: "2025-04-30" },
      { id: 46, title: "Test interface", status: "Not Started", priority: "Low", date: "2025-05-01" },
      { id: 47, title: "Set up CI/CD", status: "In Progress", priority: "High", date: "2025-05-02" },
      { id: 48, title: "Standardize source code", status: "Completed", priority: "Medium", date: "2025-05-03" },
      { id: 49, title: "Write user guide", status: "Not Started", priority: "Low", date: "2025-05-04" },
      { id: 50, title: "Publish product to store", status: "In Progress", priority: "High", date: "2025-05-05" },
      { id: 51, title: "Update contact form", status: "Completed", priority: "Low", date: "2025-05-06" },
      { id: 52, title: "Fix mobile view bugs", status: "Not Started", priority: "Medium", date: "2025-05-07" },
      { id: 53, title: "Send marketing email", status: "In Progress", priority: "Medium", date: "2025-05-08" },
      { id: 54, title: "Assign user permissions", status: "Not Started", priority: "High", date: "2025-05-09" },
      { id: 55, title: "Upgrade system", status: "In Progress", priority: "High", date: "2025-05-10" },
      { id: 56, title: "Design new icons", status: "Completed", priority: "Low", date: "2025-05-11" },
      { id: 57, title: "Track website visits", status: "In Progress", priority: "Medium", date: "2025-05-12" },
      { id: 58, title: "Optimize database", status: "Not Started", priority: "High", date: "2025-05-13" },
      { id: 59, title: "Assign team tasks", status: "Completed", priority: "Medium", date: "2025-05-14" },
      { id: 60, title: "Create work schedule", status: "In Progress", priority: "Low", date: "2025-05-15" },
      { id: 61, title: "Integrate payment", status: "Not Started", priority: "High", date: "2025-05-16" },
      { id: 62, title: "Test Dark Mode", status: "In Progress", priority: "Low", date: "2025-05-17" },
      { id: 63, title: "Create statistics API", status: "Not Started", priority: "Medium", date: "2025-05-18" },
      { id: 64, title: "Build admin dashboard", status: "In Progress", priority: "High", date: "2025-05-19" },
      { id: 65, title: "Update push notifications", status: "Completed", priority: "Low", date: "2025-05-20" },
      { id: 66, title: "Survey users", status: "Not Started", priority: "Medium", date: "2025-05-21" },
      { id: 67, title: "Write unit tests", status: "In Progress", priority: "High", date: "2025-05-22" },
      { id: 68, title: "Research market", status: "Completed", priority: "Medium", date: "2025-04-07" },
      { id: 69, title: "Integrate OAuth2", status: "Not Started", priority: "High", date: "2025-04-07" },
      { id: 70, title: "Create contact form", status: "In Progress", priority: "Low", date: "2025-04-07" },
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
