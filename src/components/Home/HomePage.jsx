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
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Thêm dòng này

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
  const [selectedDate, setSelectedDate] = useState(moment()); // Thêm state để đồng bộ ngày

  const {
    handleAddTask,
    handleEditTask,
    handleUpdateTask,
    handleDeleteTask,
    confirmDelete,
  } = useTaskHandlers(
    setNewTask,
    setEditTask,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal
  );

  // Chuyển đổi tasks thành events cho calendar
  const calendarEvents = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.date),
    end: new Date(task.date),
    allDay: true,
    resource: { status: task.status, priority: task.priority },
  }));

  // Xử lý kéo thả sự kiện trên calendar
  const handleEventDrop = ({ event, start }) => {
    const updatedTask = {
      ...tasks.find((t) => t.id === event.id),
      date: moment(start).format("YYYY-MM-DD"),
    };
    handleUpdateTask({ preventDefault: () => {} }, updatedTask);
  };

  // Xử lý submit khi thêm task
  const handleAddSubmit = (values) => {
    const formattedDate = values.date.format("YYYY-MM-DD");
    handleAddTask(
      { preventDefault: () => {} },
      { ...values, date: formattedDate }
    );
    form.resetFields();
  };

  // Xử lý submit khi chỉnh sửa task
  const handleEditSubmit = (values) => {
    const formattedDate = values.date.format("YYYY-MM-DD");
    handleUpdateTask(
      { preventDefault: () => {} },
      { ...editTask, ...values, date: formattedDate }
    );
  };

  // Xử lý khi chọn một sự kiện trên calendar
  const handleSelectEvent = (event) => {
    form.resetFields();
    const task = tasks.find((t) => t.id === event.id);
    if (task) {
      const taskWithMomentDate = { ...task, date: moment(task.date) };
      handleEditTask(taskWithMomentDate);
      form.setFieldsValue(taskWithMomentDate);
    }
  };

  // Mở modal thêm task
  const openAddModal = () => {
    form.resetFields();
    setShowAddModal(true);
  };

  const EventComponent = ({ event, handleDeleteTask }) => (

    <div className="event-container">
      <div>
        <span className="event-title">{event.title}</span>
        <DeleteOutlined
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(event.id);
          }}
          className="event-delete-icon"
        />
      </div>
      <p>{event.title}</p>
      <p>{event.status}</p>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="searchBox">
              <Button
                type="primary"
                onClick={openAddModal}
                style={{ marginBottom: 24 }}
              >
                Thêm công việc mới
              </Button>
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search" />
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
                label="Ngày"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
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
                label="Ngày"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
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
              components={{ event: EventComponent }}
              style={{ height: "100%" }}
              date={selectedDate.toDate()}
              onNavigate={(newDate) => setSelectedDate(moment(newDate))}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
