import { API } from "../config/config";
import axios from "axios";
import { authHeader } from "../comman/authToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export function createClass(data, callback) {
    const request = axios.post(`${API.createClass}`, data);
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
          if(error.response.data.message === "class already exists"){
          toast.error("Class already exists");
          }
          callback(error);
        });
    };
  }

  export function getClass(callback) {
    const request = axios.get(`${API.getClass}`);
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
          callback(error);
        });
    };
  } 

  export function createCounsellorandManager(data,callback) {
    const request = axios({
      method: "post",
      url: `${API.createCounsellorandManager}`,
      data: data,
      headers: authHeader(),
    });
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
          callback(error);
        });
    };
  } 
  
  export function getUser(id,callback) {
    const request = axios.get(`${API.getUser}/${id}`, { headers: authHeader() });
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
          callback(error);
        });
    };
  } 

  export function updateUser(id,data,callback) {
    const request = axios({
      method: "put",
      url: `${API.updateUser}/${id}`,
      data: data,
      headers: authHeader(),
    });
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
          
        })
        .catch(function (error) {
          callback(error);
        });
    };
  }

  export function getAllCountry(callback) {
    const request = axios.get(`${API.getAllCountry}`);
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
          callback(error);
        });
    };
  } 

  export function getStateBYCountryId(id,callback) {
    const request = axios.get(`${API.getStateBYCountryId}/${id}`);
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
          callback(error);
        });
    };
  }