import { ActionTypes } from "../../constant/action-types";

export const getClasses = (banData) => {
  return {
    type: ActionTypes.GET_CLASSES,
    payload: banData,
  };
};

export const getDataUserById = (userData) => {
    return {
      type: ActionTypes.GET_USERDATA,
      payload: userData,
    };
  };

export const updateCounsellor = (counsellorData) => {
  return {
    type: ActionTypes.UPDATE_COUNSELLOR,
    payload: counsellorData,
  };
};

export const getStudentData = (studentData) => {
  return {
    type: ActionTypes.GET_ALL_STUDENT_DATA,
    payload: studentData,
  };
};

export const getSearch = (studentData) => {
  return {
    type: ActionTypes.SEARCH_KEYWORD,
    payload: studentData,
  };
};

export const resetPassword = (resetPass) => {
  return {
    type: ActionTypes.RESET_PASSWORD,
    payload: resetPass,
  };
};

export const updateStudent = (updateStu) => {
  return {
    type: ActionTypes.UPDATE_STUDENT,
    payload: updateStu,
  };
};
