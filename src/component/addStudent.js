import React, { Component } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Fade,
  Modal,
  Backdrop,
  Box,
  FormControl,
  MenuItem,
  Select,
  Container,
} from "@mui/material";
import { createClass, getClass } from "../action/index";
import { addStudent } from "../action/student";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import Loader from "../comman/loader";
import { toast } from "react-toastify";
import SimpleReactValidator from "simple-react-validator";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import LoaderButton from "../comman/loader1";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

toast.configure();

class AddStudent extends Component {
  state = {
    nameC: "",
    openmodel: false,
    openmodelNumber: false,
    name: "",
    lastname: "",
    fatherName: "",
    dob: "",
    phonename1: "",
    phonename2: "",
    phonename3: "",
    phone: "",
    phone1: "",
    // phone2: "",
    photo: "",
    file: "",
    medical: "",
    address: "",
    emergency: [],
    getclasses: [],
    classSelect: "",
    addName: "",
    addNumber: "",
    database: [],
    checked: false,
    startDate: "",
    dateError: "",
    loading: false,
    schoolLocation: localStorage.getItem("schoolLocation"),
    currentLocation: localStorage.getItem("currentLocation"),
    phoneError: "",
    phone1Error: "",
  };
  handleChange = (event) => {
    let checkedbox = event.target.checked;
    this.setState({
      checked: checkedbox,
    });
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
    $('input[name="fatherName"]').keyup(function (e) {
      if (/[^a-zA-Z]/g.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z]/g, "");
      }
    });
    $('input[name="phonename1"]').keyup(function (e) {
      if (/[^a-zA-Z]/g.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z]/g, "");
      }
    });
    $('input[name="phonename2"]').keyup(function (e) {
      if (/[^a-zA-Z]/g.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z]/g, "");
      }
    });
    $('input[name="phonename3"]').keyup(function (e) {
      if (/[^a-zA-Z]/g.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z]/g, "");
      }
    });
    $(document).ready(function () {
      $("#myform").validate({
        rules: {
          name: {
            required: true,
            minlength: 3,
          },
          lastname: {
            required: true,
            minlength: 3,
          },
          fatherName: {
            required: true,
            minlength: 3,
          },
          dob: {
            required: true,
          },
          address: {
            required: true,
          },
          phonename1: {
            required: true,
            minlength: 3,
          },
          phonename2: {
            required: true,
            minlength: 3,
          },
          phone: { required: true },

          demoselect: { required: true },
        },
        messages: {
          name: {
            required: "<p style='color:red'>Please Enter your first name</P>",
            minlength:
              "<p style='color:red'>Your first name must consist of at least 3 characters</p>",
          },
          lastname: {
            required: "<p style='color:red'>Please Enter your last name</P>",
            minlength:
              "<p style='color:red'>Your last name must consist of at least 3 characters</p>",
          },
          fatherName: {
            required: "<p style='color:red'>Please Enter your father Name</P>",
            minlength:
              "<p style='color:red'>Father name must consist of at least 3 characters</p>",
          },
          dob: {
            required: "<p style='color:red'>Date of birth is required</P>",
          },
          address: {
            required: "<p style='color:red'>Address is required</P>",
          },
          phone: {
            required: "<p style='color:red'>phone is required</P>",
          },
          phonename1: {
            required: "<p style='color:red'>Please enter name</P>",
            minlength:
              "<p style='color:red'>Your phone name must consist of at least 3 characters</p>",
          },
          phonename2: {
            required: "<p style='color:red'>Please enter name</P>",
            minlength:
              "<p style='color:red'>Your phone name must consist of at least 3 characters</p>",
          },

          demoselect: {
            required:
              "<p style='color:red;position: absolute;top: 56px;' >Assign class is required </p>",
          },
        },
      });
    });

    // $('input[name="phone"]').keyup(function (e) {
    //   if ((this.value === '')) {
    //     // Filter non-digits from input value.
    // this.setState({ phoneError: 'The mobile number field is required.' });

    //   }
    //   else{
    // this.setState({ phoneError: '' });

    //   }
    // });
    this.getClassData();
  }

  getClassData = () => {
    this.props.getClass((res) => {
      this.setState({ getclasses: res.data.data });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      lastname,
      fatherName,
      startDate,
      phonename1,
      phone,
      phone1,
      // phone2,
      phonename2,
      phonename3,
      emergency,
      medical,
      address,
      classSelect,
      phone1Error,
      phoneError,
      file,
    } = this.state;
    emergency.push(
      { Ename: phonename1, number: phone },
      { Ename: phonename2, number: phone1 }
      // { Ename: phonename3, number: phone2 }
    );

    const formData = new FormData();
    // if ( this.state.dateError ==="") {
    //   // toast.warn("Please assign a class");
    // } else {
    if (
      phoneError === "" ||
      phone1Error === "" ||
      phone !== "" ||
      phone1 !== ""
    ) {
      const requestData = {
        name: name,
        lastName: lastname,
        fatherName: fatherName,
        DOB: this.state.startDate,
        address: address,
        image: file,
        assignClass: classSelect,
        medical: medical,
        emergency: JSON.stringify(emergency),
      };

      for (var key in requestData) {
        formData.append(key, requestData[key]);
      }
      this.setState({ loading: true });
      this.props.addStudent(formData, (res) => {
        if (res.status === 200) {
          this.setState({ loading: false });
          toast.success("Student Added Successfully");
          setTimeout(() => {
            window.location.replace("/student");
          }, 2000);
        } else {
          this.setState({ loading: false });
          toast.error("Student Added Failed");
        }
      });
    }
  };

  handleClose = () => this.setState({ openmodel: false });
  handleOpen = () => this.setState({ openmodel: true });
  handleAddNumber = () => this.setState({ openmodelNumber: true });
  handleCloseNumber = () => this.setState({ openmodelNumber: false });
  modelEmergency = (e) => {
    this.setState({ addNumber: e });
    // $('input[name="phone"]').keyup(function (e) {
    //   if (/\D/g.test(this.value)) {
    //     // Filter non-digits from input value.
    //     this.value = this.value.replace(/\D/g, "");
    //   }
    // });
  };

  handleCreateClass = (e) => {
    e.preventDefault();
    const { nameC } = this.state;
    if (nameC === "") {
      toast.error("Classname is required");
    } else if (!nameC.startsWith("class")) {
      toast.error("Classname must start with class ex: 'class A'");
    } else if (nameC.charAt(6) === " ") {
      toast.warning("Given classname is not in correct format ex- 'class A'");
    } else if (nameC.charAt(5) !== " ") {
      toast.warning("Given classname is not in correct format ex- 'class A'");
    } else {
      const requestData = {
        className: nameC.slice(0, -1) + nameC.charAt(6).toUpperCase(),
      };
      this.setState({ loading: true });
      this.props.createClass(requestData, (res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          this.setState({ loading: false });
          this.setState({ openmodel: false });
        } else if (res.status === 400) {
          this.setState({ loading: false });
          toast.error(res.data.message);
        }
      });
    }
  };

  handleAddNewNumber = (e) => {
    e.preventDefault();
    const { addName, addNumber, database, emergency } = this.state;

    if (addName === "" || addNumber === "") {
      toast.error("All fields are required");
    } else {
      emergency.push({
        Ename: addName,
        number: addNumber,
      });
      this.setState({ database: emergency });
      if (emergency.length !== 0) {
        this.setState({ openmodelNumber: false });
        toast.success("Number added successfully");
      } else {
        toast.error("Number added failed");
      }
    }
  };

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    if (file.size >= 6000) {
      toast.error("Student image must be less than 6kb");
    } else {
      reader.onloadend = () => {
        this.setState({
          file: file,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  setOnChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  setOnChangeForPhone(e) {
    if (e !== "") {
      this.setState({ phone: e });
      this.setState({ phoneError: "" });
    } else {
      this.setState({ phoneError: "The mobile number field is required." });
    }
  }

  setOnChangeForPhone1(e) {
    if (e !== "") {
      this.setState({ phone1: e });
      this.setState({ phone1Error: "" });
    } else {
      this.setState({ phone1Error: "The mobile number field is required." });
    }
  }

  addClassOnChange(e) {
    this.setState({ nameC: e.target.value });

    $(document).ready(function () {
      $("#addClass").validate({
        rules: {
          class: {
            required: true,
            minlength: 7,
            maxlength: 7,
          },
        },
        messages: {
          class: {
            required: "<p style='color:red'>Please enter classname</P>",
            minlength:
              "<p style='color:red'>Classname must be 7 characters</p>",
            maxlength:
              "<p style='color:red'>Classname must be 7 characters</p>",
          },
        },
      });
    });
    $('input[name="class"]').keyup(function (e) {
      if (/[^A-Za-z\s]/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/[^A-Za-z\s]/g, "");
      }
    });
  }
  HandleDate(e) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const yyyy = e.getFullYear();

    const date = currentYear - 2;
    if (yyyy > currentYear) {
      this.setState({ dateError: "Date of birth cannot be a future date" });
    } else if (yyyy > date) {
      this.setState({ dateError: "Student should be over 2 years old" });
    } else {
      this.setState({ startDate: e });
      this.setState({ dateError: "" });
    }
  }

  render() {
    const {
      openmodel,
      openmodelNumber,
      classSelect,
      getclasses,
      photo,
      phone,
      phone1,
      // phone2,
      phonename1,
      phonename2,
      phonename3,
      medical,
      address,
      name,
      lastname,
      fatherName,
      dob,
      database,
      schoolLocation,
      currentLocation,
      phone1Error,
      phoneError,
    } = this.state;
    let $imagePreview = null;
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      borderRadius: "15px",
      p: 4,
    };

    const current = new Date().toISOString().split("T")[0];

    const content =
      this.state.checked === true
        ? "display form-outline mb-4 col-md-12 medicaltextarea"
        : "no-display form-outline mb-4 col-md-12 medicaltextarea";

    const label = { inputProps: { "aria-label": "Checkbox demo" } };

    const addFillName = (e) => {
      $('input[name="name"]').keyup(function (e) {
        if (/[^a-zA-Z]/g.test(this.value)) {
          this.value = this.value.replace(/[^a-zA-Z]/g, "");
        }
      });
      $(document).ready(function () {
        $("#popupval").validate({
          rules: {
            name: {
              required: true,
              minlength: 3,
            },
            phone: { required: true, minlength: 10, maxlength: 10 },
          },
          messages: {
            name: {
              required: "<p style='color:red'>The name field is required</p>",
              minlength:
                "<p style='color:red'>Your first name must consist of at least 3 characters</p>",
            },
            phone: {
              required: "<p style='color:red'> Mobile number is required</p>",
              minlength:
                "<p style='color:red'>Mobile number must be 10 digit</p>",
              maxlength:
                "<p style='color:red'>Mobile number must be 10 digit</p>",
            },
          },
        });
      });
      this.setState({ addName: e.target.value });
    };

    return (
      <>
        <Sidebar />
        <div className="col-md-8 col-lg-9 col-xl-10 mr-30 ">
          <div className="header">
            {" "}
            <ImageAvatars />
          </div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openmodel}
            onClose={this.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openmodel}>
              <Box sx={style}>
                <form
                  className="mui-form"
                  id="addClass"
                  onSubmit={this.handleCreateClass}
                >
                  <legend>Add Class</legend>
                  <div className="mui-textfield">
                    <input
                      type="text"
                      placeholder="class E"
                      name="class"
                      onChange={(e) => this.addClassOnChange(e)}
                    />
                  </div>
                  <div className="btndesign text-right">
                    <button
                      type="button"
                      className="btn btn-transparent"
                      onClick={this.handleClose}
                    >
                      CLOSE
                    </button>
                    {!this.state.loading ? (
                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="SAVE"
                      />
                    ) : (
                      <>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          disabled
                        >
                          SAVE
                        </button>
                        <LoaderButton />
                      </>
                    )}
                  </div>
                </form>
              </Box>
            </Fade>
          </Modal>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openmodelNumber}
            onClose={this.handleCloseNumber}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openmodelNumber}>
              <Box sx={style}>
                <form
                  name="popupval"
                  id="popupval"
                  className="mui-form"
                  onSubmit={this.handleAddNewNumber}
                >
                  <legend>Add New Number</legend>
                  <div className="mui-textfield">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Please enter your name"
                      onChange={(e) => addFillName(e)}
                    />
                    <PhoneInput
                      country={`${
                        schoolLocation && schoolLocation.toLowerCase() === "usa"
                          ? "us"
                          : currentLocation.toLowerCase()
                      }`}
                      value={`${this.state.addNumber}`}
                      enableAreaCodes
                      enableSearch="true"
                      countryCodeEditable={false}
                      onChange={(e) => this.modelEmergency(e)}
                      inputProps={{
                        name: "addphone",
                        required: true,
                        // autoFocus: true,
                        copyNumbersOnly: true,
                      }}
                    />
                  </div>
                  <div className="btndesign text-right">
                    <button
                      type="button"
                      className="btn btn-transparent"
                      onClick={this.handleCloseNumber}
                    >
                      CLOSE
                    </button>
                    {!this.state.loading ? (
                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="SAVE"
                      />
                    ) : (
                      <button type="button" class="btn btn-secondary" disabled>
                        <LoaderButton />
                        SAVE
                      </button>
                    )}
                  </div>
                </form>
              </Box>
            </Fade>
          </Modal>
          <Container
            maxWidth="100%"
            style={{ padding: "0", display: "inline-block" }}
          >
            <div className="heading1 mb-5">
              <h1>Add Student</h1>
            </div>
            <form id="myform" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="name">First Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => this.setOnChange(e)}
                    placeholder="Please provide first name"
                  />
                  {/* {this.validator.message('first name',name,'required|min:3' )} */}
                </div>
                <div className="form-outline mb-4 col-md-6 ">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="form-control"
                    value={lastname}
                    onChange={(e) => this.setOnChange(e)}
                    placeholder="Please provide last name"
                  />
                  {/* {this.validator.message('lastname',lastname,'required|min:3' )} */}
                </div>
              </div>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="fatherName">Father Name</label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    className="form-control"
                    value={fatherName}
                    onChange={(e) => this.setOnChange(e)}
                    placeholder="Please provide father name"
                  />
                  {/* {this.validator.message('father name',fatherName,'required|min:3' )} */}
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="dob">Date of Birth</label>
                  <div>
                    <DatePicker
                      placeholderText="Please select date of birth"
                      name="dob"
                      selected={this.state.startDate}
                      onChange={(date) => this.HandleDate(date)}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                </div>
                <p style={{ color: "red", fontSize: "12px" }}>
                  {this.state.dateError}
                </p>
              </div>

              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <div className="col-md-12 pl-0 pr-0 mb-4">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                      value={address}
                      onChange={(e) => this.setOnChange(e)}
                      placeholder="Please provide address"
                    />
                    {/* {this.validator.message('address',address,'required' )} */}
                  </div>
                  <div className="col-md-12 pl-0 pr-0">
                    <div className="form-outline mb-4">
                      <label className="w-100" htmlFor="assign">
                        Assign Class
                      </label>

                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        className="filter ml-0 mb-3 w-100 select-box"
                      >
                        <select
                          labelId="demo-simple-select-helper-label "
                          id="demo-simple-select-helper "
                          name="demoselect"
                          value={classSelect}
                          label="Filter"
                          onChange={(e) =>
                            this.setState({
                              classSelect: e.target.value,
                            })
                          }
                          inputProps={{ "aria-label": "Without label" }}
                          className="w-100 form-control "
                        >
                          <option value="">select</option>
                          {getclasses.map((item) => {
                            return (
                              <option key={item._id} value={item._id}>
                                {item.className}
                              </option>
                            );
                          })}
                        </select>
                      </FormControl>
                      {/* 
                      {this.validator.message(
                        "Assign class",
                        classSelect,
                        "required"
                      )} */}
                      <a
                        className="float-right pointer blue"
                        onClick={this.handleOpen}
                      >
                        Add new class
                      </a>
                    </div>
                  </div>
                </div>
                <div className="form-outline mb-4 col-md-6">
                  <label htmlFor="emergency">Emergency</label>
                  <div className="phoneNo">
                    <span className="col-md-4 mr-2 p-0">
                      <input
                        type="text"
                        id="phonename1"
                        name="phonename1"
                        placeholder="Name"
                        className="form-control mb-3 col-md-12 "
                        value={phonename1}
                        onChange={(e) => this.setOnChange(e)}
                      />
                      {/* {this.validator.message('name',phonename1,'required|min:3' )} */}
                    </span>
                    <span className="col-md-8 p-0">
                      <PhoneInput
                        country={`${
                          schoolLocation &&
                          schoolLocation.toLowerCase() === "usa"
                            ? "us"
                            : currentLocation.toLowerCase()
                        }`}
                        value={`${phone}`}
                        enableAreaCodes
                        enableSearch="true"
                        countryCodeEditable={false}
                        onChange={(phone) => this.setOnChangeForPhone(phone)}
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                        }}
                      />
                      {phoneError !== "" ? (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {phoneError}
                        </p>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <div className="phoneNo">
                    <span className="col-md-4 mr-2 p-0">
                      <input
                        type="text"
                        id="phonename2"
                        name="phonename2"
                        placeholder="Name"
                        className="form-control mb-3 col-md-12 "
                        value={phonename2}
                        onChange={(e) => this.setOnChange(e)}
                      />

                      {/* {this.validator.message('name',phonename1,'required|min:3' )} */}
                    </span>
                    <span className="col-md-8 p-0">
                      <PhoneInput
                        country={`${
                          schoolLocation &&
                          schoolLocation.toLowerCase() === "usa"
                            ? "us"
                            : currentLocation.toLowerCase()
                        }`}
                        value={`${phone1}`}
                        countryCodeEditable={false}
                        enableAreaCodes
                        enableSearch="true"
                        onChange={(phone) => this.setOnChangeForPhone1(phone)}
                        inputProps={{
                          name: "phone1",
                        }}
                      />
                      {phone1Error !== "" ? (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {phone1Error}
                        </p>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  {/* <div className="phoneNo">
                    <span className="col-md-4 mr-2 p-0">
                      <input
                        type="text"
                        id="phonename3"
                        name="phonename3"
                        placeholder="Name"
                        className="form-control mb-3 col-md-12 "
                        value={phonename3}
                        onChange={(e) => this.setOnChange(e)}
                      />
                      {/* {this.validator.message('name',phonename1,'required|min:3' )} */}
                  {/* </span>
                    <span className="col-md-8 p-0">
                      {" "}
                       <PhoneInput
                          country={`${
                            schoolLocation
                              ? schoolLocation.toLowerCase()
                              : currentLocation.toLowerCase()
                          }`}
                          value={`${phone2}`}
                          enableAreaCodes
                          enableSearch="true"
                          // countryCodeEditable={false}
                          onChange={(phone) => this.setState({phone2:phone})}
                          inputProps={{
                            name: "phone2",
                          }}
                        />
                      
                    </span>
                  </div> */}
                  {database ? (
                    <>
                      {database.map((data) => {
                        return (
                          <div className="phoneNo">
                            <input
                              type="text"
                              className="form-control mb-3 col-md-4 mr-2"
                              value={data.Ename}
                            />
                            <PhoneInput
                              country={`${
                                schoolLocation &&
                                schoolLocation.toLowerCase() === "usa"
                                  ? "us"
                                  : currentLocation.toLowerCase()
                              }`}
                              placeholder={`${data.number}`}
                              disableAreaCodes
                              disableCountryCode
                              disableDropdown
                              countryCodeEditable={false}
                              enableAreaCodes
                              enableSearch="true"
                            />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    ""
                  )}

                  {/* {phone === "" ||
                  phone1 === "" ||
                  // phone2 === "" ||
                  phonename1 === "" ||
                  phonename2 === ""
                  // phonename3 === "" 
                  ? (
                    ""
                  ) : ( */}
                  <a
                    className="float-right pointer blue"
                    onClick={this.handleAddNumber}
                  >
                    Add new
                  </a>
                  {/* )} */}
                </div>
              </div>

              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label className="w-100"> Photo</label>

                  <label htmlFor="photo">
                    {photo
                      ? ($imagePreview = (
                          <img
                            src={photo}
                            alt="dummy"
                            width="80px"
                            height="80px"
                          />
                        ))
                      : ($imagePreview = (
                          <>
                            <div className="previewText1">
                              {" "}
                              <strong>Upload image</strong>
                            </div>
                            <p style={{ fontSize: "13px" }}>
                              Student image must be less than 6kb
                            </p>
                          </>
                        ))}
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    className="form-control"
                    style={{ display: "none" }}
                    onChange={(e) => this._handleImageChange(e)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-outline mb-4 col-md-6 medicalCheckbox">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={this.state.checked}
                    onChange={this.handleChange}
                  />

                  <label htmlFor="medicalCheckbox" className="medicalLabel">
                    {" "}
                    Enter Medical Information
                  </label>
                  <div className={content}>
                    <label htmlFor="medical">Medical</label>
                    <textarea
                      id="medical"
                      name="medical"
                      rows="4"
                      cols="50"
                      value={medical}
                      onChange={(e) =>
                        this.setState({ medical: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="/student"
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
                  <button type="button" class="btn btn-secondary" disabled>
                    <Loader />
                    SAVE
                  </button>
                )}
              </div>
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
  addStudent,
})(AddStudent);
