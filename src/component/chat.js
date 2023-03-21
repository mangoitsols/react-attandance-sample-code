import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ImageAvatars, { handleLogout } from "./header";
import { API, BASE_URL, SOCKET_URL } from "../config/config";
import { authHeader } from "../comman/authToken";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import { InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Chip,
  Fade,
  Modal,
  Paper,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Loader from "../comman/loader";
import Loader1 from "../comman/loader1";
import { MenuProps, useStyles } from "../comman/utils";
import { toast } from "react-toastify";
import Lottie from "react-lottie";
import { Theme, useTheme } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import InputField from "../comman/inputField";
import animationData from "../comman/12966-typing-indicator.json";
import send from "./images/send.svg";
import chat from "./images/chat.svg";
import $ from "jquery";
import validate from "jquery-validation";
import ScrollableFeed from "react-scrollable-feed";
import moment from "moment";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";
import CircleIcon from "@mui/icons-material/Circle";
import { capitalizeFirstLetter } from "../comman/capitalizeFirstLetter";
import Cropper from "react-easy-crop";
import getCroppedImg from "../comman/cropImage";
toast.configure();

const Chat = () => {
  const classes = useStyles();
  const userId = localStorage.getItem("id");
  const [counsellorDetail, setCounsellorDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createGroup, setCreateGroup] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [chatId, setChatId] = useState("");
  const [photo, setPhoto] = useState("");
  const [file, setFile] = useState("");
  const [groupName, setGropName] = useState("");
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnecttion, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [onlyCounsellorDetail, setOnlyCounsellorDetail] = useState([]);
  const [groupData, setGetGroupsData] = useState([]);
  const [groupVisible, setGroupVisible] = useState("");
  const [highlightId, setHighlightId] = useState(false);
  const [data, setData] = useState();
  const [togglee, setTogglee] = useState(false);
  const [index, setIndex] = useState("");
  const [oldMessage, setOldMessage] = useState("");
  const [openModelLeaveGroup, setOpenModelLeaveGroup] = useState(false);
  const [subHeaderOpen, setSubHeaderOpen] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [updatedMessage, setUpdatedMessage] = useState('')
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoomValue] = useState(1);
  const [rotation, setRotationValue] = useState(0);
  const [crop, setCropValue] = useState({ x: 0, y: 0 });
  const [openModelImageCrop, setOpenModelImageCrop] = useState(false);
  const [croppedFile, setCroppedFile] = useState('');
  const [croppedImage, setCroppedImage] = useState(null);

  var socket;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCloseLeaveGroupModal = () =>
    setOpenModelLeaveGroup(!openModelLeaveGroup);

    const handleCloseGroupInfoModal = () =>
    setSubHeaderOpen(!subHeaderOpen);

  useEffect(() => {
    socket = io.connect(SOCKET_URL);
    socket.on("connected", () => setSocketConnected(true));
    socket.emit("setup", localStorage.getItem("id"));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    handleGetLoginStatus();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    handleGetOnlyGroups();
    handleGetOnlyCounsellor();
    handleGetGruops();
  }, [1]);

  useEffect(() => {
    fetchMessages();
    setSearch("");
    handleGetGruops();
  }, [chatId]);

  useEffect(() => {
    socket?.on("message recieved", (newMessageReceived) => {
      let localData = localStorage.getItem("chatId");
      let chatIdLocal = chatId ? chatId._id : localData;

      if (newMessageReceived[0].chat._id === chatIdLocal) {
        setMessage(newMessageReceived);
      } else {
      }
    });

    socket?.on("count", (messagesData) => {
      toast.info("You have new message");
      handleGetGruops();
    });
  }, [socket]);

  const handleGetLoginStatus = async () => {
    await axios
      .get(`${API.getLoginStatus}`, { headers: authHeader() })
      .then((res) => {
        setStatusData(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const handleGetOnlyGroups = async () => {
    await axios({
      method: "post",
      url: `${API.fetchGroup}`,
      data: localStorage.getItem("id"),
      headers: authHeader(),
    })
      .then((response) => {
        setGetGroupsData(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          handleLogout();
        }
      });
  };

  const handleGetOnlyCounsellor = async () => {
    await axios
      .get(API.getAllUser, { headers: authHeader() })
      .then((response) => {
        setLoading(false);
        var a = response.data.filter((e) => e.role.name === "counsellor");
        setOnlyCounsellorDetail(a);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          handleLogout();
        }
      });
  };

  const handleGetGruops = async (data) => {
    if (!data) {
      data = "";
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
        const dat2 = data[1];
        Array.prototype.push.apply(dat1, dat2);
        setCounsellorDetail(dat1);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const handleEditGroup = () => {
    setEditModal(!editModal);
  };

  const handleCreateGroup = () => {
    setCreateGroup(!createGroup);
    setSelected([]);
    setPhoto("");
    setGropName("");
  };

  const handleGroupDelete = async () => {
    const del = await axios
      .delete(`${API.deleteGroup}/${chatId._id}`, { headers: authHeader() })
      .then((res) => {
        toast.success("Group Deleted");

        window.location.reload();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        toast.error("Something went wrong");
      });
  };

  const handleOnChangeGroup = (e) => {
    setGropName(e.target.value);
    $(document).ready(function () {
      $("#create-channeladd").validate({
        rules: {
          groupname: {
            required: true,
            minlength: 3,
          },
        },
        messages: {
          name: {
            required: "<p style='color:red'>Please provide your group name</P>",
            minlength:
              "<p style='color:red'>Your group name must consist of at least 3 characters</p>",
          },
        },
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected === "" || groupName === "" || photo === "") {
      $(document).ready(function () {
        $("#create-channeladd").validate({
          rules: {
            groupname: {
              required: true,
              minlength: 3,
            },
            photo: {
              required: true,
            },
            groupmember: {
              required: true,
            },
          },
          messages: {
            name: {
              required:
                "<p style='color:red'>Please provide your group name</P>",
              minlength:
                "<p style='color:red'>Your group name must consist of at least 3 characters</p>",
            },
            photo: {
              required:
                "<p style='color:red'>Please choose your group photo</P>",
            },
            groupmember: {
              required:
                "<p style='color:red'>Please choose your group member</P>",
            },
          },
        });
      });
    }

    const id = localStorage.getItem("id");
    selected.push(id);
    const formData = new FormData();
    const reqData = {
      chatName: groupName,
      users: selected,
      adminId: id,
      image: croppedFile ? croppedFile : file,
    };

    for (var key in reqData) {
      if (key === "users") {
        for (var i = 0; i < reqData.users.length; i++) {
          formData.append(key + "[" + i + "]", reqData[key][i]);
        }
      } else {
        formData.append(key, reqData[key]);
      }
    }
    await axios({
      method: "post",
      url: `${API.createGroup}`,
      data: formData,
      headers: authHeader(),
    })
      .then((response) => {
        toast.success("Channel created");
        setCreateGroup(false);
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          handleLogout();
        }
        toast.error("Channel can't be created");
      });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const id = localStorage.getItem("id");
    const formData = new FormData();
    const reqData = {
      userId: selected,
      chatId: chatId._id,
      chatName: groupName ? groupName : chatId.chatName,
      image:  croppedFile ? croppedFile : chatId?.image,
    };

    if (reqData.userId.length > 0) {
      for (var key in reqData) {
        if (key === "userId") {
          for (var i = 0; i < reqData.userId.length; i++) {
            formData.append(key + "[" + i + "]", reqData[key][i]);
          }
        } else {
          formData.append(key, reqData[key]);
        }
      }
    } else {
      for (var key in reqData) {
        formData.append(key, reqData[key]);
      }
    }
    const res = await axios({
      method: "put",
      url: `${API.addUserInGroup}`,
      data: formData,
      headers: authHeader(),
    }).catch(function (error) {
      if (error.response.status === 400) {
        toast.error("User already add in the group");
      } else if (error.response.status === 401) {
        handleLogout();
      }
    });
    if (res.status === 200) {
      toast.success("Channel updated");
      setEditModal(!editModal);
      handleGetOnlyGroups();

      handleGetGruops();

      setTimeout(() => {
        window.location.reload("/chat");
      }, 500);
    } else {
      toast.error("Failed to update the group");
    }
  };

  const _handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    if (file) {
      reader.onloadend = () => {
        setFile(file);
        setPhoto(reader.result);
      };
      handleCloseCropImage();
      reader.readAsDataURL(file);
    }
  };
 
   // ******* CROP IMAGE FUNCTIONS START ****************

   const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        photo,
        croppedAreaPixels,
        rotation
      );

      const croppedImageData = { croppedImage };
      let myFile = await fetch(croppedImageData.croppedImage)
        .then((r) => r.blob())
        .then(
          (blobFile) => new File([blobFile], file.name, { type: file.type })
        )
        .catch((error) => console.log(error, "cropimage"));

      setCroppedImage(croppedImage);
      setCroppedFile(myFile);
      handleCloseCropImage();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseCropImage = () =>
    setOpenModelImageCrop(!openModelImageCrop);

  const setZoom = (zoom) => {
    setZoomValue(zoom);
  };

  const setCrop = (crop) => {
    setCropValue(crop);
  };

  const setRotation = (rotation) => {
    setRotationValue(rotation);
  };

  // ******* CROP IMAGE FUNCTIONS END ****************

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelected(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const theme = useTheme();

  const handleSelectChatUser = async (ele) => {
    setHighlightId(ele._id);
    var chatid;
    var keys = Object.keys(ele);

    setToggle(!toggle);
    if (keys.indexOf("isGroupChat") !== -1) {
      chatid = ele._id;
      localStorage.setItem("chatId", "");
      localStorage.setItem("chatId", chatid);
      setChatId(ele);
      setGroupVisible(chatid);
    } else {
      const reqData = {
        userId: localStorage.getItem("id"),
        recieverId: ele._id,
      };
      await axios({
        method: "post",
        url: `${API.accessChatByChatId}`,
        data: reqData,
        headers: authHeader(),
      })
        .then((res) => {
          setChatId(res.data);
          localStorage.setItem("chatId", "");
          localStorage.setItem("chatId", res.data._id);
          fetchMessages();
        })
        .catch((err) => {
          if (err.response.status === 401) {
            handleLogout();
          }
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
      socket.emit("stop typing", chatId._id);
      try {
        const reqData = {
          chatId: chatId._id,
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

        let objectSeenMessage = {
          messagesData: counsellorDetail,
          userid: request.data.at(-1),
        };
        socket.emit("notification", objectSeenMessage);
        socket.emit("message", request.data);
        setMessage(request.data);
      } catch (error) {
        if (error.response.status === 401) {
          handleLogout();
        }
        toast.error("Message not send!");
      }
    }
  };

  const fetchMessages = async () => {
    setMessage([]);
    if (!chatId) {
      return;
    }
    try {
      setLoading(true);
      const data = await axios.get(`${API.getMessage}/${chatId._id}`, {
        headers: authHeader(),
      });
      const receiverHideData = data.data.filter((item) => {
        return item.deleteUsers.some(function (el) {
          return el === localStorage.getItem("id") && item.deletedBy === true;
        });
      });
      var finalArrayCompare = data.data.filter(
        (val) => !receiverHideData.includes(val)
      );

      setMessage(finalArrayCompare);

      setLoading(false);
      socket.emit("join chat", chatId._id);
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      setLoading(false);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // if (!socketConnecttion) return;
    // socket = io.connect(SOCKET_URL);
    // socket.on("connected", () => { setSocketConnected(true) });
    // if (!typing) {
    //     setTyping(true);
    //     socket?.emit("typing", chatId._id)
    // }
    // let lastTypingTime = new Date().getTime();
    // var timerLength = 1000;
    // setTimeout(() => {
    //     var timeNow = new Date().getTime();
    //     var timeDiff = timeNow - lastTypingTime;
    //     if (timeDiff >= timerLength && typing) {
    //         socket?.emit("stop typing", chatId._id);
    //         setTyping(false);
    //     }
    // }, timerLength);
  };

  const handleDeleteReceiver = async (id) => {
    setLoading(true);
    await axios
      .put(
        `${API.deleteMessageReceiver}/${id}`,
        {
          deleteUsers: localStorage.getItem("id"),
        },
        { headers: authHeader() }
      )
      .then((ress) => {
        toast.success("Message deleted");
        setTogglee(false);
        setLoading(false);
        fetchMessages();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setTogglee(false);
        setLoading(false);
        toast.error("Something went wrong");
      });
  };

  const handleToggle = () => {
    setTogglee(true);
  };

  const handleFocusOut = () => {

    setTogglee(true);
    if (oldMessage && oldMessage === updatedMessage) {
      toast.warning("Tried to edit the message but didn’t make any changes");
      setTogglee(false);
    } else {
      const reqData = {
        content: updatedMessage,
      };
      setLoading(true);
      const res = axios({
        method: "put",
        url: `${API.updateMessage}/${data._id}`,
        data: reqData,
        headers: authHeader(),
      })
        .then((res) => {
          setLoading(false);
          setTogglee(false);
          fetchMessages();
          toast.success("Message updated");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            handleLogout();
          }
          toast.error("Message can't updated");
          setTogglee(false);
        });
    }
  };

  const handleOnClickId = (id, oldChat) => {
    setIndex(id);
    setOldMessage(oldChat);
    setUpdatedMessage(oldChat);
    setTogglee(!toggle);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await axios
      .delete(`${API.deleteMessage}/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        toast.success("Message deleted");
        setTogglee(false);
        setLoading(false);
        fetchMessages();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          handleLogout();
        }
        toast.error("Something went wrong");
      });
  };

  const groupChatData =
    groupData && groupData.filter((e) => e._id === groupVisible);

  const receivername =
    chatId &&
    chatId.users &&
    chatId.users.filter((e) => e._id !== localStorage.getItem("id"));

  const handleRemoveMember = async (ele, item) => {
    if (ele) {
      try {
        const reqData = {
          userId: ele._id,
          chatId: item._id,
        };
        setNewMessage("");
        const request = await axios({
          method: "put",
          url: `${API.removeGroupUser}`,
          data: reqData,
          headers: authHeader(),
        });
        handleGetOnlyGroups();
        handleGetGruops();
      } catch (error) {
        if (error.response.status === 401) {
          handleLogout();
        }
        toast.error("Failed to remove user!");
      }
    }
  };

  const handleSeenGroupMessage = async (group_id, user_id) => {
    const reqData = {
      userId: user_id,
      groupId: group_id,
    };

    await axios({
      method: "put",
      url: `${API.seenGroupMessage}`,
      data: reqData,
      headers: authHeader(),
    })
      .then((res) => {})
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const ids = statusData.map(o => o.userId)
  const filtered = statusData.filter(({userId}, index) => !ids.includes(userId, index + 1))

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Crop image styles start

  const styleImageCrop = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
    height:'550px',
    width: "550px",
  };

  const cropperStyle ={
    cropperContainerStyle :{  maxHeight: '300px',  height: '100%',  top: '16%',  left: '32px',  right: '32px' },
    cropperButtonStyle :{ marginTop:'342px',  textAlign:'center'  },
    zoomButtonDiv :{width: '42%', display: 'inline-flex'},
    zoomSpan :{marginRight: '15px'},
    rotationButtonDiv :{width: "48%", display: 'inline-flex'},
    rotationSpan :{margin: '0px 15px 0px 10px'},

  } 

  // crop image styles end

  return (
    <React.Fragment>
      <Sidebar />
      <div className="col-md-8 col-lg-9 col-xl-10 mr-30">
        <div className="header">
          {" "}
          <ImageAvatars />
        </div>
        <div className="heading ">
          <h1 className="mt-5">
            <span className="counsellor-logo">
              <img src={chat} className="" alt="logo" />
            </span>
            Chat
          </h1>
        </div>
        <div className="chat d-flex mt-4 border-top">
          <div className="chat-left col-md-4 col-xl-2">
            <div className="mt-3">
              <h3>Message</h3>
              <SearchBar
                value={search}
                onChange={(newValue) => handleGetGruops(newValue)}
                placeholder="Search Counsellor"
                />
            </div>
            <div className="createpersonal">
              <ul>
                <li>
                  <p onClick={handleCreateGroup}># Create Personal Channels </p>
                </li>

                {!loading ? (
                  counsellorDetail.length > 0 ? (
                    counsellorDetail.map((item) => {
                      return (
                        <li key={item._id}>
                          <p
                            className={
                              highlightId === item._id
                                ? "avatar-image bg-secondary"
                                : "avatar-image "
                              }
                              onClick={() => {
                                handleSelectChatUser(item);
                                handleSeenGroupMessage(
                                  item._id,
                                  localStorage.getItem("id")
                                  );
                                }}
                          >
                            {
                              <Box>
                                <Avatar
                                  alt={item.name ? item.name : item.chatName}
                                  src={`${BASE_URL}/${item?.image}`}
                                  sx={{ width: 56, height: 56 }}
                                  />
                                {filtered.map((status) => {
                                  return status.userId === item._id &&
                                  status.status === "online" ? (
                                    <i
                                      sx={{
                                        position: "relative",
                                        top: "-19px",
                                        left: "38px",
                                      }}
                                      >
                                      <CircleIcon
                                        sx={{
                                          color: "green",
                                          fontSize: "12px",
                                          position: "relative",
                                          top: "-19px",
                                          left: "38px",
                                        }}
                                      />
                                    </i>
                                  ) : (
                                    ""
                                  );
                                })}
                              </Box>
                            }
                            {item.name ? item.name : item.chatName}{" "}
                            {item.lastname}
                            {item.readBy === 0 ? (
                              ""
                            ) : (
                              <span className="notfication">{item.readBy}</span>
                            )}
                          </p>
                        </li>
                      );
                    })
                  ) : (
                    <p>Record not found</p>
                  )
                ) : (
                  <div className="chat-loader"></div>
                )}
              </ul>
            </div>
          </div>

          <div className="chat-right col-md-8 col-xl-10 border-left">
            {chatId ? (
              chatId && chatId.isGroupChat === false ? (
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
                  <div className="chat-section">
                    {message.length === 0 ? (
                      <div className="not-found">
                        <p></p>
                      </div>
                    ) : (
                      <div>
                        {/* 1-1 scrollable feed  */}
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
                                    <p>
                                      {moment(m.createdAt).format("hh:mm A")}
                                    </p>
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
                                      m?.sender?._id === userId
                                        ? "#21BAFE"
                                        : "#EAE8E8"
                                    }`,
                                    marginLeft: isSameSenderMargin(
                                      message,
                                      m,
                                      i,
                                      userId
                                    ),
                                    marginTop: isSameUser(message, m, i, userId)
                                      ? 3
                                      : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {m && m?.sender?._id !== userId ? (
                                    <span
                                      onClick={() =>
                                        handleOnClickId(m._id, m.content)
                                      }
                                    >
                                      {m.content}
                                    </span>
                                  ) : togglee === true || togglee === false ? (
                                    togglee === true && m._id === index ? (
                                      <>
                                      <Tooltip
                                        title="Click on the message"
                                        arrow
                                      >
                                       
                                        <span style={{ color: "white" }} >
                                          Edit
                                        </span>
                                      </Tooltip>
                                      </>
                                    ) : (
                                      <span
                                        onClick={() =>
                                          handleOnClickId(m._id, m.content)
                                        }
                                      >
                                        {m.content}
                                      </span>
                                    )
                                  ) : (
                                    ""
                                  )}

                                  {m &&
                                  m._id === index &&
                                  m.sender._id === userId &&
                                  togglee ? (
                                    <div className="chat-box">
                                      <textarea autoFocus name="one2one_message_update" id="one2one_message_update"  rows='3' columns='12' value={updatedMessage ? updatedMessage : m.content} onChange={(e) => setUpdatedMessage(e.target.value)} onBlur={() => handleFocusOut()} style={{textAlign:'justify'}}></textarea>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </span>

                                {/* sender msg delete */}

                                {loading ? <Loader /> : ""}
                                {m &&
                                m._id === index &&
                                m.sender._id === userId &&
                                togglee ? (
                                  <>
                                    <span
                                      className="mt-3 m-2"
                                      onClick={() =>
                                        handleDelete(m._id, m.chat._id)
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        style={{
                                          color: "red",
                                          fontSize: "23px",
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}

                                {/* receiver msg delete */}

                                {m &&
                                m._id === index &&
                                m.sender._id !== userId &&
                                togglee ? (
                                  <>
                                    <span
                                      className="mt-3 m-2"
                                      onClick={() =>
                                        handleDeleteReceiver(m._id)
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        style={{
                                          color: "red",
                                          fontSize: "23px",
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            ))}
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
                      <form
                        method="POST"
                        onSubmit={(e) => handleSendMessage(e)}
                        style={{ width: "100%", display: "flex" }}
                      >
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
              ) : (
                // group chat header{}
                <div className="row">
                  <div className="profile-top">
                    <span className="avatar-image">
                      {
                        <Avatar
                          alt={
                            chatId
                              ? chatId.chatName.charAt(0).toUpperCase() +
                                chatId.chatName.slice(1)
                              : ""
                          }
                          src={`${BASE_URL}/${chatId ? chatId?.image : ""}`}
                          sx={{ width: 56, height: 56 }}
                        />
                      }
                    </span>
                    <div className="group-name">
                      <h3>
                        {chatId
                          ? chatId.chatName.charAt(0).toUpperCase() +
                            chatId.chatName.slice(1)
                          : ""}
                      </h3>
                    </div>

                    <div className="group-member-name">
                      <span style={{fontSize:'15px'}} onClick={() => setSubHeaderOpen(true)}>Click here for group info</span>
                    </div>
                    <div className="actionbuttons">
                      <button
                        type="button"
                        className="edit-group-info btn btn-primary "
                        onClick={() => handleEditGroup()}
                      >
                        {" "}
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger leave-group-button"
                        onClick={handleCloseLeaveGroupModal}
                      >
                        Delete
                      </button>
                    </div>
                    {
                      <Modal
                        open={openModelLeaveGroup}
                        onClose={handleCloseLeaveGroupModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={{ ...style, width: 500, textAlign: "center" }}>
                          <Box>
                            <CancelOutlinedIcon
                              sx={{
                                fontSize: "4.5rem !important",
                                fill: "red",
                              }}
                            />
                          </Box>
                          <Typography id="modal-modal-title" component="h1">
                            Are you sure?
                          </Typography>
                          <Typography
                            id="modal-modal-description"
                            component={"subtitle2"}
                          >
                            Do you really want to delete the{" "}
                            <strong>
                              {chatId
                                ? chatId.chatName.charAt(0).toUpperCase() +
                                  chatId.chatName.slice(1)
                                : ""}
                            </strong> ?
                          </Typography>
                          <Box marginTop={"30px"}>
                            {!loading ? (
                              <Button
                                variant="contained"
                                size="large"
                                onClick={handleGroupDelete}
                              >
                                Delete
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="contained"
                                  size="large"
                                  disabled
                                >
                                  Leave
                                </Button>
                                <Loader1 />
                              </>
                            )}
                            <Button
                              variant="outlined"
                              size="large"
                              onClick={handleCloseLeaveGroupModal}
                              sx={{
                                marginLeft: "15px",
                                borderColor: "text.primary",
                                color: "text.primary",
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      </Modal>
                    }
                      {
                      <Modal
                        open={subHeaderOpen}
                        onClose={handleCloseGroupInfoModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={{ ...style, width: 500 }}>
                          <Box>
                            <CancelOutlinedIcon
                            onClick={handleCloseGroupInfoModal}
                              sx={{
                                float: "right",
                              }}
                              
                            />
                          <Typography id="modal-modal-title" component="h6" sx={{mb:3,fontWeight: 'bold',fontSize:' 20px'}}>
                          {chatId ? chatId.chatName.charAt(0).toUpperCase() + chatId.chatName.slice(1) : ""} ({chatId?.users?.length} participants)
                          </Typography>
                          </Box>
                          <Box>
                          
                          <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                              <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                  <TableRow>
                                       <TableCell align="left"> S.No. </TableCell>
                                       <TableCell sx={{textAlign:"left !important"}}> Members </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {chatId.users
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row,index) => {
                                      return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                              <TableCell> {(index+1)} </TableCell>
                                              <TableCell> {row.name === localStorage.getItem("name") ? "You" : (capitalizeFirstLetter(row.name) + " " + capitalizeFirstLetter(row.lastname))}
                                                </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25, 100]}
                              component="div"
                              count={chatId.users.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                          </Paper>
                      </Box>
                          </Box>
                       
                      </Modal>
                    }
                  </div>
                  {/* group chat scollable feed  */}

                  <div className="chat-section">
                    {message.length === 0 ? (
                      <div className="not-found">
                        <p></p>
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
                                    <p>
                                      {moment(m?.createdAt).format("hh:mm A")}
                                    </p>
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
                                      m?.sender?._id === userId
                                        ? "#21BAFE"
                                        : "#EAE8E8"
                                    }`,
                                    marginLeft: isSameSenderMargin(
                                      message,
                                      m,
                                      i,
                                      userId
                                    ),
                                    marginTop: isSameUser(message, m, i, userId)
                                      ? 3
                                      : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    marginBottom: "20px",
                                  }}
                                >
                                  {m && m?.sender?._id !== userId ? (
                                    <span
                                      onClick={() => handleOnClickId(m?._id)}
                                    >
                                      {m.content}
                                    </span>
                                  ) : togglee === true || togglee === false ? (
                                    togglee === true && m?._id === index ? (
                                      <span style={{ color: "white" }}>
                                        Edit
                                      </span>
                                    ) : (
                                      <span
                                        onClick={() =>
                                          handleOnClickId(m?._id, m.content)
                                        }
                                      >
                                        {m.content}
                                      </span>
                                    )
                                  ) : (
                                    ""
                                  )}

                                  {m &&
                                  m._id === index &&
                                  m.sender._id === userId &&
                                  togglee ? (
                                    <div className="chat-box">
                                      <textarea name="group_message_update" id="group_message_update" autoFocus  rows='3' columns='4' value={updatedMessage ? updatedMessage : m.content} onChange={(e) => setUpdatedMessage(e.target.value)} onBlur={() => handleFocusOut()}></textarea>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </span>

                                {/* sender msg delete */}
                                {loading ? <Loader /> : ""}
                                {m &&
                                m._id === index &&
                                m.sender._id === userId &&
                                togglee ? (
                                  <>
                                    <span
                                      className="mt-3 m-2"
                                      onClick={() =>
                                        handleDelete(m._id, m.chat._id)
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        style={{
                                          color: "red",
                                          fontSize: "23px",
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}

                                {/* receiver msg delete */}

                                {m &&
                                m._id === index &&
                                m.sender._id !== userId &&
                                togglee ? (
                                  <>
                                    <span
                                      className="mt-3 m-2"
                                      onClick={() =>
                                        handleDeleteReceiver(m._id)
                                      }
                                    >
                                      <i
                                        className="fa fa-trash-o"
                                        style={{
                                          color: "red",
                                          fontSize: "23px",
                                        }}
                                      ></i>
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            ))}
                        </ScrollableFeed>
                      </div>
                    )}
                  </div>

                  <div className="chatmessage">
                    {isTyping ? (
                      <div>
                        <Lottie
                          options={defaultOptions}
                          // height={50}
                          width={70}
                          style={{ marginBottom: 15, marginLeft: 0 }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <form
                      method="POST"
                      onSubmit={(e) => handleSendMessage(e)}
                      style={{ width: "100%", display: "flex" }}
                    >
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
              )
            ) : (
              ""
            )}
            {loading === true ? (
              <div className="chat-loader">
                <Loader />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* ///////////    MODEL Create group    ///////////// */}
      <Modal
        open={createGroup}
        onClose={handleCreateGroup}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <strong>Create Your Channel</strong>
          </Typography>
          <form
            className="mui-form"
            id="create-channeladd"
            onSubmit={handleSubmit}
          >
            <div className="form-outline mb-4 col-md-6">
              <label htmlFor="photo">
              <div className="previewText">
                  <Avatar
                    alt="Remy Sharp"
                    src={croppedImage ? croppedImage : photo}
                    sx={{ width: 56, height: 56 }}
                  />{" "}
                  <i
                    className="fa fa-camera"
                    style={{ fontSize: "35px",left:'39px' }}
                  ></i>
                </div>
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                className="form-control"
                style={{ display: "none" }}
                onChange={(e) => _handleImageChange(e)}
              />
            </div>
            <div className="mui-textfield">
              <input
                type="text"
                placeholder="Enter Your Group Name"
                name="groupname"
                value={groupName}
                onChange={(e) => {
                  handleOnChangeGroup(e);
                }}
              />
            </div>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel id="mutiple-select-label">
                  Multiple Select
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={selected}
                  onChange={handleChange}
                  name="groupmember"
                  MenuProps={MenuProps}
                >
                  {onlyCounsellorDetail.map((name) => (
                    <MenuItem key={name._id} value={name._id}>
                      {name.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="btndesign text-right">
              <button
                type="button"
                className="btn btn-transparent"
                onClick={handleCreateGroup}
              >
                CLOSE
              </button>
              <input type="submit" className="btn btn-primary" value="SAVE" />
            </div>
          </form>
        </Box>
      </Modal>
      {/* ////////////// Modal Edit Exist Group ////////////// */}
      <Modal
        open={editModal}
        onClose={handleEditGroup}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <strong>Update Your Channel</strong>
          </Typography>

          <form className="mui-form" onSubmit={handleEditSubmit}>
            {groupChatData &&
              groupChatData.map((item) => {
                return (
                  <>
                    <div className="form-outline mb-4 col-md-6">
                      <label htmlFor="photo">
                      <div className="previewText">
                              <Avatar
                                alt={groupName}
                                src={croppedImage ? croppedImage : BASE_URL+"/"+item?.image}
                                sx={{ width: 56, height: 56 }}
                              />
                                <i
                                  className="fa fa-camera"
                                  style={{ fontSize: "35px", left: "39px" }}
                                ></i>
                                </div>
                      </label>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        className="form-control"
                        style={{ display: "none" }}
                        onChange={(e) => _handleImageChange(e)}
                      />
                    </div>
                    <div className="mui-textfield">
                      <input
                        type="text"
                        placeholder={item.chatName}
                        value={groupName}
                        onChange={(e) => {
                          setGropName(
                            e.target.value !== ""
                              ? e.target.value
                              : item.chatName
                          );
                        }}
                      />
                    </div>
                    <div>
                      {item.users.map((ele) => {
                        return (
                          <span>
                            {" "}
                            {ele.name === localStorage.getItem("name") ? (
                              ""
                            ) : (
                              <Chip
                                label={
                                  ele.name === localStorage.getItem("name")
                                    ? ""
                                    : ele.name
                                }
                                onDelete={() => handleRemoveMember(ele, item)}
                              />
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <div>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="mutiple-select-label">
                          Multiple Select
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={selected}
                          onChange={handleChange}
                          MenuProps={MenuProps}
                        >
                          {onlyCounsellorDetail.map((name) => {
                            return (
                              <MenuItem key={name._id} value={name._id}>
                                {name.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="btndesign text-right">
                      <button
                        type="button"
                        className="btn btn-transparent"
                        onClick={handleEditGroup}
                      >
                        CLOSE
                      </button>
                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="UPDATE"
                      />
                    </div>
                  </>
                );
              })}
          </form>
        </Box>
      </Modal>

       {/*  crop image functionality start*/}
       <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openModelImageCrop}
            onClose={handleCloseCropImage}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openModelImageCrop}>
              <Box sx={styleImageCrop}>
                <div>
                  <legend style={{ fontSize: "25px" }}>
                    Crop your image
                  </legend>
                </div>
                    <Cropper
                      image={photo}
                      crop={crop}
                      cropShape={'round'}
                      cropSize={ {width: 200, height: 200} }
                      style = {{containerStyle: cropperStyle.cropperContainerStyle}}
                      rotation={rotation}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                <div style={cropperStyle.cropperButtonStyle}  >
                  
                  <div style={{marginBottom:'20px'}}>
                    <div style={cropperStyle.zoomButtonDiv}>
                      <span style={cropperStyle.zoomSpan}>
                      Zoom</span>
                      <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoom) => setZoomValue(zoom)}
                      />
                    </div>
                    <div style={cropperStyle.rotationButtonDiv}>
                      <span style={cropperStyle.rotationSpan}>
                     Rotation</span>
                      <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        onChange={(e, rotation) => setRotationValue(rotation)}
                      />
                    </div>
                  </div>
                  <div className="cancel-submit-btn">
                    <Button
                      onClick={handleCloseCropImage}
                      variant="contained"
                      color="grey"
                      size="large"
                      sx={{marginRight:'25px'}}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={showCroppedImage}
                      variant="contained"
                      color="primary"
                      size="large"
                      type='button'
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>
          {/*  crop image functionality end */}

    </React.Fragment>
  );
};

export default Chat;
