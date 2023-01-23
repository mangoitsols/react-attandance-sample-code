import { ActionTypes } from "../constant/action-types";

const initialState = {
  getStuData: [],
};
export const StudentData = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.GET_ALL_STUDENT_DATA:
      return { ...state, getStuData: payload };
    default:
      return state;
  }
};

