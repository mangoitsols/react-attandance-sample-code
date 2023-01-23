import { ActionTypes } from "../constant/action-types";

const initialState = {
  getSearchData: [],
};

export const GetSearchValue = (state = initialState, { type, payload }) => {
    switch (type) {
      case ActionTypes.SEARCH_KEYWORD:
        return { ...state, getSearchData: payload };
      default:
        return state;
    }
  };