import { createSlice } from "@reduxjs/toolkit";
import { taskService } from "../services/taskService";

const initialState = {
  tasks: taskService.getTasks(),
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks = taskService.addTask(state.tasks, action.payload);
    },
    updateTask: (state, action) => {
      state.tasks = taskService.updateTask(state.tasks, action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = taskService.deleteTask(state.tasks, action.payload);
    },
    searchTask: (state, action) => {
      state.tasks = taskService.searchTask(state.tasks, action.payload);
    },
  },
});

export const { addTask, updateTask, deleteTask, searchTask } = taskSlice.actions;
export default taskSlice.reducer;