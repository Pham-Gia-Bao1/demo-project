import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService.ts";
import { message } from "antd";
import { Task } from "../models/Task.ts";
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const tasks = await taskService.getTasks();
  return tasks;
});

export const addTaskAsync = createAsyncThunk(
  "tasks/addTask",
  async (
    { tasks, newTask }: { tasks: Task[]; newTask: Task },
    { rejectWithValue }
  ) => {
    try {
      console.log("Adding task11111:", newTask);
      const updatedTasks: Task[] = await taskService.addTask(tasks, newTask);
      return updatedTasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Tạo thunk để cập nhật task bất đồng bộ
export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async (
    { tasks, updatedTask }: { tasks: Task[]; updatedTask: Task },
    { rejectWithValue }
  ) => {
    try {
      const updatedTasks: Task[] = await taskService.updateTask(tasks, updatedTask);
      return updatedTasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Tạo thunk để xóa task bất đồng bộ
export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTask",
  async ({ tasks, id }: { tasks: Task[]; id: string }, { rejectWithValue }) => {
    try {
      const updatedTasks: Task[] = await taskService.deleteTask(tasks, id);
      return updatedTasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [] as Task[], // Initialize tasks as an empty array of Task type
  loading: false as boolean, // Add loading state
  error: null as string | null | undefined, // Add error state
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
      state.tasks = action.payload.map((task: Task) => ({
        ...task,
        date: task.date
          ? typeof task.date === "string"
            ? task.date
            : task.date.format("YYYY-MM-DD")
          : null, // Handle null case for task.date
      }));
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Set loading state
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
        state.tasks = action.payload
          ? action.payload.map((task: Task) => ({
              ...task,
              date: task.date
                ? typeof task.date === "string"
                  ? task.date
                  : task.date.format("YYYY-MM-DD")
                : null, // Handle null case for task.date
            }))
          : []; // Set to an empty array if payload is null
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true; // Set loading to true when adding a task
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when task is added
        state.tasks = action.payload;
        message.success("Task added successfully!");
      })
      .addCase(addTaskAsync.rejected, (state) => {
        state.loading = false; // Set loading to false on error
        message.error("Failed to add task!");
      })
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true; // Set loading to true when updating a task
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when task is updated
        state.tasks = action.payload;
        message.success("Task updated successfully!");
      })
      .addCase(updateTaskAsync.rejected, (state) => {
        state.loading = false; // Set loading to false on error
        message.error("Failed to update task!");
      })
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true; // Set loading to true when deleting a task
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when task is deleted
        state.tasks = action.payload;
        message.success("Task deleted successfully!");
      })
      .addCase(deleteTaskAsync.rejected, (state) => {
        state.loading = false; // Set loading to false on error
        message.error("Failed to delete task!");
      });
  },
});

// Removed `updateTask` and `deleteTask` from the exported actions as they are not defined in the reducers
export const {
  searchTask,
  filterTaskByDate,
  resetTasks,
  filterTaskByStatus,
  filterTaskByPriority,
  setTasks,
  sortTasks,
  setLoading,
} = taskSlice.actions;

export default taskSlice.reducer;
