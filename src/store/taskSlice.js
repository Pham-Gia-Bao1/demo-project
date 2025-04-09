// taskSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";

const initialState = {
  tasks: taskService.getTasks() || [], // Added fallback to empty array
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks = taskService.addTask(state.tasks, action.payload) || state.tasks;
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
      state.tasks = taskService.getTasks() || [];
    },
    sortTasks: (state, action) => {
      const { key, order } = action.payload;
      state.tasks = [...state.tasks].sort((a, b) => {  // Create new array to avoid mutating state directly
        if (order === "asc") {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      });
    },
    setTasks: (state, action) => {
      state.tasks = taskService.setTasks(state.tasks, action.payload) || action.payload;
    },
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
  sortTasks 
} = taskSlice.actions;
export default taskSlice.reducer;