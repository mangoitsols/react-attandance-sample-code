import React, { useEffect, useState } from "react";
import { Avatar, Tooltip } from "@mui/material";
import moment from "moment";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogics";
import { API, BASE_URL } from "../../config/config";
import EditableLabel from "react-inline-editing";
import axios from "axios";
import { authHeader } from "../../comman/authToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderButton from "../../comman/loader1";
import { handleLogout } from "../header";
toast.configure();

const ScrollableChat = ({ messages }) => {
  const userId = localStorage.getItem("id");
  const [data, setData] = useState();
  const [toggle, setToggle] = useState(false);
  const [index, setIndex] = useState('');
  const [loading,setLoading] = useState(false);
  const [q,setMessages] = useState([]);
  var message = q.length > 0? q : messages;

  const handleToggle = () => {
    setToggle(true);
  };
  
  const handleFocus = (text) => {
  
  };
  
  const handleFocusOut = (text) => {
   
    setToggle(true);
  
    const reqData = {
      content: text,
    };
    setLoading(true)
    const res = axios({
      method: "put",
      url: `${API.updateMessage}/${data._id}`,
      data: reqData,
      headers: authHeader(),
    })
    .then((res) => {
      setLoading(false)
      toast.success("Message updated");
    })
    .catch((err) => {
      if (err.response.status === 401) {
        handleLogout()
      }
      toast.error("Something went wrong!");
    });
  };

  const fetchMessages = async (chatId) => {

    try {
        setLoading(true)
        const data = await axios.get(`${API.getMessage}/${chatId}`, { headers: authHeader() })
        .then((res)=>{  
          setMessages(res.data);  
          setLoading(false);
        })
    }
    catch (error) {
      if (error.response.status === 401) {
        handleLogout()
      }
    };
}
  
  const handleDelete = async (id,chatId) => {
    setLoading(true)
    const del = await axios.delete(`${API.deleteMessage}/${id}`, {
      headers: authHeader(),
    }).catch((error)=>{
      if (error.response.status === 401) {
        handleLogout()
      }
    })
    
    if (del) {
      toast.success("Message deleted");
      setToggle(false);
      setLoading(false)
      fetchMessages(chatId)
    } else {
      toast.error("Something went wrong");
    }
  };

  // const handleDeleteReceiver = async (id,chatId) => {
  //   console.log(id,chatId,"rtrt")
  //   setLoading(true)
  //   const del = await axios.put(`${API.deleteMessageReceiver}/${id}`, {
  //     headers: authHeader(),
  //   });
    
  //   if (del) {
  //     toast.success("Message deleted");
  //     setToggle(false);
  //     setLoading(false)
  //     console.log(del,"ddd")
  //     fetchMessages(chatId)
  //   } else {
  //     setToggle(false);
  //     toast.error("Something went wrong");
  //   }
  // }

  const handleOnClickId =(item) => {
    setIndex(item);
    setToggle(!toggle)
  }
  return (
    <ScrollableFeed>
      {message &&
        message.map((m, i) => (
          <div style={{ display: "flex" }} key={i}>
            <div style={{ display: "none" }}>
              {(isSameSender(messages, m, i, userId) ||
                isLastMessage(messages, i, userId)) && (
                  <Avatar
                  cursor="pointer"
                  alt="Remy Sharp"
                  src={`${BASE_URL}/${m.sender.image}`}
                  sx={{ width: 30, height: 30 }}
                  className="mr-1 mt-1 "
                />
              )}
              {isSameSender(messages, m, i, userId) ? (
                <p>{moment(m.createdAt).format("hh:mm A")}</p>
              ) : (
                ""
              )}
            </div>
            <span
              onClick={() => {
                setData(m);
                handleToggle();
              }}
              style={{
                backgroundColor: `${
                  m.sender._id === userId ? "#21BAFE" : "#EAE8E8"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, userId),
                marginTop: isSameUser(messages, m, i, userId) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginBottom: "20px",
              }}
            >
              {m && m.sender._id !== userId 
                ?  <span onClick={() => handleOnClickId(m._id)}>{m.content}</span>
                : (toggle ===true || toggle === false)
                ? toggle === true ? m._id === index ? <span>Edit</span> :<span onClick={() => handleOnClickId(m._id)}>{ m.content}</span> : <span onClick={() => handleOnClickId(m._id)}>{ m.content}</span>
                : ""}

              {m && m._id === index && m.sender._id === userId && toggle? (
                <EditableLabel
                  text={m.content}
                  inputWidth="100px"
                  inputHeight="25px"
                  labelFontSize="21px"
                  onFocus={handleFocus}
                  onFocusOut={handleFocusOut}
                
                />
              ) : (
                ""
              )}
            </span>
            {loading ? <LoaderButton/> : ""}
            {m && m._id === index && m.sender._id === userId && toggle ? (
              <>
                <span className="mt-3 m-2" onClick={() => handleDelete(m._id,m.chat._id)}>
                  <img src={require("../images/delet.png")} />
                </span>
              </>
            ) : (
              ""
            )}
          </div>
       ) )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
