import  io  from "socket.io-client";
import React, { useEffect, useRef, useState } from 'react';
import {Box,FormControl,styled,Grid, Container,Modal,Button,FormControlLabel,Table,TableBody,TableCell,TableContainer,TableHead,TablePagination,TableRow,TableSortLabel,Typography,Paper,Switch, NativeSelect, Avatar} from '@mui/material';
import alert1 from '../../images/white-alert.svg';
import alert2 from '../../images/black-alert.svg';
import { API, BASE_URL, SOCKET_URL } from "../../config/config";
import { stylePopup } from "../css/style";
import { setDefaultLocale } from "react-datepicker";
import axios from "axios";
import { authHeader } from "../../comman/authToken";
import { handleLogout } from "../header";

const PushNotification = () => {

  const [socketConnecttion, setSocketConnected] = useState(false);

  var socket;

  useEffect(() => {
    socket = io.connect(SOCKET_URL);
    socket.on("connected", () => setSocketConnected(true));
 
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  
    // const socket = useRef(io(SOCKET_URL), { transports: ['websocket'] });
    const [red, setRed] = useState(false);
    const [yellow, setYellow] = useState(false);
    const [dismiss, setDismiss] = useState(false);
    const [allDismiss, setAllDismiss] = useState(false);
    const [black, setBlack] = useState(false);
    const [data, setData] = useState('');
    const [allData, setAllData] = useState([]);

    useEffect(() =>
   {
    socket.on("noty", () => {
      setRed(true);
    });
    socket.on("yellownoty", () => {
      setYellow(true);
    });
    socket.on("blacknoty", () => {
      setBlack(true);
    });
    socket.on("dismissNotication", (res) => {
      setData(res);
      setDismiss(true);
    });
    socket.on("dismissAllNotication", (ress) => {
      
       axios.get(`${API.getStudent}`, { headers: authHeader() }).then((res)=>{
        for(var i=0;i < (ress.selectedRow.length);i++){ 
          res.data.data.filter((item)=>{ 
            if(item._id === (ress.selectedRow[i])){ 
              allData.push(item)
                setAllDismiss(true);
            }
          }) 
        }
      }).catch((err) => {
        if (err.response.status === 401) {
          handleLogout()
        }
      });
    });
    
  }, [socket]);

  const handleRed = () => {
    setRed(false);
  };
  const handleYelllow = () => {
    setYellow(false);
  };
  const handleBlack = () => {
    setBlack(false);
  };
  const handleDismissNoty = () => {
    setDismiss(false);
  };
  const handleAllDismissNoty = () => {
    setAllDismiss(false);
  };

  const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
  var unique = uniqueArray(allData);

  return (
    <div>
                {
                  <Modal
                    open={red}
                    onClose={handleRed}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="red">
                         <span className='icon'> <img src={alert1} className="" alt="logo" /></span>

                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                        <h2 className="red-text">Code Red !</h2>
                         <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy </p>
                         <Button className="red-btn" onClick={handleRed}>OK</Button>
                      </Typography>
                      
                    </Box>
                  </Modal>
                }
                {
                  <Modal
                    open={yellow}
                    onClose={handleYelllow}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="yellow">
                      <span className='icon'> <img src={alert2} className="" alt="logo" /></span>
                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                      <h2 className="yellow-text">Code Yellow !</h2>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy </p>
                         <Button className="yellow-btn" onClick={handleYelllow}>OK</Button>
                      </Typography>
                      
                    </Box>
                  </Modal>
                }
                {
                  <Modal
                    open={black}
                    onClose={handleBlack}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="black">
                      <span className='icon'> <img src={alert1} className="" alt="logo" /></span>
                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                      <h2 className="black-text">Code Black !</h2>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy </p>
                         <Button className="black-btn" onClick={handleBlack}>OK</Button>
                      </Typography>
                    </Box>
                  </Modal>
                }
             
                  {
                  <Modal
                    open={dismiss}
                    onClose={handleDismissNoty}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="red">
                         <span className='icon'> <img src={alert1} className="" alt="logo" /></span>

                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                        <h4 className="red-text">Student Name : 
                         <p>{data ? data.name :""} {data ? data.lastName : "" }</p></h4>
                         <Button className="red-btn" onClick={handleDismissNoty}>OK</Button>
                      </Typography>
                      
                    </Box>
                  </Modal>
                }
                {
                  <Modal
                    open={allDismiss}
                    onClose={handleAllDismissNoty}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="red">
                         <span className='icon'> <img src={alert1} className="" alt="logo" /></span>

                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                        <h4 className="red-text">Student Name : </h4> 
                        {unique && unique.map((item)=>(
                         <span>{item ? item.name :""} {item ? item.lastName : "" },</span>
                         ))}
                        
                         <Button className="red-btn" onClick={handleAllDismissNoty}>OK</Button>
                      </Typography>
                      
                    </Box>
                  </Modal>
                  }
               
    </div>
  )
}

export default PushNotification