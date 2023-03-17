import  io  from "socket.io-client";
import React, { useEffect, useState } from 'react';
import {Box,Modal,Button,Typography} from '@mui/material';
import alert1 from '../../images/white-alert.svg';
import alert2 from '../../images/black-alert.svg';
import { SOCKET_URL } from "../../config/config";
import { stylePopup } from "../css/style";


const PushNotification = () => {

  var socket;
  
    const [red, setRed] = useState(false);
    const [yellow, setYellow] = useState(false);
    const [dismiss, setDismiss] = useState(false);
    const [allDismiss, setAllDismiss] = useState(false);
    const [black, setBlack] = useState(false);
    const [data, setData] = useState('');
    const [allData, setAllData] = useState([]);

    useEffect(() =>
    {
     socket = io.connect(SOCKET_URL);
     socket.on("connected", () => {});
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
    
    return () => {
      socket.disconnect();
    };
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
                  { localStorage.getItem('role') !== 'manager' &&
                  <Modal
                    open={dismiss}
                    onClose={handleDismissNoty}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="red">
                         <span className='icon'> <img src={alert1} className="" alt="logo" />
                         <p style={{ fontWeight: 600,  left: '36%', position: 'absolute',  top: '20%',  color: 'white', fontSize: '22px' }}>Dismissed</p></span>

                      </Typography>
                     
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                        <h4 className="red-text">Student Name : <span> {data ? data.name :""} {data ? data.lastName : "" }</span></h4>
                        <p>Dismiss Reason : {data && data.dismissReason} </p>
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