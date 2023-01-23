import { combineReducers } from "redux";
import { StudentData } from "./AllStudentDataReducer";
import { ClassesReducer } from "./ClassesReducer";
import { GetUserDataById } from "./GetUserData";
import { PasswordReset } from "./ResetPassReducer";
import { GetSearchValue } from "./SearchReducer";
import { UpdateCounsellorData } from "./UpdateCounsellorReducer";
import { UpdateStudentData } from "./UpdateStudentReducer";


const reducers = combineReducers({
  allClasses: ClassesReducer,
  getUserData:GetUserDataById,
  updateCounData:UpdateCounsellorData,
  allStudent:StudentData,
  searchValue:GetSearchValue,
  passwordReset:PasswordReset,
  updateStudent:UpdateStudentData,
});
export default reducers;