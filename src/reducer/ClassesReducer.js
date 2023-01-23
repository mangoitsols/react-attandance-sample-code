import { ActionTypes } from "../constant/action-types";

const initialState = {
  getClassesData: [],
};
export const ClassesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.GET_CLASSES:
      return { ...state, getClassesData: payload };
    default:
      return state;
  }
};

