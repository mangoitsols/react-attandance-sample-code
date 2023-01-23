import { ActionTypes } from "../constant/action-types";

const initialState = {
  postNewPass: [],
};

export const PasswordReset = (state = initialState, { type, payload }) => {
    switch (type) {
      case ActionTypes.RESET_PASSWORD:
        return { ...state, postNewPass: payload };
      default:
        return state;
    }
  };