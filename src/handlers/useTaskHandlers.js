import { useDispatch } from 'react-redux';
import { addTask, deleteTask, updateTask } from '../store/taskSlice';
import { message } from 'antd';

const initialTask = { title: '', status: '', priority: '', date: null };

const useTaskHandlers = (
  setNewTask,
  setEditTask,
  setShowAddModal,
  setShowEditModal,
  setShowDeleteModal
) => {
  const dispatch = useDispatch();

  const resetAddForm = () => setNewTask(initialTask);

  const showSuccess = (msg) => message.success(msg);
  const showError = (msg) => message.error(msg);

  const handleAddTask = async (e, taskData) => {
    e.preventDefault();
    try {
      await dispatch(addTask(taskData));
      showSuccess('Thêm công việc thành công!');
      resetAddForm();
      setShowAddModal(false);
    } catch (error) {
      showError('Thêm công việc thất bại!');
    }
  };

  const handleEditTask = (task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e, taskData) => {
    e.preventDefault();
    try {
      await dispatch(updateTask(taskData));
      showSuccess('Cập nhật công việc thành công!');
      setShowEditModal(false);
    } catch (error) {
      showError('Cập nhật công việc thất bại!');
    }
  };

  const handleDeleteTask = (id) => {
    setShowDeleteModal(id);
  };

  const confirmDelete = async (id) => {
    try {
      await dispatch(deleteTask(id));
      showSuccess('Xóa công việc thành công!');
    } catch (error) {
      showError('Xóa công việc thất bại!');
    } finally {
      setShowDeleteModal(null);
    }
  };

  return {
    handleAddTask,
    handleEditTask,
    handleUpdateTask,
    handleDeleteTask,
    confirmDelete,
  };
};

export default useTaskHandlers;
