import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";

// ✅ Tạo thunk để fetch tasks bất đồng bộ
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const tasks = await taskService.getTasks();
  return tasks;
});

// ✅ Tạo thunk để thêm task bất đồng bộ
export const addTaskAsync = createAsyncThunk(
  "tasks/addTask",
  async ({ tasks, newTask }, { rejectWithValue }) => {
    try {
      console.log("Adding task11111:", newTask);
      const updatedTasks = await taskService.addTask(tasks, newTask);
      return updatedTasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Tạo thunk để cập nhật task bất đồng bộ
export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async ({ tasks, updatedTask, setTasks }, { rejectWithValue }) => {
    try {
      const updatedTasks = await taskService.updateTask(tasks, updatedTask, setTasks);
      return updatedTasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Tạo thunk để xóa task bất đồng bộ
export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTask",
  async ({ tasks, id }, { rejectWithValue }) => {
    try {
      const updatedTasks = taskService.deleteTask(tasks, id);
      return updatedTasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
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
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = action.payload;
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
