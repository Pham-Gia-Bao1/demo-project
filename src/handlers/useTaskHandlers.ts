import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { FormInstance } from "antd/lib/form";
import moment, { Moment } from "moment";
import { AppDispatch } from "../store/store.ts"; // Import the correct dispatch type
import { addTaskAsync, updateTaskAsync, deleteTaskAsync, fetchTasks, setTasks,  searchTask } from "../store/taskSlice.ts";
import { Task } from "../models/Task.ts";

interface FilterCriteria {
  status?: string;
  priority?: string;
  date?: string | Moment | null;
}

interface State {
  tasks: {
    tasks: Task[];
  };
}

const initialTask: Task = { id : "", title: "", status: "", priority: "", date: "" };

type UseTaskHandlers = (
  setNewTask: (task: Task) => void,
  setEditTask: (task: Task) => void,
  setShowAddModal: (show: boolean) => void,
  setShowEditModal: (show: boolean) => void,
  setShowDeleteModal: (id: string | null) => void,
  form: FormInstance,
  editTask: Task | null
) => {
  handleAddTask: (e: React.FormEvent, taskData: Task) => Promise<void>;
  handleEditTask: (task: Task) => void;
  handleUpdateTask: (e: React.FormEvent, taskData: Task) => Promise<void>;
  handleDeleteTask: (id: string) => void;
  confirmDelete: (id: string) => Promise<void>;
  handleSearchTask: (searchTerm: string) => void;
  handleAddSubmit: (values: Task) => void;
  handleEditSubmit: (values: Task) => void;
  filterTasks: (filter: FilterCriteria) => void;
};

const useTaskHandlers: UseTaskHandlers = (
  setNewTask,
  setEditTask,
  setShowAddModal,
  setShowEditModal,
  setShowDeleteModal,
  form,
  editTask
) => {
  const dispatch: AppDispatch = useDispatch(); // Use the correct dispatch type
  const tasks: Task[] = useSelector((state: State) => state.tasks.tasks);

  const resetAddForm = () => setNewTask(initialTask);

  const handleAddTask = async (e: React.FormEvent, taskData: Task) => {
    e.preventDefault();
    if (!taskData.title || !taskData.date) {
      return;
    }
    try {
      await dispatch(addTaskAsync({ tasks, newTask: taskData }));
      dispatch(fetchTasks());
      resetAddForm();
      setShowAddModal(false);
    } catch (error) {
      showError("Failed to add task");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e: React.FormEvent, taskData: Task) => {
    e.preventDefault();
    try {
      await dispatch(updateTaskAsync({ tasks, updatedTask: taskData }));
      setShowEditModal(false);
      dispatch(fetchTasks());
    } catch (error) {
      showError("Failed to update task");
    }
  };

  const handleDeleteTask = (id: string) => {
    setShowDeleteModal(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await dispatch(deleteTaskAsync({ tasks, id }));
      dispatch(fetchTasks());
    } catch (error) {
      showError("Failed to delete task");
    } finally {
      setShowDeleteModal(null);
    }
  };

  const handleAddSubmit = (values: Task) => {
    const formattedDate = values.date && moment.isMoment(values.date)
      ? values.date.format("YYYY-MM-DD")
      : values.date ? moment(values.date).format("YYYY-MM-DD") : null;
    handleAddTask(
      { preventDefault: () => {} } as React.FormEvent,
      { ...values, date: formattedDate ? moment(formattedDate) : null }
    );
    form.resetFields();
  };

  const handleEditSubmit = (values: Task) => {
    const formattedDate = values.date && moment.isMoment(values.date)
      ? values.date.format("YYYY-MM-DD")
      : values.date ? moment(values.date).format("YYYY-MM-DD") : null;
    handleUpdateTask(
      { preventDefault: () => {} } as React.FormEvent,
      { ...editTask, ...values, date: formattedDate ? moment(formattedDate) : null }
    );
  };

  const handleSearchTask = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      dispatch(fetchTasks());
    } else {
      dispatch(searchTask(searchTerm));
    }
  };

  const handleSelectEvent = (event: { id: string }) => {
    form.resetFields();
    const task = tasks.find((t) => t.id === event.id);
    if (task) {
      const taskWithMomentDate = { ...task, date: moment(task.date) };
      handleEditTask(taskWithMomentDate);
      form.setFieldsValue(taskWithMomentDate);
    }
  };

  const filterTasks = (filter: FilterCriteria) => {
    if (!filter.status && !filter.priority && !filter.date) {
      dispatch(fetchTasks());
      return;
    }

    const filteredTasks = tasks.filter((task) => {
      if (filter.status && task.status !== filter.status) return false;
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.date && task.date !== filter.date) return false;
      return true;
    });

    dispatch(setTasks(filteredTasks));
  };

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

export const showSuccess = (msg: string) => message.success(msg);
export const showError = (msg: string) => message.error(msg);

export default useTaskHandlers;
