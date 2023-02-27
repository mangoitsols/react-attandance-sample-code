import React, { useState, useRef, useEffect } from "react";
import { Avatar, Stack } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import Divider from "@mui/material/Divider";
import { handleLogout } from "../header";
import { API, BASE_URL } from "../../config/config";
import { authHeader } from "../../comman/authToken";
toast.configure();

export default function ImageAvatars() {

  const [isActive, setActive] = useState("true");
  const [name, setName] = useState(localStorage.getItem("name"));
  const [lastname, setLastname] = useState(localStorage.getItem("lastname"));
  const [newPass,setNewPass]=useState(""); 

  const ToggleClass = () => {
    setActive(!isActive);
  };

  useEffect(()=>{
    getUser()
  },[])

  const getUser = () => {
    const id = localStorage.getItem("id")
   fetch(`${API.getUser}/${id}`, { headers: authHeader() }
    )
                .then((res) => res.json())
                .then((json) => {
                  setNewPass(json)
                }).catch((err) => {
                  if (err.response.status === 401) {
                    handleLogout()
                  }
                })
  }

  return (
    <React.Fragment>
      <div className="securityAlert">
        <div>
          <img className="mr-2" src={require("../../images/security.png")} />
          Security Alert
        </div>
        <ul>
          <li>
            {" "}
            <img src={require("../../images/red alert.png")} />{" "}
          </li>
          <li>
            {" "}
            <img src={require("../../images/yellow alert.png")} />{" "}
          </li>
          <li>
            {" "}
            <img src={require("../../images/black alert.png")} />{" "}
          </li>
        </ul>
      </div>
      <Stack direction="row" spacing={2}>
        <Avatar
          alt={name}
          src={localStorage.getItem('image') && localStorage.getItem("image").startsWith('uploads/') ? `${BASE_URL}/${localStorage.getItem("image")}` :  newPass.data &&  `${BASE_URL}/${newPass.data[0].image}`}
          sx={{ width: 56, height: 56 }}
        />
        <span>
          <div onClick={ToggleClass}>
          <strong>{name?.charAt(0)?.toUpperCase() + name?.slice(1)}{" "}{lastname?.charAt(0)?.toUpperCase() + lastname?.slice(1)}</strong>
          <small> {localStorage.getItem("role")} </small>
          <span className="arrow" >
            <ArrowBackIosOutlinedIcon />
          </span>
          </div>
          <div className={isActive ? "toggleNone" : "active"}>
            <div className="myprofileToggle">
              <Avatar
                alt={name}
                src={localStorage.getItem('image') && localStorage.getItem("image").startsWith('uploads/') ? `${BASE_URL}/${localStorage.getItem("image")}` :  newPass.data &&  `${BASE_URL}/${newPass.data[0].image}`}
                sx={{ width: 56, height: 56 }}
              />
              <span>
                <strong>{name?.charAt(0)?.toUpperCase() + name?.slice(1)}{" "}{lastname?.charAt(0)?.toUpperCase() + lastname?.slice(1)}</strong>
                <small> {localStorage.getItem("role")} </small>
              </span>
              <a href="/cprofile">Counsellor Profile</a>
              <Divider />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </span>
      </Stack>
    </React.Fragment>
  );
}
