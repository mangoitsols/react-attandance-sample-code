import { ActionTypes } from "../constant/action-types";

const initialState = {
  updateStudent: [],
};

export const UpdateStudentData = (state = initialState, { type, payload }) => {
    switch (type) {
      case ActionTypes.UPDATE_STUDENT:
        return { ...state, updateStudent: payload };
      default:
        return state;
    }
  };