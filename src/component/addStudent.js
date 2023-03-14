import React, { Component } from "react";
import ImageAvatars, { handleLogout } from "./header";
import Sidebar from "./sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Fade,
  Modal,
  Backdrop,
  Box,
  FormControl,
  Container,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { createClass, getClass,getAllCountry,getStateBYCountryId } from "../action/index";
import { addStudent } from "../action/student";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import Loader from "../comman/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderButton from "../comman/loader1";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { API } from "../config/config";
import { authHeader } from "../comman/authToken";
import moment from "moment";
import Example from "../comman/loader";

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
    photo: "",
    file: "",
    medical: "",
    address: "",
    emergency: [],
    getclasses: [],
    classSelect: "",
    state:"",
    stateByCountry:[],
    getCountry:[],
    country:"",
    addName: "",
    addNumber: "",
    database: [],
    checked: false,
    startDate: "",
    Submitloading: false,
    AddClassloading: false,
    getClassloading: false,
    schoolLocation: localStorage.getItem("schoolLocation"),
    currentLocation: localStorage.getItem("currentLocation"),
    phoneError: "",
    phone1Error: "",
    CounsellorDetail: [],
    city:'',
  };

  handleChange = (event) => {
    let checkedbox = event.target.checked;
    this.setState({
      checked: checkedbox,
    });
  };

  handleGetCouncellor = () => {
    fetch(API.getAllUser, { headers: authHeader() })
      .then((a) => {
        if (a.status === 200) {
          return a.json();
        } else {
        }
      })
      .then((data) => {
        this.setState({
          CounsellorDetail: data.filter((e) => e.role.name === "counsellor"),
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  componentDidMount() {

    $('input[name="name"]').keyup(function (e) {
      if (/[^a-zA-Z]/g.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z]/g, "");
      }
    });
    $('input[name="city"]').keyup(function (e) {
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
          zipcode:{
            required: true,
			minlength:5,
			maxlength:5,
          },
          phone: { required: true },
          city: { required: true ,minlength: 3},

          demoselect: { required: true },
          countryselect: { required: true },
          stateselect: { required: true },
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
            required: "<p style='color:red'>Street address is required</P>",
          },
          zipcode: {
            required: "<p style='color:red'>Zipcode is required</P>",
			minlength:
              "<p style='color:red'>zipcode must consist of at least 5 characters</p>",
			maxlength:
              "<p style='color:red'>zipcode must consist of at least 5 characters</p>",
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
          city: {
            required: "<p style='color:red'>Please enter city</P>",
            minlength:
              "<p style='color:red'>City name must consist of at least 3 characters</p>",
          },
          demoselect: {
            required:
              "<p style='color:red;position: absolute;top: 56px;' >Assign class is required </p>",
          },
          countryselect: {
            required:
              "<p style='color:red;position: absolute;top: 56px;' >Country is required </p>",
          },
          stateselect: {
            required:
              "<p style='color:red;position: absolute;top: 56px;' >State is required </p>",
          },
        },
      });
    });

    this.handleGetCouncellor();
    this.getClassData();
    this.getCountries();
  }

  getCountries = () =>{
  this.props.getAllCountry((res) => {
    if (res.status === 200) {
      this.setState({ getCountry: res.data.country });
    }
  });
}

  handleCountry = (e) => {
    this.setState({ country: e.target.value });
    const id = e.target.value;
    if(id){
    this.handleState(id)}
  };

  handleState = (id) => {
    this.props.getStateBYCountryId(id, (res) => {
      this.setState({ stateByCountry: res.data });
    });
  };

  getClassData = () => {
    this.setState({getClassloading:true})
    this.props.getClass((res) => {
      this.setState({getClassloading:false})
      const filterData = res.data.data.filter((fil) => fil.className !== 'class unassigned')
      this.setState({ getclasses: filterData });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      lastname,
      fatherName,
      phonename1,
      phone,
      phone1,
      phonename2,
      emergency,
      medical,
      address,
      classSelect,
      phone1Error,
      phoneError,
      file,
      zipcode,
      CounsellorDetail,
      country,
      state,
      city,
    } = this.state;

    emergency.push(
      { Ename: phonename1, number: phone },
      { Ename: phonename2, number: phone1 }
    );

    const mngStudentClass = CounsellorDetail.filter((counFil) => {
      return counFil.classId._id === classSelect;
    });
  
    if(phone === '' && phone1 === ''){
      this.setState({ phoneError: "The mobile number field is required." });
      this.setState({ phone1Error: "The mobile number field is required." });
    }else if(phone1 === ''){
      this.setState({ phone1Error: "The mobile number field is required." });
    }else if(phone === ''){
      this.setState({ phoneError: "The mobile number field is required." });
    }else{
      this.setState({ phoneError: "" });
      this.setState({ phone1Error: "" });

    const formData = new FormData();
    if (
      phoneError === "" ||
      phone1Error === "" ||
      phone !== "" ||
      phone1 !== ""
    ) {
      if (mngStudentClass.length === 1) {
        const requestData = {
          name: name,
          lastName: lastname,
          fatherName: fatherName,
          DOB: moment(this.state.startDate).format(),
          street_Address: address,
          image: file,
          assignClass: classSelect,
          medical: medical,
          country: country,
        city: city,
        state: state,
        zip_code:zipcode,
          emergency: JSON.stringify(emergency),
        };

        for (var key in requestData) {
          formData.append(key, requestData[key]);
        }
        this.setState({ Submitloading: true });
        this.props.addStudent(formData, (res) => {
          if (res.status === 200) {
            this.setState({ Submitloading: false });
            toast.success("Student Added Successfully");
            setTimeout(() => {
              window.location.replace("/student");
            }, 2000);
          } else {
            this.setState({ Submitloading: false });
            toast.error("Student Added Failed");
          }
        });
      } else {
        toast.error(
          "Please add a Counsellor before adding students to the class"
        );
      }
    }
  }
  };

  handleClose = () => this.setState({ openmodel: false });
  handleOpen = () => this.setState({ openmodel: true });
  handleAddNumber = () => this.setState({ openmodelNumber: true });
  handleCloseNumber = () => this.setState({ openmodelNumber: false });
  modelEmergency = (e) => {
    this.setState({ addNumber: e });
  };

  handleCreateClass = (e) => {
    e.preventDefault();
    const { nameC } = this.state;
    if (nameC === "") {
      toast.error("Classname is required");
    } else {
      const requestData = {
        className: `class ${nameC}`,
      };
      this.setState({ AddClassloading: true });
      this.props.createClass(requestData, (res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          this.getClassData();
          this.setState({ AddClassloading: false });
          this.setState({ openmodel: false });
        } else if (res.response.data.message === "class already exists") {
          toast.error("Classname already exists");
        } else if (res.response.status === 401) {
          handleLogout();
        } else if(res.response.status === 400) {
          toast.error(res.response.data.message);
        }else {
          toast.error("Failed to created class");
        }
        this.setState({ AddClassloading: false });
      });
    }
  };

  handleAddNewNumber = (e) => {
    e.preventDefault();
    const { addName, addNumber, emergency } = this.state;

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
    if (file) {
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
          },
        },
        messages: {
          class: {
            required: "<p style='color:red'>Classname is required</P>",
          },
        },
      });
    });
    $('input[name="class"]').keyup(function (e) {
      if (/[^A-Za-z0-9-\s]/g.test(this.value)) {
        this.value = this.value.replace(/[^A-Za-z0-9-\s]/g, "");
      }
    });
  }

  HandleDate(e) {
    if(e) {
      this.setState({ startDate: e });
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
      phonename1,
      phonename2,
      medical,
      address,
      name,
      lastname,
      fatherName,
      database,
      schoolLocation,
      currentLocation,
      phone1Error,
      phoneError,
      getClassloading,
      zipcode,
      city,
      country,
      state,
      stateByCountry,
      getCountry
    } = this.state;

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
    const now = new Date();
    const currentYear = now?.getFullYear();
    const date = currentYear - 2;
    const dateendd = (moment(now).format('DD/MMM')+'/'+date)

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
                    {!this.state.AddClassloading ? (
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
                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="SAVE"
                      />
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
           {getClassloading ? <Example/>:<>
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
                      maxDate={moment(dateendd).toDate()}
                      dateFormat="dd/MM/yyyy"
                      dropdownMode="select"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

			  <div className="row">
			  <div className="form-outline mb-4 col-md-6">
                    <label htmlFor="address"> Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                      value={address}
                      onChange={(e) => this.setOnChange(e)}
                      placeholder="Please provide street address"
                    />
                  </div>
				  <div className="form-outline mb-4 col-md-6">
                        <label htmlFor="country" className="w-100">
                          Country
                        </label>
                        <FormControl
                          sx={{ m: 1, minWidth: 120 }}
                          className="filter ml-0 mb-3 w-100 select-box"
                        >
                          <select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            name="countryselect"
                            value={country}
                            label="country"
                            onChange={this.handleCountry}
                            inputProps={{ "aria-label": "Without label" }}
                            className="form-control w-100"
                          >
                          <option value="">select</option>
                            {getCountry.map((item) => {
                              return (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </FormControl>
                      </div>
			  </div>

			  <div className="row">
			  <div className="form-outline mb-4 col-md-6">
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
                      </div>
					  <div className="form-outline mb-4 col-md-6">
                        <label htmlFor="state" className="w-100">
                          State
                        </label>
                        <FormControl
                          sx={{ m: 1, minWidth: 120 }}
                          className="filter ml-0 mb-3 w-100 select-box"
                        >
                          <select
                            labelId="demo-simple-select-helper-label state"
                            id="demo-simple-select-helper state"
                            name="stateselect"
                            value={state}
                            label="state"
                            onChange={(e) =>
                              this.setState({ state: e.target.value })
                            }
                            inputProps={{ "aria-label": "Without label" }}
                            className="form-control w-100"
                          >
                          <option value="">select</option>
                            {stateByCountry.map((item) => {
                              return (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </FormControl>
                    </div>
                    
                    
			  </div>

              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                               
                  <div className="col-md-12 pl-0 pr-0 mb-4">
                    <label htmlFor="zipcode">Zipcode</label>
                    <input
                      type="number"
                      id="zipcode"
                      name="zipcode"
                      className="form-control"
                      value={zipcode}
                      onChange={(e) => this.setOnChange(e)}
                      placeholder="Please provide zipcode"
                    />
                  </div>
                  <div className="col-md-12 pl-0 pr-0">
                    <div className="form-outline mb-4">
                      <label className="w-100" htmlFor="demoselect">
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
                             const renameClassName = item.className?.slice(6);
                             const capitalFirstLetterClassName = renameClassName?.charAt(0)?.toUpperCase() + renameClassName?.slice(1);
                            return (
                              <option key={item._id} value={item._id}>
                                {capitalFirstLetterClassName}
                              </option>
                          )})}
                         
                        </select>
                      </FormControl>
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
                  <label htmlFor="emergency">Emergency Contacts</label>
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
                  <a
                    className="float-right pointer blue"
                    onClick={this.handleAddNumber}
                  >
                    Add new
                  </a>
                </div>
              </div>

		
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label className="w-100"> Photo</label>

                  <label htmlFor="photo">
                    {photo
                      ? (
                          <img
                            src={photo}
                            alt="dummy"
                            width="80px"
                            height="80px"
                          />
                        )
                      : (
                          <>
                            <div className="previewText1">
                              {" "}
                              <strong>Upload image</strong>
                            </div>
                           
                          </>
                        )}
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
              </>}
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
  getAllCountry,
  getStateBYCountryId
})(AddStudent);
