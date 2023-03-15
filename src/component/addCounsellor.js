import React, { Component } from "react";
import ImageAvatars, { handleLogout } from "./header";
import Sidebar from "./sidebar";
import { FormControl, Container, TextField, InputAdornment, IconButton } from "@mui/material";
import {
  createClass,
  getClass,
  createCounsellorandManager,
} from "../action/index";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PasswordChecklist from "react-password-checklist";
import Example1 from "../comman/loader1";
import { API } from "../config/config";
import { authHeader } from "../comman/authToken";
import { Visibility, VisibilityOff } from "@material-ui/icons";

toast.configure();

class AddCounsellor extends Component {
  state = {
    openmodel: false,
    uname: "",
    password: "",
    mobile: "",
    mobileError: "",
    lastname: "",
    name: "",
    getclasses: [],
    classSelect: "",
    loading: false,
    passwordVerification: false,
    setCounsellorDetail: [],
    schoolLocation: localStorage?.getItem("schoolLocation"),
    currentLocation: localStorage?.getItem("currentLocation"),
    show:false
  };

  componentDidMount() {
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
    $('input[name="uname"]').keyup(function (e) {
      if (/[^a-zA-Z0-9@_\.-]*$/g.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z0-9@_\.-]*$/g, "");
      }
    });

    $(document).ready(function () {
      $("#regvalidation").validate({
        rules: {
          name: {
            required: true,
            minlength: 3,
          },
          lastname: {
            required: true,
            minlength: 3,
          },
          assignclass: {
            required: true,
          },
          uname: {
            required: true,
            minlength: 5,
          },
          email: {
            required: true,
            email: true,
          },
          password: {
            required: true,
          },
        },
        messages: {
          name: {
            required: "<p style='color:red'>Please provide your first name</P>",
            minlength:
              "<p style='color:red'>Your first name must consist of at least 3 characters</p>",
          },
          lastname: {
            required: "<p style='color:red'>Please provide your last name</P>",
            minlength:
              "<p style='color:red'>Your last name must consist of at least 3 characters</p>",
          },
          uname: {
            required: "<p style='color:red'>Please provide your username</P>",
            minlength:
              "<p style='color:red'>Your username must consist of at least 5 characters</p>",
          },
          assignclass: {
            required: "<p style='color:red'>Please select a classname</P>",
          },

          password: {
            required: "<p style='color:red'>Please provide your password</p>",
          },
        },
      });
    });
    this.getClassData();
    this.handleGetUser();
  }

  handleGetUser = () => {
    this.setState({ loading: true });
    fetch(API.getAllUser, { headers: authHeader() })
      .then((a) => {
        if (a.status === 200) {
          this.setState({ loading: false });

          return a.json();
        } else {
          this.setState({ loading: false });
        }
      })
      .then((data) => {
        this.setState({ loading: false });
        this.setState({
          setCounsellorDetail: data.filter((e) => e.role.name === "counsellor"),
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  getClassData = () => {
    this.setState({ loading: true });
    this.props.getClass((res) => {
      this.setState({ getclasses: res.data.data });
      this.setState({ loading: false });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const {
      classSelect,
      mobile,
      name,
      lastname,
      password,
      uname,
      passwordVerification,
      setCounsellorDetail,
      getclasses,
    } = this.state;

    const DuplicateClassFinder = setCounsellorDetail.filter((fil) => {
      return fil.classId._id === classSelect;
    });

    const GettingClassName = getclasses.find((filClassName) => {
      return filClassName._id === classSelect;
    });

    if (mobile === "") {
      this.setState({ mobileError: "The mobile number field is required." });
    } else if (DuplicateClassFinder.length > 0 && DuplicateClassFinder[0].classId.className !== 'class unassigned') {
      toast.error(
        `Another counsellor was assigned to the ${GettingClassName.className}`
      );
    } else {
      this.setState({ mobileError: "" });

      if (
        classSelect === "" ||
        mobile === "" ||
        name === "" ||
        lastname === "" ||
        password === "" ||
        uname === ""
      ) {
        toast.error("All fields are required");
      } else if (passwordVerification === false) {
        toast.error("Please provide valid password");
      } else {
        const requestData = {
          role: "counsellor",
          name: name,
          phone: mobile,
          username: uname,
          password: password,
          classId: classSelect,
          lastname: lastname,
        };
        this.setState({ loading: true });
        this.props.createCounsellorandManager(requestData, (res, err) => {
          if (res.status === 200) {
            toast.success("Counsellor Added");
            this.setState({
              uname: "",
              password: "",
              mobile: "",
              lastname: "",
              name: "",
              classSelect: "",
            });
            setTimeout(() => {
              window.location.replace("/counsellor");
            }, 1000);
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
          }
        });
      }
    }
  };

  setOnChangeForPhone = (e) => {
    if (e !== "") {
      this.setState({ mobile: e });
      this.setState({ mobileError: ""});
    } else {
      this.setState({ mobileError: "The mobile number field is required." });
    }
  }

  handleClickShowPassword = () => this.setState({  show: !this.state.show })


  render() {
    const { schoolLocation, currentLocation,mobileError } = this.state;
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
              <h1>Add Counsellor</h1>
            </div>
            <form id="regvalidation" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="name">First Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Please enter your first name"
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="form-control"
                    placeholder="Please enter your last name"
                    value={this.state.lastname}
                    onChange={(e) =>
                      this.setState({ lastname: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="mobile">Mobile Number</label>

                  <PhoneInput
                    country={`${
                      schoolLocation.toLowerCase() === "usa"
                        ? "us"
                        : currentLocation.toLowerCase()
                    }`}
                    value={`${this.state.mobile}`}
                    enableAreaCodes
                    enableSearch="true"
                    onChange={(phone) => {this.setOnChangeForPhone(phone)}}
                    inputProps={{
                      name: "mobile",
                      required: true,
                    }}
                  />
				  {mobileError !== "" ? (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {mobileError}
                        </p>
                      ) : (
                        ""
                      )}
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="assign" className="w-100">
                    Assign Class
                  </label>
                  <FormControl
                    sx={{ m: 0, minWidth: 120 }}
                    className="filterbox w-100"
                  >
                    <select
                      name="assignclass"
                      labelid="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={this.state.classSelect}
                      label="Filter"
                      onChange={(e) =>
                        this.setState({ classSelect: e.target.value })
                      }
                      inputprops={{ "aria-label": "Without label" }}
                      className="form-control "
                    >
                      <option value="">select</option>
                      {this.state.getclasses.map((item) => {
                        const renameClassName = item.className?.slice(6);
                        const capitalFirstLetterClassName = renameClassName?.charAt(0)?.toUpperCase() + renameClassName?.slice(1);
                        return (
                          <option key={item._id} value={item._id}>{capitalFirstLetterClassName}</option>
                        );
                      })}
                    </select>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                {" "}
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="uname">User Name</label>
                  <input
                    type="text"
                    id="uname"
                    name="uname"
                    className="form-control"
                    placeholder="Please enter your username"
                    value={this.state.uname}
                    onChange={(e) => this.setState({ uname: e.target.value })}
                  />
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="password">Password</label>

                  <TextField
                    type={this.state.show ? 'text' : 'password'}
                    name="password"
                    className="form-control"
                    variant="outlined"
                    placeholder="Please enter your password"
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                    InputProps={{
                      endAdornment: <InputAdornment position="end"> <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >{this.state.show ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                    }}
                    sx={{marginBottom:'30px'}}
                  />
                  {this.state.password !== "" && (
                    <PasswordChecklist
                      rules={["minLength", "specialChar", "number", "capital"]}
                      minLength={6}
                      value={this.state.password}
                      onChange={(isValid) => {
                        this.setState({ passwordVerification: isValid });
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
              {!this.state.loading ? (
                <input
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                  value="SAVE"
                />
              ) : (
                <>
                  <input
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                    disabled
                    value="SAVE"
                  />{" "}
                  <Example1 />{" "}
                </>
              )}
            </form>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  createClass,
  getClass,
  createCounsellorandManager,
})(AddCounsellor);
