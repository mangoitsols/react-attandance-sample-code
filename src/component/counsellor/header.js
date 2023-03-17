import React, { useState, useRef, useEffect } from "react";
import { Avatar, Stack,Box,Backdrop,Typography,Button,Fade,Modal } from "@mui/material";
import  io  from "socket.io-client";
import { styleAlertPopup } from "../css/style";
import areshow from '../../images/aresure.svg';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import Divider from "@mui/material/Divider";
import { handleLogout } from "../header";
import { API, BASE_URL ,SOCKET_URL} from "../../config/config";
import { authHeader } from "../../comman/authToken";
import { capitalizeFirstLetter } from "../../comman/capitalizeFirstLetter";
toast.configure();

export default function ImageAvatars() {

  const [isActive, setActive] = useState("true");
  const [name, setName] = useState(localStorage.getItem("name"));
  const [lastname, setLastname] = useState(localStorage.getItem("lastname"));
  const [newPass,setNewPass]=useState(""); 
  const [openRed, setOpenRed] = React.useState(false);
  const [openYellow, setOpenYellow] = React.useState(false);
  const [openBlack, setOpenBlack] = React.useState(false);
  const handleOpenRed = () => setOpenRed(true);
  const handleOpenYellow = () => setOpenYellow(true);
  const handleOpenBlack = () => setOpenBlack(true);
  const handleCloseRed = () => setOpenRed(false);
  const handleCloseYellow = () => setOpenYellow(false);
  const handleCloseBlack = () => setOpenBlack(false);

  const handleRed = () => {
   let socket = io.connect(SOCKET_URL);
    socket.on("connected", () => {});
    socket.emit("sendNotification", {});
    setOpenRed(false);
  };
  const handleYellow = () => {
    let socket = io.connect(SOCKET_URL);
    socket.on("connected", () => {});
    socket.emit("sendYellowNotification", {});
    setOpenYellow(false);
  };
  const handleBlack = () => {
    let socket = io.connect(SOCKET_URL);
    socket.on("connected", () => {});
    socket.emit("sendBlackNotification", {});
    setOpenBlack(false);  
  };

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
              <div className='RedPopup'>
                 <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openRed}
                    onClose={handleCloseRed}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={openRed}>
                    <Box sx={styleAlertPopup} className="sure-popup">
                    <Typography id="transition-modal-title" variant="h6" component="div">
                          <img src={areshow} alt=""/>
                     
                        </Typography>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                        
                        Are You Sure ?
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mb: 2 }} component="div">
                        Do you really want to <span className="red-text">Code Red</span> ? 
                        </Typography>
                       
                        <Button className="blue-without-border" onClick={handleCloseRed}>CANCEL</Button>
                        <Button className="btn-blue" onClick={handleRed}>OK</Button>
                    </Box>
                    </Fade>
                </Modal>
                 </div>
                
                 <div className='YellowPopup'>
                 <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openYellow}
                    onClose={handleCloseYellow}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={openYellow}>
                    <Box sx={styleAlertPopup} className="sure-popup">
                    <Typography id="transition-modal-title" variant="h6" component="div">
                          <img src={areshow} alt=""/>
                     
                        </Typography>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                        
                        Are You Sure ?
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mb: 2 }} component="div">
                        Do you really want to <span className="yellow-text">Code Yellow</span> ? 
                        </Typography>
                       
                        <Button className="blue-without-border" onClick={handleCloseYellow}>CANCEL</Button>
                        <Button className="btn-blue" onClick={handleYellow}>OK</Button>
                    </Box>
                    </Fade>
                </Modal>
                 </div>

                 <div className='BlackPopup'>
                 <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openBlack}
                    onClose={handleCloseBlack}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={openBlack}>
                    <Box sx={styleAlertPopup} className="sure-popup">
                    <Typography id="transition-modal-title" variant="h6" component="div">
                          <img src={areshow} alt=""/>
                     
                        </Typography>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                        
                        Are You Sure ?
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mb: 2 }} component="div">
                        Do you really want to <span className="black-text">Code Black</span> ? 
                        </Typography>
                       
                        <Button className="blue-without-border" onClick={handleCloseBlack}>CANCEL</Button>
                        <Button className="btn-blue" onClick={handleBlack}>OK</Button>
                    </Box>
                    </Fade>
                </Modal>
                 </div>
        <div>
          <img className="mr-2" src={require("../../images/security.png")} alt='Alternate Message'/>
          Security Alert
        </div>
        <ul>
          <li onClick={handleOpenRed}>
            {" "}
            <img src={require("../../images/red alert.png")} alt='Alternate Message' />{" "}
          </li>
          <li onClick={handleOpenYellow}>
            {" "}
            <img src={require("../../images/yellow alert.png")} alt='Alternate Message'/>{" "}
          </li>
          <li onClick={handleOpenBlack}>
            {" "}
            <img src={require("../../images/black alert.png")} alt='Alternate Message'/>{" "}
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
          <strong>{capitalizeFirstLetter(name)}{" "}{capitalizeFirstLetter(lastname)}</strong>
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
                <strong>{capitalizeFirstLetter(name)}{" "}{capitalizeFirstLetter(lastname)}</strong>
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
