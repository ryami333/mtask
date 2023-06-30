export interface Todo {
  uuid: string;
  title: string;
}

export interface AppState {
  todos: Todo[];
}

export const initialState: AppState = {
  todos: [],
};
