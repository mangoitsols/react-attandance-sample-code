import React, { Component } from "react";
import logo from "../images/logo-2.png";
import $ from "jquery";
import validate from "jquery-validation";
import { connect } from "react-redux";
import { login } from "../action/auth";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/login.css";
import LoaderButton from "../comman/loader1";
import { API, SOCKET_URL } from "../config/config";
import axios from "axios";
import { authHeader } from "../comman/authToken";
import { handleLogout } from "./header";
import io from "socket.io-client";
import { Box, Tooltip } from "@mui/material";
import { Typography } from "@material-ui/core";



toast.configure();

<head>
  <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js"></script>
</head>;


class Login extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
    isChecked:false,
  };


  componentDidMount() {

    $(document).ready(function () {
      $("#regvalidation").validate({
        rules: {
          email: {
            required: true,
          },
          password: {
            required: true,
          },
        },
        messages: {
          email: {
            required: "<p style='color:red'>Please provide a username</p>",
          },
          password: {
            required: "<p style='color:red'>Please provide  password</p>",
          },
        },
      });
    });

    if (localStorage.checkbox && localStorage.email !== "") {
      this.setState({
        isChecked: true,
        email: localStorage.username,
        password: localStorage.password
      });
    }
  }

  getCurrentLocation = async() => {
    await axios.get(API.getCurrentLocation).then((response) => {
      localStorage.setItem('currentLocation', response.data.country)
    }).catch((error) => {
    })
  }


  he = () => {
    {
      localStorage.getItem("token") != null ? (
        <div className="welcome">
          <div className="welcome-center">
            <img src={require("./images/welcome-icon.png")} alt='Alternate Message'/>
            <h2>Welcome {localStorage.getItem("lastname")}</h2>
          </div>
        </div>
      ) : (
        <div className="welcome" style={{ display: "none" }}>
          <div className="welcome-center">
            <img src={require("./images/welcome-icon.png")} alt='Alternate Message'/>
            <h2>Welcome {localStorage.getItem("lastname")}</h2>
          </div>
        </div>
      );
    }
  };

  handleAddLoginStatus = async(id) =>{

    const payload = {
      status: "online",
      userId: id
    }

    await axios
      .post(`${API.addLoginStatus}`,payload, { headers: authHeader() })
      .then((res) => {
        localStorage.setItem("loginStatusId",res.data.data._id)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout()
        }
      });
  }

  handleGetSchoolInfo = async() =>{

    const Manager_ID = localStorage.getItem("id");
    await axios
      .get(`${API.getSchoolInfo}/${Manager_ID}`, { headers: authHeader() })
      .then((res) => {
        localStorage.setItem("schoolLocation", res.data.country);
        localStorage.setItem("logoImage", res.data.logo);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout()
        }
        localStorage.setItem("logoImage", '');
        localStorage.setItem("schoolLocation",'');
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { email, password ,isChecked} = this.state;
    const requestData = {
      password: password,
      username: email,
    };

    if (isChecked && email !== "") {
      localStorage.username = email;
      localStorage.password = password;
      localStorage.checkbox = isChecked;
    }
    this.setState({ loading: true });
    this.props.login(requestData, (res) => {

      
      if (res.status === 200) {

        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("lastname", res.data.lastname ? res.data.lastname : "");
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("id", res.data._id);
        
        this.he();
        this.getCurrentLocation();
        if(res.data.role === 'manager'){
        this.handleGetSchoolInfo();
        }      
        this.handleAddLoginStatus(res.data._id)

        this.setState({ loading: false });
        setTimeout(() => {
          window.location = "/welcome";
        }, 500);
      }
      else{
        this.setState({ loading: false });

      }
    });
  };

  handleChechbox = (e) =>{
    this.setState({
      isChecked: e.target.checked
    });
  }

  render() {

    return (
      <React.Fragment>
        <div className="loginBox">
          <div className="loginLeft col-md-6 col-lg-7 ">
            <div className="banner-bg">
              <div className="bg-circle orange1"></div>
              <div className="bg-circle orange2"></div>
              <div className="bg-circle blue1"></div>
              <div className="bg-circle blue2"></div>
              <div className="bg-circle blue2"></div>
            </div>
            <div
              id="demo"
              className="carousel slide"
              data-ride="carousel"
              style={{ width: "100%" }}
            >
              <ul className="carousel-indicators">
                <li
                  data-target="#demo"
                  data-slide-to="0"
                  className="active"
                ></li>
                <li data-target="#demo" data-slide-to="1"></li>
                <li data-target="#demo" data-slide-to="2"></li>
              </ul>

              <div className="carousel-inner">
                <div className="carousel-item active">
                  <h2>
                    Lorem Ipsum is simply dummy text of <br /> the printing and
                    typesetting industry.
                    <br /> Lorem Ipsum{" "}
                  </h2>
                  <img src={require("../images/banner.png")} alt='Alternate Message'/>
                </div>
                <div className="carousel-item">
                  <h2>
                    Lorem Ipsum is simply dummy text of <br /> the printing and
                    typesetting industry.
                    <br /> Lorem Ipsum{" "}
                  </h2>
                  <img src={require("../images/banner.png")}  alt='Alternate Message'/>
                </div>
                <div className="carousel-item">
                  <h2>
                    Lorem Ipsum is simply dummy text of <br /> the printing and
                    typesetting industry.
                    <br /> Lorem Ipsum{" "}
                  </h2>
                  <img src={require("../images/banner.png")} alt='Alternate Message'/>
                </div>
              </div>
            </div>
          </div>
          <div className="formRight col-md-6 col-lg-5">
            <div className="logo">
              <img src={logo} className="" alt="logo" />
            </div>
            <form
              id="regvalidation"
              onSubmit={this.handleSubmit}
              className="myform"
            >
              <fieldset>
                <legend>Manager or Counsellor Login</legend>
                <div className="form-outline mb-4">
                  <TextField
                    label="Username"
                    type="text"
                    id="email"
                    name="email"
                    className="form-control"
                    variant="outlined"
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
                <div className="form-outline mb-2">
                  <TextField
                    label="Password"
                    type="password"
                    id="password outlined-basic"
                    name="password"
                    className="form-control"
                    variant="outlined"
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </div>
                <div className="row mb-4 mt-3">
                  <div className="col d-flex justify-content-left">
                    <div className="checkBoxOut">
                      <Checkbox
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        checked={this.state.isChecked}
                        id="form2Example31"
                        onChange={(event) => this.handleChechbox(event)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="form2Example31"
                      >
                        {" "}
                        Remember Me{" "}
                      </label>
                    </div>
                  </div>
                  <Tooltip
                    title={<><Box mb={2}><Typography component='p' variant='body2' color="textPrimary">Manager Account</Typography>
                    <Typography component='p' variant='caption'>Username : jhonmanager</Typography><Typography component='span' variant='caption' >Password : Mus@2121</Typography></Box>
                    <Box><Typography color="textPrimary" variant='body2'>Councellor Account</Typography>
                    <Typography component='p' variant='caption'>Username : GovindCouncellor</Typography><Typography component='span' variant='caption'>Password : Mus@2121</Typography></Box></>}
                    arrow >
                  <div className="col d-flex justify-content-end text-right small">
                    Test Crediential
                  </div>
                    </Tooltip>
                </div>
                {!this.state.loading ? (
                  <input
                    type="submit"
                    value="Login"
                    className="btn btn-primary mb-1 mt-5 w-100 button-login "
                  />
                ) : (
                  <div className="loader">
                    <LoaderButton />
                  </div>
                )}
              </fieldset>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  login,
})(Login);
