import React, { Component } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import { connect } from "react-redux";
import { updateUser, getUser } from "../../action/index";
import { Container } from "@mui/material";
import { API } from "../../config/config";
import Loader from "../../comman/loader";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { handleLogout } from "../header";

class CProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "counsellor",
      getUserDetail: [],
      userDetail: "",
      loading: true,
      getclasses: [],
      schoolLocation: localStorage?.getItem("schoolLocation"),
      currentLocation: localStorage?.getItem("currentLocation"),
    };
  }

  componentDidMount() {
    this.getDetailUser();
  }

  getDetailUser() {
    const id = localStorage.getItem("id");

    this.props.getUser(id, (res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        this.setState({ getUserDetail: res.data.data });
        this.GetClassData(res.data.data[0].classId);
      }
    });
  }

  GetClassData = async (classId) => {
    this.setState({ loading: true });
    await axios
      .get(`${API.getClass}`)
      .then((res) => {
        this.setState({ loading: false });
        const classNameData = res.data.data.filter((ress) => {
          return ress._id === classId;
        });
        this.setState({ getclasses: classNameData });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        this.setState({ loading: false });
      });
  };

  setOnChange(e) {
    if (this.validator.allValid()) {
      this.setState({ [e.target.name]: e.target.value });
    } else {
      this.validator.showMessages();
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  setOnChangeForPhone = (e) => {
    if (e !== "") {
      this.setState({ mobileNumber: e });
      this.setState({ mobileNumberError: "" });
    } else {
      this.setState({
        mobileNumberError: "The mobile number field is required.",
      });
    }
  };
  render() {
    const {
      loading,
      image,
      getclasses,
      getUserDetail,
      schoolLocation,
      currentLocation,
    } = this.state;

    const roleStr = localStorage?.getItem("role");
    const capitalizeFirstLetter =
      roleStr?.charAt(0)?.toUpperCase() + roleStr?.slice(1);

    const capitalizeFirstLetterofFirstName =
      getUserDetail[0]?.name?.charAt(0)?.toUpperCase() +
      getUserDetail[0]?.name?.slice(1);
    const capitalizeFirstLetterofLastName =
      getUserDetail[0]?.lastname?.charAt(0)?.toUpperCase() +
      getUserDetail[0]?.lastname?.slice(1);

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
                  <div className='heading'>
                        <h1>
                       
                             My Profile
                        </h1>
                    </div>
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
                        disabled
                      />
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
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row profileFields">
                    <div className="form-outline mb-4 col-md-6 addressProfileFields">
                      <label htmlFor="streetAddress">Mobile Number</label>

                      <PhoneInput
                        country={`${
                          schoolLocation &&
                          schoolLocation?.toLowerCase() === "usa"
                            ? "us"
                            : currentLocation?.toLowerCase()
                        }`}
                        value={`${getUserDetail[0].phone}`}
                        enableAreaCodes
                        enableSearch="true"
                        inputProps={{
                          name: "mobile",
                        }}
                        disabled
                      />
                    </div>

                    <div className="form-outline mb-4 col-md-6 addressProfileFields">
                      <label htmlFor="city">Username</label>
                      <input
                        type="text"
                        id="uname"
                        name="username"
                        className="form-control"
                        placeholder="Please enter your username"
                        value={getUserDetail[0].username}
                        disabled
                      />
                    </div>
                  </div>
                </div>
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
