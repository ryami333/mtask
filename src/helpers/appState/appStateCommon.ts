export interface Todo {
  uuid: string;
  title: string;
}

export interface AppState {
  todos: Todo[];
}

export const createAddTodoAction = (
  todo: Todo
): { type: "AddTodo"; todo: Todo } => ({
  type: "AddTodo",
  todo,
});

export const createRemoveTodoAction = (
  uuid: string
): { type: "RemoveTodo"; uuid: string } => ({
  type: "RemoveTodo",
  uuid,
});

export type AddTodoAction = ReturnType<typeof createAddTodoAction>;
export type RemoveTodoAction = ReturnType<typeof createRemoveTodoAction>;

export type Action = AddTodoAction | RemoveTodoAction;

export const reducer = (currentAppState: AppState, action: Action) => {
  switch (action.type) {
    case "AddTodo": {
      return {
        ...currentAppState,
        todos: [...currentAppState.todos, action.todo],
      };
    }
    case "RemoveTodo": {
      return {
        ...currentAppState,
        todos: currentAppState.todos.filter(
          (todo) => todo.uuid !== action.uuid
        ),
      };
    }
  }
};

export const initialState: AppState = {
  todos: [],
};

export const APP_STATE_CHANNEL = "APP_STATE_CHANNEL" as const;
