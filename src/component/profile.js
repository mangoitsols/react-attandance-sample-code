import React, { Component } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import { connect } from "react-redux";
import {
  getAllCountry,
  getStateBYCountryId,
  updateUser,
  getUser,
} from "../action/index";
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
import { BASE_URL } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.css";
import Example from "../comman/loader";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import ChatNotify from "../comman/chatNotify";
toast.configure();

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }

  state = {
    role: "manager",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    email: "",
    mobileNumber: "",
    getCountry: [],
    stateByCountry: [],
    managerPass: "123456789",
    name: "",
    file: "",
    image: "",
    imagePreviewUrl: "",
    getUserDetail: [],
    userDetail: "",
    loading: "true",
    numberValid: true,
    cancel: false,
    profileName:''
  };
  componentDidMount() {
    this.props.getAllCountry((res) => {
      if (res.status === 200) {
        // this.setState({loading:false})
        this.setState({ getCountry: res.data.country });
      }
    });
    
    this.getDetailUser();
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      role,
      name,
      city,
      state,
      country,
      mobileNumber,
      email,
      streetAddress,
      image,
      file,
      numberValid,
      imagePreviewUrl
    } = this.state;
    const formData = new FormData();

    if (this.validator.allValid() && numberValid === true) {
      const id = localStorage.getItem("id");
      const requestData = {
        role: role,
        street_Address: streetAddress,
        mobileNumber: mobileNumber,
        country: country,
        city: city,
        state: state,
        email: email,
        name: name,
        image: file === "" ? image : file,
      };
      
      for (var key in requestData) {
        formData.append(key, requestData[key]);
      }
      this.props.updateUser(id, formData, (res) => {
        if (res.status === 200) {
          toast.success("Profile updated successfully");
          this.getDetailUser();
          localStorage.setItem('name',name)
          localStorage.setItem("image",image)
        } else if (res.status === 400) {
          toast.error(res.data.message);
        }
      });
    } else {
      this.validator.showMessages();
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleCountry = (e) => {
    this.setState({ country: e.target.value });
    const id = e.target.value;
    this.props.getStateBYCountryId(id, (res) => {
      this.setState({ stateByCountry: res.data });
    });
  };

  handleState = (id) => {
    this.props.getStateBYCountryId(id, (res) => {
      this.setState({ stateByCountry: res.data });
    });
  };

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    if (file.size >= 6000) {
      toast.error("Profile picture size should be less than 6kb.");
    } else {
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
        });
        localStorage.setItem("image",reader.result)

      };
      reader.readAsDataURL(file);
    }
  }

 
  getDetailUser() {
    const id = localStorage.getItem("id");

    this.props.getUser(id, (res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        this.setState({ streetAddress: res.data.data[0].street_Address });
        this.setState({ city: res.data.data[0].city });
        this.setState({ mobileNumber: res.data.data[0].phone });
        this.setState({ email: res.data.data[0].email });
        this.setState({ name: res.data.data[0].name });
        this.setState({ profileName: res.data.data[0].name });
        this.setState({ image: res.data.data[0].image });
        this.setState({ state: res.data.data[0].state });
        this.setState({ country: res.data.data[0].country });
      }
      this.handleState(res.data.data[0].country);
    });
  }

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
    $('input[name="name"]').keyup(function (e) {
      if (/[^A-Za-z\s]/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/[^A-Za-z\s]/g, "");
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
      getCountry,
      stateByCountry,
      imagePreviewUrl,
      country,
      state,
      loading,
      numberValid,
      image,
      name,
      streetAddress,
      city,
      email,
      mobileNumber,
      profileName
    } = this.state;
    let $imagePreview = null;
    const roleStr = localStorage?.getItem("role");
    const capitalizeFirstLetter = roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
    return (
      <>
        <Sidebar />
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
              <Example />
            ) : (
              <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                  <Stack direction="row" spacing={2} className="profileAvtar">
                    <div>
                    <Avatar
                        alt="Remy Sharp"
                        src={`${BASE_URL}/${image}` }
                        sx={{ width: 56, height: 56 }}
                      />
                    </div>
                    <span>
                      <span className="editable">
                       {profileName}
                      </span>
                      <br />
                      <small> {capitalizeFirstLetter} </small>
                    </span>
                  </Stack>
                  <div className="profileBox">
                  <div className="row">

                  <div className="form-outline mb-4 col-md-6">
                      <label htmlFor="upload-button">
                      <label>Profile Image</label>
                        {imagePreviewUrl
                          ? ($imagePreview = (
                              <div className="previewText">
                                {" "}
                                <Avatar
                                  alt="Remy Sharp"
                                  src={imagePreviewUrl}
                                  sx={{ width: 56, height: 56 }}
                                />{" "}
                                <i
                                  className="fa fa-camera"
                                  style={{ fontSize: "35px"}}
                                ></i>
                              </div>
                            ))
                          : ($imagePreview = (
                              <div className="previewText">
                                {" "}
                                <Avatar
                                  alt="Remy Sharp"
                                  src={`${BASE_URL}/${image}`}
                                  sx={{ width: 56, height: 56 }}
                                />{" "}
                                <i
                                  className="fa fa-camera"
                                  style={{ fontSize: "35px",right:"44px" }}
                                ></i>
                              </div>
                            ))}

                      </label>
                      <input
                        type="file"
                        id="upload-button"
                        style={{ display: "none" }}
                        onChange={(e) => this._handleImageChange(e)}
                      />
                    </div>

                  <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="streetAddress">Profile Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          placeholder="Please enter your name"
                          value={name}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message(
                          "name",
                          name,
                          "required|min:3"
                        )}
                      </div>
                    </div>
                    <h5>My Address</h5>
                    <div className="row profileFields">
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="streetAddress">Street Address</label>
                        <input
                          type="text"
                          id="streetAddress"
                          name="streetAddress"
                          className="form-control"
                          placeholder="Please enter your Street Address"
                          value={streetAddress}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message(
                          "street address",
                          streetAddress,
                          "required|min:10"
                        )}
                      </div>
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="state" className="w-100">
                          State
                        </label>
                        <FormControl
                          sx={{ m: 1, minWidth: 120 }}
                          className="filter ml-0 w-100 state "
                        >
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={state}
                            label="state"
                            onChange={(e) =>
                              this.setState({ state: e.target.value })
                            }
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            {stateByCountry.map((item) => {
                              return (
                                <MenuItem key={item._id} value={item._id}>
                                  {item.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="form-control"
                          placeholder="Please enter your city"
                          value={city}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message("city", city, "required|alpha")}
                      </div>
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="country" className="w-100">
                          Country
                        </label>
                        <FormControl
                          sx={{ m: 0, minWidth: 120 }}
                          className="filter ml-0 w-100 country"
                        >
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={country}
                            label="country"
                            onChange={this.handleCountry}
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            {getCountry.map((item) => {
                              return (
                                <MenuItem key={item._id} value={item._id}>
                                  {item.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <h5 className="contactDetail">Contact Detail</h5>
                    <div className="row profileFields">
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Please enter your email"
                          value={email}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message(
                          "email",
                          email,
                          "required|email"
                        )}
                      </div>

                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="mobileNumber">Mobile Number</label>
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
                    </div>
                    <div className="profileBtn">
                      <Link
                        to="/dashboard"
                        className="btn btn-transparent btn-block mb-4 "
                      >
                        CANCEL
                      </Link>
                      <input
                        type="submit"
                        className="btn btn-primary btn-block mb-4 "
                        value="UPDATE"
                      />
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
  getAllCountry,
  getStateBYCountryId,
  updateUser,
  getUser,
})(Profile);
