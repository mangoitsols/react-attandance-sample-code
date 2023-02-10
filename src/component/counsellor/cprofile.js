import React, { Component } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import { connect } from "react-redux";
import {
  updateUser,
  getUser,
} from "../../action/index";
import {
  FormControl,
  MenuItem,
  Select,
  Container,
  Avatar,
  Stack,
  Button,
} from "@mui/material";

import $ from "jquery";
import validate from "jquery-validation";
import { API, BASE_URL } from "../../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.css";
import Loader from "../../comman/loader";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import axios from "axios";
import { handleLogout } from "../header";

toast.configure();

class CProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "counsellor",
      firstName: "",
      lastName: "",
      username: "",
      classId: "",
      mobileNumber: "",
      getUserDetail: [],
      userDetail: "",
      loading: true,
      numberValid: true,
      cancel: false,
      getclasses: [],
     
    };
  }

  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }

  componentDidMount() {
    this.getDetailUser();
    this.GetClassData();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      lastName,
      firstName,
      username,
      mobileNumber,
      classId,
      role,
      numberValid,
    } = this.state;

    if (this.validator.allValid() && numberValid === true) {
      const id = localStorage.getItem("id");
      const requestData = {
        role: role,
        username: username,
        phone: mobileNumber,
        classId: classId,
        name: firstName,
        lastname: lastName,
      };

      this.props.updateUser(id, requestData, (res) => {
        if (res.status === 200) {
          toast.success("Profile updated successfully");
          this.getDetailUser();
          localStorage.setItem("name", firstName);
          localStorage.setItem("image", '');
        } else if (res.status === 400) {
          toast.error(res.data.message);
        }
      });
    } else {
      this.validator.showMessages();
      toast.success("Please fill the valid information");
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  getDetailUser() {
    const id = localStorage.getItem("id");

    this.props.getUser(id, (res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        this.setState({ firstName: res.data.data[0].name });
        this.setState({ lastName: res.data.data[0].lastname });    
        this.setState({ username: res.data.data[0].username });
        this.setState({ mobileNumber: res.data.data[0].phone });
        this.setState({ classId: res.data.data[0].classId });
      }
    });
  }

  GetClassData = async() => {
    this.setState({loading:true});
    await axios
      .get(`${API.getClass}`)
      .then((res) => {
        this.setState({loading:false});
        this.setState({getclasses:res.data.data});
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout()
        }
        this.setState({loading:false});
      });
  };

  setOnChange(e) {
    if (this.validator.allValid()) {
      this.setState({ [e.target.name]: e.target.value });
    } else {
      this.validator.showMessages();
      this.setState({ [e.target.name]: e.target.value });
    }
    $('input[name="mobileNumber"]').keyup(function (e) {
      if (/\D/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, "");
      }
    });
    if (e.target.name === "mobileNumber") {
      if (e.target.value.toString().length < 10) {
        this.setState({ numberValid: false });
      } else if (e.target.value.toString().length > 10) {
        this.setState({ numberValid: false });
      } else {
        this.setState({ numberValid: true });
      }
    }
  }

  render() {
    const {
        lastName,
      loading,
      numberValid,
      image,
      firstName,
      username,
      mobileNumber,
      classId,
      getclasses,
     
    } = this.state;
    
    const roleStr = localStorage?.getItem("role");
    const capitalizeFirstLetter = roleStr.charAt(0).toUpperCase() + roleStr.slice(1);

    const capitalizeFirstLetterofFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const capitalizeFirstLetterofLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    return (
      <>
        <div className="col-md-3 col-lg-2">
        <Sidebar />
      </div>
        <div className="col-md-8 col-lg-9 col-xl-10 mr-30">
          <div className="header">
            {" "}
            <ImageAvatars />
          </div>
          <Container
            maxWidth="100%"
            style={{ padding: "0", display: "inline-block" }}
          >
            {loading ? (
              <Loader />
            ) : (
              <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                  <Stack direction="row" spacing={2} className="profileAvtar">
                    <div>
                    <Avatar
                        alt={capitalizeFirstLetterofFirstName}
                        src={`${BASE_URL}/${image}` }
                        sx={{ width: 56, height: 56 }}
                      />
                    </div>
                    <span>
                      <span className="editable">
                       {capitalizeFirstLetterofFirstName} {capitalizeFirstLetterofLastName}
                      </span>
                      <br />
                      <small> {capitalizeFirstLetter} </small>
                    </span>
                  </Stack>
                  <div className="profileBox">
                    <div className="row">

<div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="streetAddress">First Name</label>
                        <input
                          type="text"
                          id="fname"
                          name="firstName"
                          className="form-control"
                          placeholder="Please enter your first name"
                          value={capitalizeFirstLetterofFirstName}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message("firstName", firstName, "required|min:3|alpha")}
                      </div>
                    

                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="streetAddress">Last Name</label>
                        <input
                          type="text"
                          id="lname"
                          name="lastName"
                          className="form-control"
                          placeholder="Please enter your last name"
                          value={capitalizeFirstLetterofLastName}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message("lastName", lastName, "required|min:3|alpha")}
                      </div>
                    </div>
                    <div className="row profileFields">
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="streetAddress">Mobile Number</label>
                        <input
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          className="form-control"
                          placeholder="Please enter your mobile number"
                          value={mobileNumber}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {numberValid === false ? (
                          <p style={{ color: "red", fontSize: "12px" }}>
                            Mobile number must be 10 digit
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="city">Username</label>
                        <input
                          type="text"
                          id="uname"
                          name="username"
                          className="form-control"
                          placeholder="Please enter your username"
                          value={username}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message("username", username, "required|alpha")}
                      </div>
                          

                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="mobileNumber">Assign Class</label>
                        <FormControl
                  sx={{ m: 0, minWidth: 120 }}
                  className="filterbox w-100"
                >
                  <Select
                    required="true"
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={classId}
                    label="Filter"
                    onChange={(e) => this.setOnChange(e)}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {getclasses.map((item) => {
                      return (
                        <MenuItem value={item._id}>{item.className}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                      </div>
                    </div>
                    <div className="profileBtn">
                      <Link
                        to="/dashboard"
                        className="btn btn-transparent btn-block mb-4 "
                      >
                        CANCEL
                      </Link>
                      {!loading  ? 
                      <input
                        type="submit"
                        className="btn btn-primary btn-block mb-4 "
                        value="UPDATE"
                        
                      />: <input
                      type="submit"
                      className="btn btn-primary btn-block mb-4 "
                      value="UPDATE"
                      disabled
                    />}
                    </div>
                  </div>
                </form>
              </React.Fragment>
            )}
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

  updateUser,
  getUser,
})(CProfile);
