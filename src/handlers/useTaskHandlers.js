import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask,
  updateTask,
  searchTask,
  addTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  fetchTasks
} from "../store/taskSlice";
import { message } from "antd";

const initialTask = { title: "", status: "", priority: "", date: null };

const useTaskHandlers = (
  setNewTask,
  setEditTask,
  setShowAddModal,
  setShowEditModal,
  setShowDeleteModal,
  form,
  editTask
) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Access tasks from Redux store

  const resetAddForm = () => setNewTask(initialTask);

  const showSuccess = (msg) => message.success(msg);
  const showError = (msg) => message.error(msg);

  const handleAddTask = (e, taskData) => {
    e.preventDefault();
    console.log("Adding task:", taskData);
    if (!taskData.title || !taskData.date) {
      showError("Vui lòng nhập đầy đủ thông tin công việc!");
      return;
    }
    try {
      dispatch(addTaskAsync({ tasks, newTask: taskData }));
      showSuccess("Thêm công việc thành công!");
      resetAddForm();
      setShowAddModal(false);
    } catch (error) {
      showError("Thêm công việc thất bại!");
    }
  };

  const handleEditTask = (task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e, taskData) => {
    e.preventDefault();
    try {
      await dispatch(updateTaskAsync({ tasks, updatedTask: taskData }));
      showSuccess("Cập nhật công việc thành công!");
      setShowEditModal(false);
      dispatch(fetchTasks()); // Refresh tasks after successful update
    } catch (error) {
      showError("Cập nhật công việc thất bại!");
    }
  };

  const handleDeleteTask = (id) => {
    setShowDeleteModal(id);
  };

  const confirmDelete = async (id) => {
    try {
      await dispatch(deleteTaskAsync({ tasks, id }));
      dispatch(fetchTasks()); // Refresh tasks after successful update
      showSuccess("Xóa công việc thành công!");
    } catch (error) {
      showError("Xóa công việc thất bại!");
    } finally {
      setShowDeleteModal(null);
    }
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

  // Search function using dispatch
  const handleSearchTask = (searchTerm) => {
    dispatch(searchTask(searchTerm));
  };

  const handleSelectEvent = (event) => {
    form.resetFields();
    const task = tasks.find((t) => t.id === event.id);
    if (task) {
      const taskWithMomentDate = { ...task, date: moment(task.date) };
      handleEditTask(taskWithMomentDate);
      form.setFieldsValue(taskWithMomentDate);
    }
  };

  const filterTasks = (filter) => {
    const filteredTasks = tasks.filter((task) => {
      if (filter.status && task.status !== filter.status) return false;
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.date && task.date !== filter.date) return false;
      return true;
    });
    dispatch(setTasks(filteredTasks));
  }

  return {
    handleAddTask,
    handleEditTask,
    handleUpdateTask,
    handleDeleteTask,
    confirmDelete,
    handleSearchTask,
    handleAddSubmit,
    handleEditSubmit,
    filterTasks
  };
};

export default useTaskHandlers;
