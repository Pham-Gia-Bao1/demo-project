import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  DatePicker,
  message,
  Card,
  Tag,
} from "antd";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment, { Moment } from "moment";
import "moment/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useTaskHandlers from "../../handlers/useTaskHandlers.ts";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  resetTasks,
  filterTaskByStatus,
  filterTaskByPriority,
  filterTaskByDate,
  fetchTasks,
} from "../../store/taskSlice.ts";
import { DeleteOutlined } from "@ant-design/icons";
import { RootState, AppDispatch } from "../../store/store.ts";
import { Task } from "../../models/Task.ts";


const DnDCalendar = withDragAndDrop(Calendar);

const { Option } = Select;

moment.locale("vi");
const localizer = momentLocalizer(moment);

type Filters = {
  status: string | undefined;
  priority: string | undefined;
  date: Moment | undefined;
};

type HomePageProps = {
  isLoggedIn: boolean;
  user: { id: string; name: string } | null;
};

const HomePage: React.FC<HomePageProps> = ({ isLoggedIn, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);

  const [newTask, setNewTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
    priority: undefined,
    date: undefined,
  });
  const {
    handleAddTask,
    handleEditTask,
    handleUpdateTask,
    handleDeleteTask,
    handleSearchTask,
    confirmDelete,
    handleAddSubmit,
    handleEditSubmit,
    filterTasks,
  } = useTaskHandlers(
    setNewTask,
    setEditTask,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
    form,
    editTask,
  );

  const handleEditTaskWrapper = (task: Task | null) => {
    if (task) {
      handleEditTask(task);
    }
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetTasks());
    if (filters.status) {
      dispatch(filterTaskByStatus(filters.status));
    }
    if (filters.priority) {
      dispatch(filterTaskByPriority(filters.priority));
    }
    if (filters.date) {
      dispatch(filterTaskByDate(filters.date.format("YYYY-MM-DD")));
    }
  }, [filters, dispatch]);

  useEffect(() => {
    filterTasks(filters);
  }, [filters, dispatch]);

  const calendarEvents = Array.isArray(tasks)
    ? tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start: moment(task.date).toDate(),
        end: moment(task.date).toDate(),
        resource: { status: task.status, priority: task.priority },
      }))
    : [];

  const handleEventDrop = ({ event, start }: any) => {
    const task = tasks.find((t) => t.id === event.id);
    if (task) {
      const updatedTask: Task = {
        ...task,
        date: moment(start).format("YYYY-MM-DD HH:mm"),
      };
      handleUpdateTask({ preventDefault: () => {} } as React.FormEvent, updatedTask);
    }
  };

  const handleSelectEvent = (event: any) => {
    form.resetFields();
    const task = tasks.find((t) => t.id === event.id);
    if (task) {
      const taskWithMomentDate = { ...task, date: moment(task.date) };
      handleEditTaskWrapper(taskWithMomentDate);
      form.setFieldsValue(taskWithMomentDate);
      setSelectedDate(moment(task.date));
    }
  };

  const openAddModal = () => {
    form.resetFields();
    setNewTask({ title: "", status: "", priority: "", date: "" } as Task);
    form.setFieldsValue({ userId: user?.id });
    setSelectedDate(moment());
    setShowAddModal(true);
  };

  const EventComponent: React.FC<{ event: any }> = ({ event }) => (
    <Card
      size="small"
      bordered
      style={{ marginBottom: 8, backgroundColor: "#ffff" }}
      title={event.title}
      extra={
        <DeleteOutlined
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(event.id);
          }}
          className="event-delete-icon"
        />
      }
    >
      <Tag color={getStatusColor(event.resource?.status)}>
        {event.resource?.status || "No status"}
      </Tag>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "#f39c12";
      case "In Progress":
        return "#3498db";
      case "Completed":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  return (
    <main className="homepage">
      <h2 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "20px", fontSize: "32px", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
        Welcome {isLoggedIn && user ? user.name : "Guest"}!
      </h2>
      <p style={{ textAlign: "center", color: "#7f8c8d", fontSize: "18px", marginBottom: "30px" }}>
        {isLoggedIn ? "Manage your tasks below:" : "Please log in to manage your tasks."}
      </p>

      {isLoggedIn && (
        <div className="task-manager">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="searchBox">
              <Button
                type="primary"
                onClick={openAddModal}
                style={{ marginBottom: 24 }}
                disabled={loading} // Disable button when loading
              >
                Add New Task
              </Button>

              <div className="search-bar" style={{ marginLeft: 16 }}>
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search tasks"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearchTask(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Add Task Modal */}
          <Modal
            title={
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                Add New Task
              </span>
            }
            open={showAddModal}
            onCancel={() => setShowAddModal(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleAddSubmit} layout="vertical">
              <Form.Item
                hidden
                name="userId"
                label="User ID"
                rules={[
                  { required: true, message: "Please enter the user ID!" },
                ]}
              >
                <Input hidden placeholder="User ID" />
              </Form.Item>
              <Form.Item
                name="title"
                label="Task Name"
                rules={[
                  { required: true, message: "Please enter the task name!" },
                ]}
              >
                <Input placeholder="Task Name" />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select a status!" }]}
              >
                <Select placeholder="Select status">
                  <Option value="Not Started">Not Started</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[
                  { required: true, message: "Please select a priority!" },
                ]}
              >
                <Select placeholder="Select priority">
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="Date and Time"
                rules={[
                  { required: true, message: "Please select a date and time!" },
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
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Edit Task Modal */}
          <Modal
            title={
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                Edit Task
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
              initialValues={editTask || undefined} // Convert null to undefined
            >
              <Form.Item
                name="title"
                label="Task Name"
                rules={[
                  { required: true, message: "Please enter the task name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select a status!" }]}
              >
                <Select>
                  <Option value="Not Started">Not Started</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[
                  { required: true, message: "Please select a priority!" },
                ]}
              >
                <Select>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="Date and Time"
                rules={[
                  { required: true, message: "Please select a date and time!" },
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
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    {loading ? "Updating..." : "Save"}
                  </Button>
                  <Button onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            title={
              <span style={{ color: "#e74c3c", fontWeight: "600" }}>
                Confirm Deletion
              </span>
            }
            open={!!showDeleteModal}
            onOk={() => {
              if (showDeleteModal) {
                confirmDelete(showDeleteModal);
              }
            }}
            onCancel={() => setShowDeleteModal(null)}
            okText={loading ? "Deleting..." : "Delete"}
            cancelText="Cancel"
            okButtonProps={{ danger: true, disabled: loading }}
            cancelButtonProps={{ disabled: loading }}
          >
            <p style={{ color: "#7f8c8d" }}>
              Are you sure you want to delete this task?
            </p>
          </Modal>

          {/* Task Calendar */}
          <div className="task-calendar">
            <DnDCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              onEventDrop={handleEventDrop}
              components={{
                event: (props) => (
                  <EventComponent
                    {...props}
                    handleDeleteTask={handleDeleteTask}
                  />
                ),
              }}
              style={{ height: 600, width: "100%", backgroundColor: "#ffff" }}
            />
            <div
              style={{
                width: "250px",
                border: "1px solid #e0e0e0",
                padding: "16px",
              }}
            >
              <h3 style={{ marginBottom: "16px", color: "#34495e" }}>
                Filter Tasks
              </h3>
              <Form layout="vertical">
                <Form.Item label="Status">
                  <Select
                    allowClear
                    value={filters.status}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <Option value="Not Started">Not Started</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Completed">Completed</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Priority">
                  <Select
                    allowClear
                    value={filters.priority}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Date">
                  <DatePicker
                    allowClear
                    value={filters.date}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, date: value }))
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Button
                  onClick={() =>
                    setFilters({ status: undefined, priority: undefined, date: undefined })
                  }
                  style={{ marginTop: "8px" }}
                  block
                >
                  Clear Filters
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
