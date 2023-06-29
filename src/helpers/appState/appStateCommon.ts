export interface AppState {
  count: number;
}

export const createIncrementAction = (): { type: "Increment" } => ({
  type: "Increment",
});

export type IncrementAction = ReturnType<typeof createIncrementAction>;

export type Action = IncrementAction;

export const reducer = (currentAppState: AppState, action: Action) => {
  switch (action.type) {
    case "Increment": {
      return {
        ...currentAppState,
        count: currentAppState.count + 1,
      };
    }
  }
};

export const initialState: AppState = {
  count: 0,
};

export const APP_STATE_CHANNEL = "APP_STATE_CHANNEL" as const;
