import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";

// ✅ Tạo thunk để fetch tasks bất đồng bộ
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const tasks = await taskService.getTasks();
  return tasks;
});

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks = taskService.addTask(action.payload) || state.tasks;
    },
    updateTask: (state, action) => {
      state.tasks = taskService.updateTask(state.tasks, action.payload) || state.tasks;
    },
    deleteTask: (state, action) => {
      state.tasks = taskService.deleteTask(state.tasks, action.payload) || state.tasks;
    },
    searchTask: (state, action) => {
      state.tasks = taskService.searchTask(state.tasks, action.payload) || state.tasks;
    },
    filterTaskByStatus: (state, action) => {
      state.tasks = taskService.filterTaskByStatus(state.tasks, action.payload) || state.tasks;
    },
    filterTaskByPriority: (state, action) => {
      state.tasks = taskService.filterTaskByPriority(state.tasks, action.payload) || state.tasks;
    },
    filterTaskByDate: (state, action) => {
      state.tasks = taskService.filterTaskByDate(state.tasks, action.payload) || state.tasks;
    },
    resetTasks: (state) => {
      state.tasks = [];
    },
    sortTasks: (state, action) => {
      const { key, order } = action.payload;
      state.tasks = [...state.tasks].sort((a, b) =>
        order === "asc" ? (a[key] > b[key] ? 1 : -1) : (a[key] < b[key] ? 1 : -1)
      );
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  searchTask,
  filterTaskByDate,
  resetTasks,
  filterTaskByStatus,
  filterTaskByPriority,
  setTasks,
  sortTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
