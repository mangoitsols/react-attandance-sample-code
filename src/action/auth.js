import { API } from "../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authHeader } from "../comman/authToken";
import { handleLogout } from "../component/header";
toast.configure();

export function login(data, callback) {
  const request = axios.post(`${API.login}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        if(!error.response){
         toast.error("Server is down");
        }
        else if (error.response.status === 400) {
          if (error.response.data.message === "email not found") {
            toast.error("Email does not exist");
          } else if (error.response.data.message === "password is incorrect") {
            toast.error("Password is incorrect");
          } else if (error.response.data.message === "user not Found !") {
            toast.error("Username is not found");
          }
        }
        callback(error);
      });
  };
}

export function sendMail(data, callback) {
  const request = axios.post(`${API.sendMail}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          toast.error("Email not found");
        }
        callback(error);
      });
  };
}

export function changePassword(data, callback) {
  const request = axios({
    method: "post",
    url: `${API.changePassword}`,
    data: data,
    headers: authHeader(),
  });
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          if(error.response.data.message === "OLdpassword is incorrect"){
          toast.error("Old password was incorrect");}
          else if(error.response.data.message === "confirm password is not match"){
          toast.error("Confirm password must be same as new password.");}
        }
        callback(error);
      });
  };
}

export function createPin(data, callback) {
  const request = axios({
    method: "post",
    url: `${API.createPin}`,
    data: data,
    headers: authHeader(),
  });
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        else if (error.response.status === 401) {
          handleLogout()
        }
        callback(error);
      });
  };
}

export function updatePin(data,id, callback) {
  const request = axios({
    method: "put",
    url: `${API.updatePin}/${id}`,
    data: data,
    headers: authHeader(),
  });
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          if(error.response.data.message === "OLdpin is incorrect"){
            toast.error("Incorrect old pin");
          }
          else if(error.response.data.message === "oldPin and new Pin both are not same"){
            toast.error("Old pin and New pin must be different");
          }
        }
        else if (error.response.status === 401) {
          handleLogout()
        }
        callback(error);
      });
  };
}
