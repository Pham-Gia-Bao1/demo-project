import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Form, Input, Select, Space, DatePicker } from "antd";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Thêm locale tiếng Việt
import "react-big-calendar/lib/css/react-big-calendar.css";
import useTaskHandlers from "../../handlers/useTaskHandlers";
import { DeleteOutlined } from "@ant-design/icons";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const DnDCalendar = withDragAndDrop(Calendar);

const { Option } = Select;

// Đặt locale tiếng Việt cho moment
moment.locale("vi");
const localizer = momentLocalizer(moment);

const HomePage = ({ isLoggedIn, user }) => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const [newTask, setNewTask] = useState({
    title: "",
    status: "",
    priority: "",
    date: null,
  });
  const [editTask, setEditTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [searchTerm, setSearchTerm] = useState("");

  const {
    handleAddTask,
    handleEditTask,
    handleUpdateTask,
    handleDeleteTask,
    handleSearchTask,
    confirmDelete,
    handleAddSubmit,
    handleEditSubmit,
  } = useTaskHandlers(
    setNewTask,
    setEditTask,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
    form,
    editTask
  );

  // Chuyển đổi tasks thành sự kiện lịch với giờ
  const calendarEvents = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: moment(task.date).toDate(),
    end: moment(task.date).toDate(), // Có thể thêm duration nếu cần
    resource: { status: task.status, priority: task.priority },
  }));

  // Xử lý kéo thả sự kiện trên lịch
  const handleEventDrop = ({ event, start }) => {
    const updatedTask = {
      ...tasks.find((t) => t.id === event.id),
      date: moment(start).format("YYYY-MM-DD HH:mm"),
    };
    handleUpdateTask({ preventDefault: () => {} }, updatedTask);
  };

  // Xử lý khi chọn một sự kiện trên lịch
  const handleSelectEvent = (event) => {
    form.resetFields();
    const task = tasks.find((t) => t.id === event.id);
    if (task) {
      const taskWithMomentDate = { ...task, date: moment(task.date) };
      handleEditTask(taskWithMomentDate);
      form.setFieldsValue(taskWithMomentDate);
      setSelectedDate(moment(task.date)); // Đồng bộ selectedDate
    }
  };

  // Mở modal thêm task
  const openAddModal = () => {
    form.resetFields();
    setNewTask({ title: "", status: "", priority: "", date: null });
    setSelectedDate(moment());
    setShowAddModal(true);
  };

  // Component hiển thị sự kiện trên lịch
  const EventComponent = ({ event, handleDeleteTask }) => (
    <div className="event-container">
      <div>
        <span className="event-title">
          {event.title} ({moment(event.start).format("HH:mm")})
        </span>
        <DeleteOutlined
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(event.id);
          }}
          className="event-delete-icon"
        />
      </div>
    </div>
  );

  return (
    <main className="homepage">
      <h2
        style={{
          color: "#2c3e50",
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "32px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Chào mừng {isLoggedIn && user ? user.name : "Khách"}!
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "#7f8c8d",
          fontSize: "18px",
          marginBottom: "30px",
        }}
      >
        {isLoggedIn
          ? "Quản lý công việc của bạn dưới đây:"
          : "Vui lòng đăng nhập để quản lý công việc."}
      </p>

      {isLoggedIn && (
        <div className="task-manager">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="searchBox">
              <Button
                type="primary"
                onClick={openAddModal}
                style={{ marginBottom: 24 }}
              >
                Thêm công việc mới
              </Button>
              <div className="search-bar" style={{ marginLeft: 16 }}>
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm công việc"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearchTask(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modal Thêm Task */}
          <Modal
            title={
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                Thêm công việc mới
              </span>
            }
            open={showAddModal}
            onCancel={() => setShowAddModal(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleAddSubmit} layout="vertical">
              <Form.Item
                name="title"
                label="Tên công việc"
                rules={[
                  { required: true, message: "Vui lòng nhập tên công việc!" },
                ]}
              >
                <Input placeholder="Tên công việc" />
              </Form.Item>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="Chưa bắt đầu">Chưa bắt đầu</Option>
                  <Option value="Đang thực hiện">Đang thực hiện</Option>
                  <Option value="Hoàn thành">Hoàn thành</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[
                  { required: true, message: "Vui lòng chọn độ ưu tiên!" },
                ]}
              >
                <Select placeholder="Chọn độ ưu tiên">
                  <Option value="Cao">Cao</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Thấp">Thấp</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày và Giờ"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày và giờ!" },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button onClick={() => setShowAddModal(false)}>Hủy</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal Chỉnh sửa Task */}
          <Modal
            title={
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                Chỉnh sửa công việc
              </span>
            }
            open={showEditModal}
            onCancel={() => setShowEditModal(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleEditSubmit}
              layout="vertical"
              initialValues={editTask}
            >
              <Form.Item
                name="title"
                label="Tên công việc"
                rules={[
                  { required: true, message: "Vui lòng nhập tên công việc!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select>
                  <Option value="Chưa bắt đầu">Chưa bắt đầu</Option>
                  <Option value="Đang thực hiện">Đang thực hiện</Option>
                  <Option value="Hoàn thành">Hoàn thành</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[
                  { required: true, message: "Vui lòng chọn độ ưu tiên!" },
                ]}
              >
                <Select>
                  <Option value="Cao">Cao</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Thấp">Thấp</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày và Giờ"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày và giờ!" },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button onClick={() => setShowEditModal(false)}>Hủy</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal Xác nhận Xóa */}
          <Modal
            title={
              <span style={{ color: "#e74c3c", fontWeight: "600" }}>
                Xác nhận xóa
              </span>
            }
            open={!!showDeleteModal}
            onOk={() => confirmDelete(showDeleteModal)}
            onCancel={() => setShowDeleteModal(null)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <p style={{ color: "#7f8c8d" }}>
              Bạn có chắc muốn xóa công việc này không?
            </p>
          </Modal>

          {/* Lịch Công việc */}
          <div style={{ height: "600px" }}>
            <DnDCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              onEventDrop={handleEventDrop}
              draggableAccessor={() => true}
              components={{
                event: (props) => (
                  <EventComponent
                    {...props}
                    handleDeleteTask={handleDeleteTask}
                  />
                ),
              }}
              style={{ height: "100%" }}
              date={selectedDate.toDate()}
              onNavigate={(newDate) => setSelectedDate(moment(newDate))}
              defaultView="month" // Mặc định hiển thị tuần để thấy giờ
              views={["month", "week", "day"]} // Cho phép chuyển đổi chế độ xem
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;