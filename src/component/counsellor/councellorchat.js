import React, {  useEffect, useRef, useState } from "react";
import Sidebar from "./sidebar";
import ImageAvatars from "./header";
import { authHeader } from "../../comman/authToken";
import { API, BASE_URL, SOCKET_URL } from "../../config/config";
import { Avatar, Button, Tooltip } from "@mui/material";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import Loader from "../../comman/loader";
import InputField from "../../comman/inputField";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../comman/12966-typing-indicator.json";
import PushNotification from "./pushnotification";
import EditableLabel from "react-inline-editing";
import moment from "moment";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogics";
import send from "../images/send.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const CouncellorChat = () => {

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnecttion, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [counsellorDet, setCounsellorDet] = useState([]);
  const userId = localStorage.getItem("id");
  const [data, setData] = useState();
  const [toggle, setToggle] = useState(false);
  const [index, setIndex] = useState('');
  const [oldMessage, setOldMessage] = useState('');

  var socket;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  

  useEffect(() => {
    socket = io.connect(SOCKET_URL);
    socket?.on("connected", () => setSocketConnected(true));
    socket.emit("setup", localStorage.getItem("id"));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    }
  }, [socket]);

  useEffect(()=>{
    handleGetCounsellorAndGroups();
  },[1])

  useEffect(() => {
    fetchMessages();
    setSearch();
  }, [chatId]);

  useEffect(() => {
    socket?.on("message recieved", (newMessageReceived) => {  
      
      let localData = localStorage.getItem("chatId");
      let chatIdLocal = (chatId ? chatId._id : localData);
     
      if(newMessageReceived[0].chat._id === chatIdLocal || newMessageReceived[0].chat._id === localData){
        setMessage( newMessageReceived)
      }
      else{
        
      }
    });
    socket?.on("count", () => {     
      toast.info("You have new message")
      handleGetCounsellorAndGroups();
    });
  },[socket]);
    
    const handleGetCounsellorAndGroups = async(data) => {
      if(!data){
        data = '';
      }
    fetch(`${API.allGCs}/${localStorage.getItem("id")}?searchkey=${data}`, {
      headers: authHeader(),
    })
      .then((a) => {
        if (a.status === 200) {
          setLoading(false);
          return a.json();
        } else {
          setLoading(true);
        }
      })
      .then((data) => {
        const dat1 =
          data && data[0].filter((e) => e._id !== localStorage.getItem("id"));
        const dat2 = data[1].filter(
          (e) => e._id !== localStorage.getItem("id")
        );
        Array.prototype.push.apply(dat1, dat2);
        setCounsellorDet(dat1);
      });
  };

  const handleSelectChatUser = async (recieverId) => {
    var chatid;
    var keys = Object.keys(recieverId);
    
    if (keys.indexOf("isGroupChat") !== -1) {
      chatid = recieverId._id;
      localStorage.setItem("chatId",'')
      localStorage.setItem("chatId",chatid)
      setChatId(recieverId);
      fetchMessages();
    }
     else {
      setMessage([]);
      const reqData = {
        userId: localStorage.getItem("id"),
        recieverId: recieverId._id,
      };
      
      await axios({
        method: "post",
        url: `${API.accessChatByChatId}`,
        data: reqData,
        headers: authHeader(),
      })
      .then((res) => {
        setChatId(res);
        localStorage.setItem("chatId",'')
        localStorage.setItem("chatId",res.data._id)
        fetchMessages();
        handleGetCounsellorAndGroups();

        })
        .catch((err) => {
          toast.error("Something went wrong");
        });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    socket = io.connect(SOCKET_URL);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    if (newMessage) {
      socket.emit("stop typing", chatId.data ? chatId.data._id : chatId._id);
      try {
        const reqData = {
          chatId: chatId.data ? chatId.data._id : chatId._id,
          content: newMessage,
          senderId: localStorage.getItem("id"),
        };
        setNewMessage("");
        const request = await axios({
          method: "post",
          url: `${API.sendMessage}`,
          data: reqData,
          headers: authHeader(),
        });
       
        let objectSeenMessage = {messagesData:counsellorDet,userid:request.data.at(-1)}
        socket.emit("notification",(objectSeenMessage))
        socket.emit("message", request.data);
        setMessage(request.data);
      } catch (error) {
        toast.error("Message not send");
      }
    }
  };

  const fetchMessages = async () => {
  
    setMessage([]);

    if (!chatId) {
      return;
    } else if (chatId) {
      if (chatId.isGroupChat === true) {
        try {
          setLoading(true);
          const data = await axios.get(`${API.getMessage}/${chatId._id}`, {
            headers: authHeader(),
          });
          setMessage(data.data);
          setLoading(false);
          socket.emit("join chat", chatId.data._id);
        } catch (error) {}
      } else if (chatId.data.isGroupChat === false) {
        setMessage([]);
        try {
          setLoading(true);
          const data = await axios.get(`${API.getMessage}/${chatId.data._id}`, {
            headers: authHeader(),
          });
          const receiverHideData = data.data.filter((item)=>{
            return item.deleteUsers.some(function(el) {
              return (el === localStorage.getItem("id") && item.deletedBy === true) 
            });         
         })
         
         var finalArrayCompare = data.data.filter(val => !receiverHideData.includes(val));
        
          setMessage(finalArrayCompare);
          setLoading(false);
          socket.emit("join chat", chatId.data._id);
        } catch (error) {}
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // if (!socketConnecttion) return;
    // socket = io.connect(SOCKET_URL);
    // socket.on("connected", () => {
    //   setSocketConnected(true);
    // });
    // if(!typing){
    // setTyping(true);
    // socket?.emit("typing", chatId.data ? chatId.data._id : chatId._id);
    //   }
    // let lastTypingTime = new Date().getTime();
    // var timerLength = 1000;
    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket?.emit("stop typing", chatId.data ? chatId.data._id : chatId._id);
    //     setTyping(false);
    //   }
    // }, timerLength);
  };

  const handleSeenGroupMessage = async(group_id,user_id) => {

    const reqData = {
      
        userId:user_id,
        groupId:group_id
        };
       
        await axios({
          method: "put",
          url: `${API.seenGroupMessage}`,
          data: reqData,
          headers: authHeader(),
        }).then((res)=>{})
  }
   
  // Scrollable feed functionality start

  const handleToggle = () => {
    setToggle(true);
  };
  
  const handleFocus = (text) => {
  
  };
  
  const handleFocusOut = (text) => {
   
    setToggle(true);
    if(oldMessage && oldMessage === text){
      toast.warning("You haven't made any changes with previous message");
    }
    else{
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
      setToggle(false);
      fetchMessages();
      toast.success("Message updated");
    })
    .catch((err) => {
      toast.error("Message can't update");
    });
  }
  };
  
  const handleDelete = async (id) => {
    setLoading(true)
    const del = await axios.delete(`${API.deleteMessage}/${id}`, {
      headers: authHeader(),
    });
    
    if (del) {
      toast.success("Message deleted");
      setToggle(false);
      setLoading(false)
      fetchMessages()
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleOnClickId =(id,oldMsg) => {
    setIndex(id);
    setOldMessage(oldMsg)
    setToggle(!toggle)
    
  }

  const handleDeleteReceiver = async (id) => {

    setLoading(true)
    const del = await axios.put(`${API.deleteMessageReceiver}/${id}`, {
      deleteUsers : localStorage.getItem("id")},{headers: authHeader()});
    
    if (del) {
      toast.success("Message deleted");
      fetchMessages()
      setToggle(false);
      setLoading(false)
    } else {
      setToggle(false);
      setLoading(false)
      toast.error("Something went wrong");
    }
}

  // Scrollable feed functionality end

  const receivername =
    chatId &&
    chatId.data &&
    chatId.data.users &&
    chatId.data.users.filter((e) => e._id !== localStorage.getItem("id"));


  return (
    <React.Fragment>

      <div className="col-md-4 col-lg-2">
        <Sidebar />
        
      </div>
      <div className="col-md-8 col-lg-10 mr-30">
        <div className="header">
          {" "}
          <ImageAvatars />
        </div>
        <PushNotification />
        <div className="heading ">
          <h1 className="mt-5">
            <span className="icon"></span>
            Chat
          </h1>
        </div>
        <div className="chat d-flex mt-4 border-top">
          <div className="chat-left col-md-2">
            <div className="mt-3">
              <h3>Message</h3>
              <SearchBar
                value={search}
                onChange={(newValue) => handleGetCounsellorAndGroups(newValue)}
                placeholder="Search Counsellor"
              />
            </div>
            <div className="createpersonal">
              <ul>
                {!loading ? (
                  counsellorDet && counsellorDet.length > 0 ? (
                    counsellorDet.map((item) => {
     
                      return (
                        <li key={item._id}>
                          <p  className="avtarimage" onClick={() => { handleSelectChatUser(item); handleSeenGroupMessage(item._id,localStorage.getItem('id')); }} >
                            {
                              <Avatar
                                alt={item.name ? item.name : item.chatName}
                                src={`${BASE_URL}/${item?.image}`}
                                sx={{ width: 56, height: 56 }}
                              />
                            }{" "}
                            {item && item.name ? item.name : item.chatName}{" "}
                            {item && item.lastname ? item.lastname : ""}
                    
                          { (item && item.readBy === 0) ? 
                            ""
                           : 
                            <span className="notfication">{item.readBy }</span>
                          }
                          </p>
                        </li>
                      );
                    })
                  ) : (
                    <p>Record not found</p>
                  )
                ) : (
                  <Loader />
                )}
              </ul>
            </div>
          </div>
          <div className="chat-right col-md-10 border-left">
            {/* counsellor chat header */}
            {chatId ? (
              chatId && chatId.data && chatId.data.isGroupChat === false ? (
                <div className="row">
                  <div className="profile-top">
                    <span className="avatar-image">
                      {
                        <Avatar
                          alt={receivername ? receivername[0].name : "Demo"}
                          src={`${BASE_URL}/${
                            receivername ? receivername[0]?.image : ""
                          }`}
                          sx={{ width: 56, height: 56 }}
                        />
                      }
                    </span>
                    <h3>
                      {receivername ? receivername[0].name : ""}{" "}
                      {receivername ? receivername[0].lastname : ""}
                    </h3>
                  </div>

                  {/* 1-1 chat Scrollable feed */}
                  <div className="chat-section">
                    {message.length === 0 ? (
                      <div className="not-found">
                        <p>Message not found</p>
                      </div>
                    ) : (
                      <div>
                        <ScrollableFeed>
                                {message &&
                                    message.map((m, i) => (
                                    <div style={{ display: "flex" }} key={i}>
                                        <div style={{ display: "none" }}>
                                        {(isSameSender(message, m, i, userId) ||
                                            isLastMessage(message, i, userId)) && (
                                            <Avatar
                                            cursor="pointer"
                                            alt="Remy Sharp"
                                            src={`${BASE_URL}/${m?.sender?.image}`}
                                            sx={{ width: 30, height: 30 }}
                                            className="mr-1 mt-1 "
                                            />
                                        )}
                                        {isSameSender(message, m, i, userId) ? (
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
                                            m?.sender?._id === userId ? "#21BAFE" : "#EAE8E8"
                                            }`,
                                            marginLeft: isSameSenderMargin(message, m, i, userId),
                                            marginTop: isSameUser(message, m, i, userId) ? 3 : 10,
                                            borderRadius: "20px",
                                            padding: "5px 15px",
                                            maxWidth: "75%",
                                            marginBottom: "20px",
                                        }}
                                        >
                                        {m && m?.sender?._id !== userId 
                                            ?  <span onClick={() => handleOnClickId(m._id)}>{m.content}</span>
                                            : (toggle ===true || toggle === false)
                                            ? toggle === true && m._id === index ?<Tooltip title="Click on the message" arrow>
                                          <span style={{color:"white"}}>Edit</span>
                                          </Tooltip>:<span onClick={() => handleOnClickId(m._id,m.content)}>{ m.content}</span> 
                                            : ""}

                                        {m && m._id === index && m.sender._id === userId && toggle? (
                                            <EditableLabel
                                            text={m.content}
                                            inputWidth="100px"
                                            onFocus={handleFocus}
                                            onFocusOut={handleFocusOut}
                                            
                                            />
                                        ) : (
                                            ""
                                        )}
                                        </span>
                                        {loading ? <Loader/> : ""}
                                        {m && m._id === index && m.sender._id === userId && toggle ? (
                                        <>
                                            <span className="mt-3 m-2" onClick={() => handleDelete(m._id)}>
                                            <i className='fa fa-trash-o' style={{color:"red",fontSize:"23px"}} ></i>
                                            </span>
                                        </>
                                        ) : (
                                        ""
                                        )}

                                        {/* receiver msg delete */}

                                        {m && m._id === index && m.sender._id !== userId && toggle ? (
                                            <>
                                          
                                                <span className="mt-3 m-2" onClick={() => handleDeleteReceiver(m._id)}>
                                                <i className='fa fa-trash-o' style={{color:"red",fontSize:"23px"}} ></i>

                                                </span>
                                            </>
                                            ) : (
                                            ""
                                            )}
                                    </div>
                                ) )}
                                </ScrollableFeed>
                      </div>
                    )}
                    <div className="chatmessage">
                      {isTyping ? (
                        <div>
                          <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{ marginBottom: 15, marginLeft: 0 }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <form method="POST" onSubmit={(e) =>handleSendMessage(e)} style={{width: '100%', display: 'flex'}}>                     
                      
                      <InputField
                        id="message"
                        name="message"
                        className="form-control"
                        placeholder="type here..."
                        value={newMessage}
                        onChange={(e) => typingHandler(e)}
                      />
                      <Button
                        type="submit"
                        >
                       <img src={send} className="" alt="logo" />
                      </Button>
                      </form>
                      
                    </div>
                  </div>
                </div>
              ) : (
                // group chat header
                <div className="row">
                  <div className="profile-top">
                    <span className="avatar-image">
                      {
                        <Avatar
                          alt={chatId ? chatId.chatName.charAt(0).toUpperCase() + chatId.chatName.slice(1) : ""}
                          src={`${BASE_URL}/${chatId ? chatId?.image : ""}`}
                          sx={{ width: 56, height: 56 }}
                        />
                      }
                    </span>
                    <h3>{chatId ? chatId.chatName.charAt(0).toUpperCase() + chatId.chatName.slice(1) : ""}</h3>
                    {chatId.users.map((member,index) => {
          
                      return (
                        <div key={index} >
                          
                        {member.name === localStorage.getItem("name")
                            ? 'you'  
                            : "," + member.name }
                      </div>
                          
                      
                      );
                    })}
                  </div>

                  {/* Group chat Scrollable feed */}
                  {message.length === 0 ? (
                    <p>Message not found</p>
                  ) : (
                    <div>
                       <ScrollableFeed>
                                {message &&
                                    message.map((m, i) => (
                                    <div style={{ display: "flex" }} key={i}>
                                        <div style={{ display: "none" }}>
                                        {(isSameSender(message, m, i, userId) ||
                                            isLastMessage(message, i, userId)) && (
                                            <Avatar
                                            cursor="pointer"
                                            alt="Remy Sharp"
                                            src={`${BASE_URL}/${m?.sender?.image}`}
                                            sx={{ width: 30, height: 30 }}
                                            className="mr-1 mt-1 "
                                            />
                                        )}
                                        {isSameSender(message, m, i, userId) ? (
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
                                            m?.sender?._id === userId ? "#21BAFE" : "#EAE8E8"
                                            }`,
                                            marginLeft: isSameSenderMargin(message, m, i, userId),
                                            marginTop: isSameUser(message, m, i, userId) ? 3 : 10,
                                            borderRadius: "20px",
                                            padding: "5px 15px",
                                            maxWidth: "75%",
                                            marginBottom: "20px",
                                        }}
                                        >
                                        {m && m?.sender?._id !== userId 
                                            ?  <span onClick={() => handleOnClickId(m._id)}>{m.content}</span>
                                            : (toggle ===true || toggle === false)
                                            ? toggle === true && m._id === index ? <span style={{color:"white"}}>Edit</span> :<span onClick={() => handleOnClickId(m._id,m.content)}>{ m.content}</span> 
                                            : ""}

                                        {m && m._id === index && m.sender._id === userId && toggle? (
                                            <EditableLabel
                                            text={m.content}
                                            inputWidth="100px"
                                            onFocus={handleFocus}
                                            onFocusOut={handleFocusOut}
                                            
                                            />
                                        ) : (
                                            ""
                                        )}
                                        </span>
                                        {loading ? <Loader /> : ""}
                                        {m && m._id === index && m.sender._id === userId && toggle ? (
                                        <>
                                            <span className="mt-3 m-2" onClick={() => handleDelete(m._id)}>
                                            <i className='fa fa-trash-o' style={{color:"red",fontSize:"23px"}} ></i>
                                            </span>
                                        </>
                                        ) : (
                                        ""
                                        )}

                                        {/* receiver msg delete */}

                                        {m && m._id === index && m.sender._id !== userId && toggle ? (
                                            <>
                                      
                                                <span className="mt-3 m-2" onClick={() => handleDeleteReceiver(m._id)}>
                                                <i className='fa fa-trash-o' style={{color:"red",fontSize:"23px"}} ></i>

                                                </span>
                                            </>
                                            ) : (
                                            ""
                                            )}
                                    </div>
                                ) )}
                                </ScrollableFeed>
                    </div>
                  )}
                  <div className="chatmessage">
                    {isTyping ? (
                      <div>
                        <Lottie
                          options={defaultOptions}
                          width={70}
                          style={{ marginBottom: 15, marginLeft: 0 }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                    <form method='POST' onSubmit={(e) =>handleSendMessage(e)} style={{width: '100%', display: 'flex'}}>
                    <InputField
                      id="message"
                      name="message"
                      className="form-control"
                      placeholder="type here..."
                      value={newMessage}
                      onChange={(e) => typingHandler(e)}
                    />
                    <Button type="submit">
                    <img src={send} className="" alt="logo" />
                    </Button>
                    </form>
                    </div>
                  </div>
                </div>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CouncellorChat;
