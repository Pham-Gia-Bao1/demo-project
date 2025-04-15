import { Moment } from "moment";
export type Task = {
  id: string;
  title: string;
  date: string | Moment | null;
  status: string;
  priority: string;
  userId?: string;
};
export interface FilterCriteria {
  status?: string;
  priority?: string;
  date?: string | Moment | null;
}
export interface State {
  tasks: {
    tasks: Task[];
  };
}