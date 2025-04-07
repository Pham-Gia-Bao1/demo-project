export const taskService = {
 // Lấy danh sách tasks (initial mock data)
 getTasks: () => {
  return [
    { id: 1, title: "Hoàn thành báo cáo", status: "Đang thực hiện", priority: "Cao", date: "2025-04-05" },
    { id: 2, title: "Gặp khách hàng", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-04-06" },
    { id: 3, title: "Thiết kế giao diện", status: "Hoàn thành", priority: "Thấp", date: "2025-04-04" },
    { id: 4, title: "Lập kế hoạch dự án", status: "Đang thực hiện", priority: "Cao", date: "2025-04-07" },
    { id: 5, title: "Kiểm tra mã nguồn", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-04-08" },
    { id: 6, title: "Họp nhóm", status: "Đang thực hiện", priority: "Thấp", date: "2025-04-05" },
    { id: 7, title: "Cập nhật tài liệu", status: "Hoàn thành", priority: "Trung bình", date: "2025-04-03" },
    { id: 8, title: "Viết test case", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-09" },
    { id: 9, title: "Fix lỗi giao diện", status: "Đang thực hiện", priority: "Cao", date: "2025-04-10" },
    { id: 10, title: "Triển khai bản beta", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-11" },
    { id: 11, title: "Đánh giá hiệu suất", status: "Hoàn thành", priority: "Thấp", date: "2025-04-02" },
    { id: 12, title: "Nghiên cứu công nghệ mới", status: "Đang thực hiện", priority: "Trung bình", date: "2025-04-06" },
    { id: 13, title: "Tạo biểu mẫu phản hồi", status: "Chưa bắt đầu", priority: "Thấp", date: "2025-04-12" },
    { id: 14, title: "Làm slide thuyết trình", status: "Đang thực hiện", priority: "Trung bình", date: "2025-04-07" },
    { id: 15, title: "Chuẩn bị demo", status: "Hoàn thành", priority: "Cao", date: "2025-04-04" },
    { id: 16, title: "Cập nhật hệ thống", status: "Đang thực hiện", priority: "Trung bình", date: "2025-04-08" },
    { id: 17, title: "Backup dữ liệu", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-09" },
    { id: 18, title: "Thống kê feedback", status: "Hoàn thành", priority: "Thấp", date: "2025-04-05" },
    { id: 19, title: "Tối ưu tốc độ website", status: "Đang thực hiện", priority: "Cao", date: "2025-04-10" },
    { id: 20, title: "Kiểm tra bảo mật", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-11" },
    { id: 21, title: "Phân tích dữ liệu người dùng", status: "Đang thực hiện", priority: "Trung bình", date: "2025-04-12" },
    { id: 22, title: "Tạo wireframe mới", status: "Hoàn thành", priority: "Thấp", date: "2025-04-03" },
    { id: 23, title: "Học khóa học AI", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-13" },
    { id: 24, title: "Review code đồng nghiệp", status: "Hoàn thành", priority: "Trung bình", date: "2025-04-04" },
    { id: 25, title: "Thiết kế logo mới", status: "Chưa bắt đầu", priority: "Thấp", date: "2025-04-15" },
    { id: 26, title: "Xây dựng chức năng tìm kiếm", status: "Đang thực hiện", priority: "Cao", date: "2025-04-07" },
    { id: 27, title: "Tạo bài viết blog", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-04-16" },
    { id: 28, title: "Test hiệu năng hệ thống", status: "Đang thực hiện", priority: "Cao", date: "2025-04-17" },
    { id: 29, title: "Cập nhật README", status: "Hoàn thành", priority: "Thấp", date: "2025-04-05" },
    { id: 30, title: "Đào tạo nhân viên mới", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-18" },
    { id: 31, title: "Thử nghiệm A/B", status: "Đang thực hiện", priority: "Trung bình", date: "2025-04-19" },
    { id: 32, title: "Làm báo cáo tài chính", status: "Hoàn thành", priority: "Cao", date: "2025-04-06" },
    { id: 33, title: "Lập kế hoạch quảng cáo", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-04-20" },
    { id: 34, title: "Viết tài liệu API", status: "Đang thực hiện", priority: "Thấp", date: "2025-04-21" },
    { id: 35, title: "Fix lỗi đăng nhập", status: "Đang thực hiện", priority: "Cao", date: "2025-04-22" },
    { id: 36, title: "Làm việc với đối tác", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-04-23" },
    { id: 37, title: "Chuẩn bị workshop nội bộ", status: "Hoàn thành", priority: "Thấp", date: "2025-04-07" },
    { id: 38, title: "Viết script automation", status: "Đang thực hiện", priority: "Trung bình", date: "2025-04-24" },
    { id: 39, title: "Bảo trì server", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-25" },
    { id: 40, title: "Chạy thử sản phẩm", status: "Đang thực hiện", priority: "Cao", date: "2025-04-26" },
    { id: 41, title: "Đánh giá nhân sự", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-04-27" },
    { id: 42, title: "Tạo lộ trình học tập", status: "Hoàn thành", priority: "Cao", date: "2025-04-08" },
    { id: 43, title: "Đọc sách công nghệ", status: "Chưa bắt đầu", priority: "Thấp", date: "2025-04-28" },
    { id: 44, title: "Thử nghiệm framework mới", status: "Đang thực hiện", priority: "Trung bình", date: "2025-04-29" },
    { id: 45, title: "Gửi báo giá", status: "Hoàn thành", priority: "Cao", date: "2025-04-30" },
    { id: 46, title: "Kiểm thử giao diện", status: "Chưa bắt đầu", priority: "Thấp", date: "2025-05-01" },
    { id: 47, title: "Thiết lập CI/CD", status: "Đang thực hiện", priority: "Cao", date: "2025-05-02" },
    { id: 48, title: "Chuẩn hóa mã nguồn", status: "Hoàn thành", priority: "Trung bình", date: "2025-05-03" },
    { id: 49, title: "Viết tài liệu hướng dẫn", status: "Chưa bắt đầu", priority: "Thấp", date: "2025-05-04" },
    { id: 50, title: "Đăng sản phẩm lên store", status: "Đang thực hiện", priority: "Cao", date: "2025-05-05" },
    { id: 51, title: "Cập nhật contact form", status: "Hoàn thành", priority: "Thấp", date: "2025-05-06" },
    { id: 52, title: "Fix lỗi mobile view", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-05-07" },
    { id: 53, title: "Gửi email marketing", status: "Đang thực hiện", priority: "Trung bình", date: "2025-05-08" },
    { id: 54, title: "Phân quyền người dùng", status: "Chưa bắt đầu", priority: "Cao", date: "2025-05-09" },
    { id: 55, title: "Nâng cấp hệ thống", status: "Đang thực hiện", priority: "Cao", date: "2025-05-10" },
    { id: 56, title: "Thiết kế icon mới", status: "Hoàn thành", priority: "Thấp", date: "2025-05-11" },
    { id: 57, title: "Thống kê lượt truy cập", status: "Đang thực hiện", priority: "Trung bình", date: "2025-05-12" },
    { id: 58, title: "Tối ưu hóa cơ sở dữ liệu", status: "Chưa bắt đầu", priority: "Cao", date: "2025-05-13" },
    { id: 59, title: "Giao nhiệm vụ nhóm", status: "Hoàn thành", priority: "Trung bình", date: "2025-05-14" },
    { id: 60, title: "Tạo lịch làm việc", status: "Đang thực hiện", priority: "Thấp", date: "2025-05-15" },
    { id: 61, title: "Tích hợp thanh toán", status: "Chưa bắt đầu", priority: "Cao", date: "2025-05-16" },
    { id: 62, title: "Thử nghiệm Dark Mode", status: "Đang thực hiện", priority: "Thấp", date: "2025-05-17" },
    { id: 63, title: "Tạo API thống kê", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-05-18" },
    { id: 64, title: "Làm dashboard quản trị", status: "Đang thực hiện", priority: "Cao", date: "2025-05-19" },
    { id: 65, title: "Cập nhật thông báo push", status: "Hoàn thành", priority: "Thấp", date: "2025-05-20" },
    { id: 66, title: "Khảo sát người dùng", status: "Chưa bắt đầu", priority: "Trung bình", date: "2025-05-21" },
    { id: 67, title: "Viết unit test", status: "Đang thực hiện", priority: "Cao", date: "2025-05-22" },
    { id: 68, title: "Nghiên cứu thị trường", status: "Hoàn thành", priority: "Trung bình", date: "2025-04-07" },
    { id: 69, title: "Tích hợp OAuth2", status: "Chưa bắt đầu", priority: "Cao", date: "2025-04-07" },
    { id: 70, title: "Tạo form liên hệ", status: "Đang thực hiện", priority: "Thấp", date: "2025-04-07" }
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
