import { ActionTypes } from "../constant/action-types";

const initialState = {
  updateCounsellor: [],
};

export const UpdateCounsellorData = (state = initialState, { type, payload }) => {
    switch (type) {
      case ActionTypes.UPDATE_COUNSELLOR:
        return { ...state, updateCounsellor: payload };
      default:
        return state;
    }
  };