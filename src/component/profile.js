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
} from "@mui/material";

import $ from "jquery";
import validate from "jquery-validation";
import { BASE_URL } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.css";
import Loader from "../comman/loader";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

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
    profileName: "",
    zipcode: "",
    schoolLocation: localStorage.getItem("schoolLocation"),
    currentLocation: localStorage.getItem("currentLocation"),
	mobileNumberError:'',
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
      imagePreviewUrl,
      zipcode,
	  mobileNumberError,
    } = this.state;
    const formData = new FormData();

    if (this.validator.allValid() && numberValid === true && mobileNumberError === '')  {
      const id = localStorage.getItem("id");
      const requestData = {
        role: role,
        street_Address: streetAddress,
        phone: mobileNumber,
        country: country,
        city: city,
        state: state,
        email: email,
        name: name,
        // zipcode: zipCode,
        image: file === "" ? image : file,
      };

      for (var key in requestData) {
        formData.append(key, requestData[key]);
      }
      this.props.updateUser(id, formData, (res) => {
        if (res.status === 200) {
          toast.success("Profile updated successfully");
          this.getDetailUser();
          localStorage.setItem("name", name);
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
        localStorage.setItem("image", reader.result);
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
        this.setState({ zipcode: res.data.data[0].phone });
        localStorage.setItem("image", res.data.data[0].image);
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

  setOnChangeForMobile(e) {

    if (e !== '') {
      this.setState({ mobileNumber: e });
	  this.setState({ mobileNumberError: '' });
    }else{
      this.setState({ mobileNumber: e });
		this.setState({ mobileNumberError: 'The mobile number field is required.' });
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
      image,
      name,
      streetAddress,
      city,
      email,
      mobileNumber,
      profileName,
      file,
      currentLocation,
      schoolLocation,
      zipcode,
	  mobileNumberError,
    } = this.state;
    let $imagePreview = null;

    const roleStr = localStorage?.getItem("role");
    const capitalizeFirstLetter =
      roleStr.charAt(0).toUpperCase() + roleStr.slice(1);

    const capitalizeFirstLetterofName =
      name.charAt(0).toUpperCase() + name.slice(1);
    const capitalizeFirstLetterofProfileName =
      profileName.charAt(0).toUpperCase() + profileName.slice(1);

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
              <Loader />
            ) : (
              <React.Fragment>
                    <div className='heading'>
                        <h1>
                            <span className='counsellor-logo'><AssignmentIndIcon/>  </span>
                             My Profile
                        </h1>
                    </div>
                <form onSubmit={this.handleSubmit}>
                  <Stack direction="row" spacing={2} className="profileAvtar">
                    <div>
                      <Avatar
                        alt={capitalizeFirstLetterofName}
                        src={`${BASE_URL}/${image}`}
                        sx={{ width: 56, height: 56 }}
                      />
                    </div>
                    <span>
                      <span className="editable">
                        {capitalizeFirstLetterofProfileName}
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
                                    alt={capitalizeFirstLetterofName}
                                    src={imagePreviewUrl}
                                    sx={{ width: 56, height: 56 }}
                                  />{" "}
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px" }}
                                  ></i>
                                </div>
                              ))
                            : ($imagePreview = (
                                <div className="previewText">
                                  {" "}
                                  <Avatar
                                    alt={capitalizeFirstLetterofName}
                                    src={`${BASE_URL}/${image}`}
                                    sx={{ width: 56, height: 56 }}
                                  />{" "}
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px", right: "44px" }}
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
                          value={capitalizeFirstLetterofName}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message("name", name, "required|min:3")}
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
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="zipcode" className="w-100">
                          Zip Code
                        </label>
                        <input
                          type="number"
                          id="zipcode"
                          name="zipcode"
                          className="form-control"
                          placeholder="Please enter your zipcode"
                          value={zipcode}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message("city", zipcode, "required|number")}
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
                        <PhoneInput
                          country={`${
                            schoolLocation &&
                          schoolLocation.toLowerCase() === "usa"
                            ? "us"
                            : currentLocation.toLowerCase()
                          }`}
                          value={`${mobileNumber}`}
                          enableAreaCodes
                         
                          enableSearch="true"
                          onChange={(phone) => this.setOnChangeForMobile(phone)}
                          inputProps={{
                            name: "mobileNumber",
                          }}
                        />
						{mobileNumberError !== '' ? <p style={{color:'red', fontSize: "12px" }}>{mobileNumberError}</p>: ''}
                          
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
