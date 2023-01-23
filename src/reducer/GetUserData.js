import { ActionTypes } from "../constant/action-types";

const initialState = {
  getUserData: [],
};

export const GetUserDataById = (state = initialState, { type, payload }) => {
    switch (type) {
      case ActionTypes.GET_USERDATA:
        return { ...state, getUserData: payload };
      default:
        return state;
    }
  };