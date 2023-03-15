import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageAvatars, { handleLogout } from "./header";
import Sidebar from "./sidebar";
import { FormControl, MenuItem, Select, Container, InputAdornment, IconButton, TextField } from "@mui/material";
import { API } from "../config/config";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getClasses } from "../action/functional";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authHeader } from "../comman/authToken";
import Loader from "../comman/loader";
import $ from "jquery";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PasswordChecklist from "react-password-checklist";
import { Visibility, VisibilityOff } from "@material-ui/icons";
toast.configure();

const EditCounsellor = () => {
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [classSelect, setClassSelect] = useState("");
  const [getclasses, setGetclasses] = useState([]);
  const [getUserDataById, setUserData] = useState([]);
  const [counsellorDetail, setCounsellorDetail] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [show, setShow] = useState(false);

  const schoolLocation = localStorage.getItem("schoolLocation");
  const currentLocation = localStorage.getItem("currentLocation");

  const dispatch = useDispatch();

  $('input[name="name"]').keyup(function (e) {
    if (/[^a-zA-Z]/g.test(this.value)) {
      this.value = this.value.replace(/[^a-zA-Z]/g, "");
    }
  });

  $('input[name="lastname"]').keyup(function (e) {
    if (/[^a-zA-Z]/g.test(this.value)) {
      this.value = this.value.replace(/[^a-zA-Z]/g, "");
    }
  });
  $('input[name="username"]').keyup(function (e) {
    if (/[^a-zA-Z0-9@_\.-]*$/g.test(this.value)) {
      this.value = this.value.replace(/[^a-zA-Z0-9@_\.-]*$/g, "");
    }
  });

  useEffect(() => {
    GetClassData();
    GetUserData();
    handleGetCouncellor();
    getUserDataById.map((item) => {
      return setItem(item);
    });
  }, []);
  $(document).ready(function () {
    $("#validCouncellor").validate({
      rules: {
        fullname: {
          required: true,
          minlength: 3,
        },
        lastname: {
          required: true,
          minlength: 3,
        },
        username: {
          required: true,
          minlength: 3,
        },
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        fullname: {
          required: "<p style='color:red'>Please enter your first name</P>",
          minlength:
            "<p style='color:red'>Your first name must consist of at least 3 characters</p>",
        },
        lastname: {
          required: "<p style='color:red'>Please enter your last name</P>",
          minlength:
            "<p style='color:red'>Your last name must consist of at least 3 characters</p>",
        },
        username: {
          required: "<p style='color:red'>Please enter your username</P>",
          minlength:
            "<p style='color:red'>Your username must consist of at least 3 characters</p>",
        },
      },
    });
  });

  const handleGetCouncellor = () => {
    setLoading(true);
    fetch(API.getAllUser, { headers: authHeader() })
      .then((a) => {
        if (a.status === 200) {
          setLoading(false);
          return a.json();
        } else {
          setLoading(true);
        }
      })
      .then((data) => {
        setAllUserData(data);
        setCounsellorDetail(data.filter((e) => e.role.name === "counsellor"));
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const GetClassData = async () => {
    setLoading(true);
    const response = await axios
      .get(`${API.getClass}`)
      .then((res) => {
        setLoading(false);
        setGetclasses(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setLoading(false);
      });

    dispatch(getClasses(response));
  };

  const { id } = useParams();
  const GetUserData = async () => {
    setLoading(true);
    await axios
      .get(`${API.getUser}/${id}`, { headers: authHeader() })
      .then((res) => {
        setLoading(false);
        setName(res.data.data[0].name);
        setLastName(res.data.data[0].lastname);
        setMobile(res.data.data[0].phone);
        setusername(res.data.data[0].username);
        setClassSelect(res.data.data[0].classId);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setLoading(false);
      });
  };

  const equalsCheck = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const findClassId = counsellorDetail.filter((counFil) => {
      return counFil.classId._id === classSelect;
    });

    const uniqueUserName = allUserData.filter((counFil) => {
      return (counFil._id !== id && counFil.username === username);
    });

    const manageCouncellor = findClassId.filter((mngFil) => {
      return mngFil._id === id;
    });
    const GettingClassName = getclasses.find((filClassName) => {
      return filClassName._id === classSelect;
    });

    if (!equalsCheck(findClassId, manageCouncellor) && findClassId[0].classId.className !== 'class unassigned') {
      toast.error(
        `Another counsellor was assigned to the ${GettingClassName.className?.slice(6)}`
      );
    }else if(uniqueUserName.length > 0){
      toast.error(
        `Username should be unique`
      );
    } else if (passwordValid) {
      const requestData = {
        name: name === "" ? item.name : name,
        phone: mobile === "" ? item.phone : mobile,
        username: username === "" ? item.username : username,
        password: password === "" ? item.password : password,
        classId: classSelect === "" ? item.classId : classSelect,
        lastname: lastname === "" ? item.lastname : lastname,
      };
      const res = await axios({
        method: "put",
        url: `${API.updateUser}/${id}`,
        data: requestData,
        headers: authHeader(),
      })
        .then((res) => {
          toast.success("Councellor Updated");
          setTimeout(() => {
            window.location.replace("/counsellor");
          }, 1000);
        })
        .catch(function (error) {
          if (error.response.status === 400) {
            toast.error("Failed to update councellor");
          } else if (error.response.status === 401) {
            handleLogout();
          }
        });
    }
  };

  const handleClickShowPassword = () => setShow((show) => !show)


  return (
    <>
      <Sidebar />
      <div className="col-md-8 col-lg-9 col-xl-10 mr-30 ">
        <div className="header">
          {" "}
          <ImageAvatars />
        </div>
        <Container
          maxWidth="100%"
          style={{ padding: "0", display: "inline-block" }}
        >
          <div className="heading1 mb-5">
            <h1>Edit Counsellor</h1>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <form id="validCouncellor" onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="name">First Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="Please enter first name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Please enter lastname"
                    className="form-control"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="mobile">Mobile No.</label>

                  <PhoneInput
                    country={`${
                      schoolLocation && schoolLocation.toLowerCase() === "usa"
                        ? "us"
                        : currentLocation.toLowerCase()
                    }`}
                    enaableAreaCodes
                    onChange={(phone) => setMobile(phone)}
                    value={`${mobile}`}
                    enableAreaCodes
                    enableSearch="true"
                  />
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="assign" className="w-100">
                    Assign Class
                  </label>
                  <FormControl
                    sx={{ m: 0, minWidth: 120 }}
                    className="filterbox w-100"
                  >
                    <Select
                      required="true"
                      className="form-control assign_class"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={classSelect}
                      label="Filter"
                      onChange={(e) => setClassSelect(e.target.value)}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {getclasses.map((item) => {
                         const renameClassName = item.className?.slice(6);
                         const capitalFirstLetterClassName = renameClassName?.charAt(0)?.toUpperCase() + renameClassName?.slice(1);
                        return (
                          <MenuItem value={item._id}>{capitalFirstLetterClassName}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                {" "}
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="username">User Name</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Please enter username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                  />
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="password">Update Password</label>

                  <TextField
                    type={show ? 'text' : 'password'}
                    name="password"
                    className="form-control"
                    variant="outlined"
                    placeholder="Please enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!e.target.value) {
                        setPasswordValid(true);
                      }
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end"> <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >{show ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                    }}
                    sx={{marginBottom:'20px'}}
                  />
                  {password && (
                    <PasswordChecklist
                      rules={["minLength", "specialChar", "number", "capital"]}
                      minLength={6}
                      value={password}
                      onChange={(isValid) => {
                        setPasswordValid(isValid);
                      }}
                    />
                  )}
                </div>
              </div>
              <a
                href="/counsellor"
                className="btn btn-transparent btn-block mb-4"
              >
                CANCEL
              </a>
              <input
                type="submit"
                className="btn btn-primary btn-block mb-4"
                value="UPDATE"
              />
            </form>
          )}
        </Container>
      </div>
    </>
  );
};

export default EditCounsellor;
