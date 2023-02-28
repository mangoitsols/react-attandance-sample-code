import React, { useState, useEffect } from "react";
import ImageAvatars, { handleLogout } from "./header";
import $ from "jquery";
import validate from "jquery-validation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "./sidebar";
import {
  Fade,
  Modal,
  Backdrop,
  Box,
  FormControl,
  MenuItem,
  Select,
  Container,
  Checkbox,
  TextField,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InputField from "../comman/inputField";
import { API, BASE_URL } from "../config/config";
import Loader from "../comman/loader";
import axios from "axios";
import { authHeader } from "../comman/authToken";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

toast.configure();

const EditStudent = () => {
  const [openmodel, setOpenmodel] = useState(false);
  const [openmodelNumber, setOpenModelNumber] = useState(false);
  const [classSelect, setClassSelect] = useState("");
  const [getclasses, setGetClasses] = useState([]);
  const [photo, setPhoto] = useState("");
  const [image, setImage] = useState("");
  const [phonename1, setPhoneName1] = useState("");
  const [medical, setMedical] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState();
  const [lastname, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [dateError, setDateError] = useState("");
  const [database, setDatabase] = useState([]);
  const [nameC, setNameC] = useState("");
  const [file, setFile] = useState("");
  const [emergency, setEmergency] = useState([]);
  const [addName, setAddName] = useState("");
  const [addNumber, setAddNumber] = useState("");
  const [checked, setChecked] = useState(false);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);

  const schoolLocation = localStorage.getItem("schoolLocation");
  const currentLocation = localStorage.getItem("currentLocation");

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

  const { id } = useParams();

  const dd = useSelector((state) => state);

  $(document).ready(function () {
    $("#editval").validate({
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
        address: {
          required: true,
        },
        dob: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "<p style='color:red'>Please enter your first name</P>",
          minlength:
            "<p style='color:red'>Your first name must consist of at least 3 characters</p>",
        },
        lastname: {
          required: "<p style='color:red'>Please enter your last name</P>",
          minlength:
            "<p style='color:red'>Your last name must consist of at least 3 characters</p>",
        },
        fatherName: {
          required: "<p style='color:red'>Please enter your father name</P>",
          minlength:
            "<p style='color:red'>Your father name must consist of at least 3 characters</p>",
        },
        address: {
          required: "<p style='color:red'>Please enter your address</P>",
        },

        dob: {
          required: "<p style='color:red'>Please provide a Date Of Birth</p>",
        },
      },
    });
  });
  useEffect(() => {
    getClassData();
    getStudentDataById();
  }, []);

  let $imagePreview = null;

  const content =
    checked === true
      ? "display form-outline mb-4 col-md-12 medicaltextarea"
      : "no-display form-outline mb-4 col-md-12 medicaltextarea";

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const _handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    if (file.size >= 6000) {
      toast.error("Student image must be less than 6kb");
    } else {
      reader.onloadend = () => {
        setFile(file);
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStudentDataById = async () => {
    const response = await axios
      .get(`${API.getStudent}/${id}`, { headers: authHeader() })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
    if (response.status === 200) {
      setLoading(false);
      setItem(response.data);
      setName(response.data[0].name);
      setLastName(response.data[0].lastName);
      setFatherName(response.data[0].fatherName);
      setDob(response.data[0].DOB);
      setAddress(response.data[0].address);
      setImage(response.data[0].image);
      setClassSelect(response.data[0].assignClass);
      setMedical(response.data[0].medical);
      const result = response.data[0].emergency.map(({ _id, ...rest }) => ({
        ...rest,
      }));
      setEmergency(result);
    } else {
      setLoading(true);
    }
  };
  const addFillName = (e) => {
    $('input[name="name"]').keyup(function (e) {
      if (/[^a-zA-Z]/g.test(this.value)) {
        this.value = this.value.replace(/[^a-zA-Z]/g, "");
      }
    });
    $('input[name="mobile"]').keyup(function (e) {
      if (/\D/g.test(this.value)) {
        this.value = this.value.replace(/\D/g, "");
      }
    });
    $(document).ready(function () {
      $("#numvalid").validate({
        rules: {
          name: {
            required: true,
            minlength: 3,
          },
          mobile: { required: true, minlength: 10, maxlength: 10 },
        },
        messages: {
          name: {
            required: "<p style='color:red'>The name field is required</p>",
            minlength:
              "<p style='color:red'>Your first name must consist of at least 3 characters</p>",
          },
          mobile: {
            required: "<p style='color:red'> Mobile number is required</p>",
            minlength:
              "<p style='color:red'>Mobile number must be 10 digit</p>",
            maxlength:
              "<p style='color:red'>Mobile number must be 10 digit</p>",
          },
        },
      });
    });
    setAddName(e.target.value);
  };

  const handleAddNewNumber = (e) => {
    e.preventDefault();

    if (addName === "" || addNumber === "") {
      toast.error("All field are required");
    } else {
      emergency.push({
        Ename: addName,
        number: addNumber,
      });
      setDatabase(emergency);
      if (emergency.length !== 0) {
        setOpenModelNumber(false);
        toast.success("Number added successfully");
      } else {
        toast.error("Number added failed");
      }
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();

    if (!nameC.startsWith("class")) {
      toast.error("classname must start with class ex: 'class A'");
    } else {
      const requestData = {
        className: nameC,
      };
      const res = await axios
        .post(`${API.createClass}`, requestData)
        .catch((err) => {
          if (err.response.status === 401) {
            handleLogout();
          }
        });
      if (res.status === 200) {
        toast.success(res.data.message);
        setOpenmodel(false);
        setClassSelect(res);
      } else if (res.status === 400) {
        toast.error(res.data.message);
      }
    }
  };

  const handleClose = () => {
    setOpenmodel(false);
  };
  const handleOpen = () => setOpenmodel(true);
  const handleAddNumber = () => setOpenModelNumber(true);
  const handleCloseNumber = () => {
    setOpenModelNumber(false);
    setAddName("");
    setAddNumber("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (file.size >= 6000) {
      toast.error("Student image must be less than 6kb");
    } else {
      const requestData = {
        name: name,
        lastName: lastname,
        fatherName: fatherName,
        DOB: dob,
        address: address,
        image: file,
        assignClass: classSelect,
        medical: medical,
        emergency: JSON.stringify(emergency),
      };
      for (var key in requestData) {
        formData.append(key, requestData[key]);
      }
      const request = await axios({
        method: "put",
        url: `${API.studentUpdate}/${id}`,
        data: formData,
        headers: authHeader(),
      }).catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
      if (request.status === 200) {
        toast.success("Student Updated Successfully");
        setTimeout(() => {
          window.location.replace("/student");
        }, 3000);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const getClassData = () => {
    fetch(`${API.getClass}`)
      .then((res) => res.json())
      .then((ress) => {
        setGetClasses(ress.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const handleChange = (event) => {
    let checkedbox = event.target.checked;
    setChecked(checkedbox);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
  };

  const handleDate = (e) => {
    var now = new Date();
    var a = now.getFullYear();
    var yyyy = e.getFullYear();

    var date = a - 2;
    if (yyyy > date) {
      setDateError("Student age must be greater than 2 year");
    } else {
      setDob(e);
      setDateError("");
    }
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
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openmodel}>
            <Box sx={style}>
              <form className="mui-form" onSubmit={handleCreateClass}>
                <legend>Add Class</legend>
                <div className="mui-textfield">
                  <input
                    type="text"
                    placeholder="class E"
                    value={nameC}
                    onChange={(e) => setNameC(e.target.value)}
                  />
                </div>
                <div className="btndesign text-right">
                  <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={handleClose}
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
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openmodelNumber}
          onClose={handleCloseNumber}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openmodelNumber}>
            <Box sx={style}>
              <form
                id="numvalid"
                className="mui-form"
                onSubmit={handleAddNewNumber}
              >
                <legend>Add New Number</legend>
                <div className="mui-textfield">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Please enter your number"
                    onChange={(e) => addFillName(e)}

                    // onChange={(e) => setAddName(e.target.value)}
                  />
                  {/* <input
                    type="tel"
                    placeholder="Please enter your number"
                    id="mobile"
                    name="mobile"
                    onChange={(e) => setAddNumber(e.target.value)}
                  /> */}

                  <PhoneInput
                    country={`${
                      schoolLocation && schoolLocation.toLowerCase() === "usa"
                        ? "us"
                        : currentLocation.toLowerCase()
                    }`}
                    placeholder="Please enter your number"
                    enaableAreaCodes
                    value={`${addNumber}`}
                    countryCodeEditable={false}
                    onChange={(phone) => setAddNumber(phone)}
                    enableAreaCodes
                    enableSearch="true"
                    inputProps={{
                      name: "morbile",
                      // required: true,
                      // autoFocus: true,
                      copyNumbersOnly: true,
                    }}
                  />
                </div>
                <div className="btndesign text-right">
                  <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={handleCloseNumber}
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
            <h1>Edit Student</h1>
          </div>
          {!loading ? (
            <>
              <form id="editval" onSubmit={handleSubmit}>
                {item.map((val) => {
                  return (
                    <React.Fragment key={val._id}>
                      <div className="row">
                        <div className="form-outline mb-4 col-md-6">
                          <InputField
                            label="First Name"
                            placeholder="Please enter your name"
                            value={name}
                            htmlFor="name"
                            id="name"
                            name="name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="form-outline mb-4 col-md-6 ">
                          <InputField
                            label="Last Name"
                            id="lastname"
                            htmlFor="lastname"
                            name="lastname"
                            className="form-control"
                            placeholder="Please enter your last name"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-outline mb-4 col-md-6">
                          <InputField
                            htmlFor="fatherName"
                            label="Father Name"
                            id="fatherName"
                            name="fatherName"
                            className="form-control"
                            placeholder="Please enter your father name"
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                          />
                        </div>
                        <div className="form-outline mb-4 col-md-6">
                          <label htmlFor="dob">Date of Birth</label>

                          <DatePicker
                            placeholderText="Please select date of birth"
                            name="dob"
                            dateFormat="dd/MM/yyyy"
                            selected={new Date(dob)}
                            onChange={(date) => handleDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                         />
                          <p style={{ color: "red", fontSize: "12px" }}>
                            {dateError}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-outline mb-4 col-md-6">
                          <div className="col-md-12 pl-0 pr-0 mb-4">
                            <InputField
                              htmlFor="address"
                              label="Address"
                              id="address"
                              name="address"
                              className="form-control"
                              placeholder="Please enter your address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                          <div className="col-md-12 pl-0 pr-0">
                            <div className="form-outline mb-4">
                              <label className="w-100" htmlFor="assign">
                                Assign
                              </label>
                              <FormControl
                                sx={{ m: 1, minWidth: 120 }}
                                className="filter ml-0 mb-3 w-100 select-box"
                              >
                                <Select
                                  labelId="demo-simple-select-helper-label"
                                  id="demo-simple-select-helper"
                                  value={classSelect ? classSelect : ""}
                                  label="Filter"
                                  onChange={(e) =>
                                    setClassSelect(e.target.value)
                                  }
                                  inputProps={{ "aria-label": "Without label" }}
                                  className="w-100"
                                >
                                  {getclasses.map((item) => {
                                    return (
                                      <MenuItem key={item._id} value={item._id}>
                                        {item.className}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                              <a
                                className="float-right pointer blue"
                                onClick={handleOpen}
                              >
                                Add new class
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="form-outline mb-4 col-md-6">
                          <label htmlFor="emergency">Emergency</label>
                          {emergency.map((i) => {
                            return (
                              <>
                                <div className="phoneNo" key={i._id}>
                                  <InputField
                                    id="phonename1"
                                    name="phonename1"
                                    disabled={true}
                                    className="form-control mb-3 col-md-4 mr-2 "
                                    value={i.Ename}
                                    onChange={(e) =>
                                      setClassSelect(e.target.value)
                                    }
                                  />

                                  <PhoneInput
                                    country={`${
                                      schoolLocation &&
                                      schoolLocation.toLowerCase() === "usa"
                                        ? "us"
                                        : currentLocation.toLowerCase()
                                    }`}
                                    value={`${i.number}`}
                                    disabled
                                  />
                                </div>
                              </>
                            );
                          })}

                          <a
                            className="float-right pointer blue"
                            onClick={handleAddNumber}
                          >
                            Add new
                          </a>
                        </div>
                      </div>

                      <div className="form-outline mb-4 col-md-6">
                        {photo ? "" : <label className="w-100"> Photo</label>}
                        <label htmlFor="photo">
                          {photo
                            ? ($imagePreview = (
                                <div>
                                  <Avatar
                                    alt={name}
                                    src={photo}
                                    style={{ width: "100px", height: "100px" }}
                                  />
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px" }}
                                  ></i>
                                </div>
                              ))
                            : image && image.match("uploads/")
                            ? ($imagePreview = (
                                <div className="previewText">
                                  <Avatar
                                    src={`${BASE_URL}/${image}`}
                                    alt={name}
                                    style={{ width: "100px", height: "100px" }}
                                  />
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px" }}
                                  ></i>
                                </div>
                              ))
                            : image && image.match("http")
                            ? ($imagePreview = (
                                <div className="previewText">
                                  <Avatar
                                    alt="Remy Sharp"
                                    src={image}
                                    sx={{ width: 56, height: 56 }}
                                  />

                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px" }}
                                  ></i>
                                </div>
                              ))
                            : ($imagePreview = (
                                <div className="previewText">
                                  <Avatar
                                    alt="Remy Sharp"
                                    src={photo}
                                    sx={{ width: 56, height: 56 }}
                                  />
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px" }}
                                  ></i>
                                </div>
                              ))}
                        </label>
                        {
                          <p style={{ fontSize: "13px" }}>
                            Student image must be less than 6kb
                          </p>
                        }
                        <InputField
                          type="file"
                          id="photo"
                          name="photo"
                          className="form-control"
                          style={{ display: "none" }}
                          onChange={(e) => _handleImageChange(e)}
                        />
                      </div>

                      <div className="row">
                        <div className="form-outline mb-4 col-md-6 medicalCheckbox">
                          <Checkbox
                            className="checkbox"
                            id="medicalcheck"
                            onChange={handleChange}
                            checked={checked}
                          />

                          <label
                            htmlFor="medicalCheckbox"
                            className="medicalLabel"
                          >
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
                              placeholder={val.medical}
                              onChange={(e) => setMedical(e.target.value)}
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
                        <InputField
                          type="submit"
                          className="btn btn-primary btn-block mb-4"
                          value="UPDATE"
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
              </form>
            </>
          ) : (
            <Loader />
          )}
        </Container>
      </div>
    </>
  );
};

export default EditStudent;
