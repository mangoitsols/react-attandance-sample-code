import { Avatar, Container, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageAvatars, { handleLogout } from "./header";
import Sidebar from "./sidebar";
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { toast } from "react-toastify";
import { API, BASE_URL } from "../config/config";
import { authHeader } from "../comman/authToken";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import validate from "jquery-validation";
import Example from "../comman/loader";
import axios from "axios";
toast.configure();

const SchoolDetails = () => {
  
  const [file,setFile] = useState('')
  const [imagePreviewUrl,setImagePreviewUrl] = useState('')
  const [getCountryValue,setCountryValue] = useState([])
  const [country,setCountry] = useState('')
  const [name,setName] = useState('')
  const [data,setData] = useState('')
  const [address,setAddress] = useState('')
  const [loading,setLoading] = useState(false)
  const [updateFile,setUpdateFile] = useState('')
  const [updateCountry,setUpdateCountry] = useState('')
  const [updateName,setUpdateName] = useState('')
  const [updateAddress,setUpdateAddress] = useState('')
  
  const Manager_ID = localStorage.getItem("id");

  $(document).ready(function () {
    $("#regvalidation").validate({
      rules: {
        name: {
          required: true,
          minlength: 3,
        },
        address: {
          required: true,
        },
        country: {
          required: true,
        },
        updateName: {
          required: true,
          minlength: 3,
        },
        updateAddress: {
          required: true,
        },
        updateCountry: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "<p style='color:red'>Please provide your school name</P>",
          minlength:
            "<p style='color:red'>School name must be at least 3 characters.</p>",
        },
        address: {
          required: "<p style='color:red'>Please provide your school address</P>",
        },
        country: {
          required: "<p style='color:red'>Please select your country</P>",
        },
        updateName: {
          required: "<p style='color:red'>Please provide your school name</P>",
          minlength:
            "<p style='color:red'>School name must be at least 3 characters.</p>",
        },
        updateAddress: {
          required: "<p style='color:red'>Please provide your school address</P>",
        },
        updateCountry: {
          required: "<p style='color:red'>Please select your country</P>",
        },
      },
    });
  });

    const getCountry = async() => {
        setLoading(true);
        await axios
        .get(`${API.getAllCountry}`, { headers: authHeader() })
        .then((data) => {
        setLoading(false);
            setCountryValue(data.data.country);
        }).catch((err) => {
        setLoading(false);
          if (err.response.status === 401) {
            handleLogout()
          }
        })
    };

    const handleCountry = (e) => {
        setCountry(e.target.value);
        setUpdateCountry(e.target.value);
    }

    const _handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file.size >= 6000) {
            toast.error("Profile picture size should be less than 6kb.");
        } else {
            reader.onloadend = () => {
                    setFile(file)
                    setImagePreviewUrl(reader.result)

            };
            reader.readAsDataURL(file);
        }
      }

    const setOnChange = (e) => {

        if(e.target.name === "name"){
            setName(e.target.value)
        }else if(e.target.name === "address"){
            setAddress(e.target.value)
        }else if(e.target.name === "updateName"){
          setUpdateName(e.target.value)
      }else if(e.target.name === "updateAddress"){
        setUpdateAddress(e.target.value)
      }

        $('input[name="name"]').keyup(function (e) {
            if (/[^A-Za-z\s]/g.test(this.value)) {
                // Filter non-digits from input value.
                this.value = this.value.replace(/[^A-Za-z\s]/g, "");
            }
        });

        $('input[name="updateName"]').keyup(function (e) {
          if (/[^A-Za-z\s]/g.test(this.value)) {
              // Filter non-digits from input value.
              this.value = this.value.replace(/[^A-Za-z\s]/g, "");
          }
      });
       
      }

    const handleGetSchoolInfo = async() =>{

      setLoading(true);
      await axios
        .get(`${API.getSchoolInfo}/${Manager_ID}`, { headers: authHeader() })
        .then((res) => {
          setLoading(false);
          setUpdateFile(res.data.logo)
          setUpdateAddress(res.data.address)
          setUpdateName(res.data.name)
          setUpdateCountry(res.data.country)
          setData(res.data)
        })
        .catch((err) => {
          if (err.response.status === 401) {
            handleLogout()
          }else if(err.response.data.message === "Data not found"){
            localStorage.setItem('logoImage','')
          }
          setData('')
          setLoading(false);
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
      const formData = new FormData();

      const reqData = {
        name:name,
        address:address,
        country:country,
        managerId:Manager_ID,
        logo: file,
      }

      for (var key in reqData) {
        formData.append(key, reqData[key]);
      }

       await axios({
          method: "POST",
          url: `${API.addSchoolInfo}`,
          data: formData,
          headers: authHeader(),
      }).then((response) => {
        toast.success('School info added successfully')
        handleGetSchoolInfo()
        localStorage.setItem("logoImage", response.data.data.logo);
        localStorage.setItem("schoolLocation", response.data.data.country);
        
      }).catch((error) => {
          if (error.response.status === 401) {
              handleLogout()
            }else  if (error.response.status === 400) {
              if (error.response.data.message) {
                toast.error('Something went wrong, please try again later!')
              } 
            }else{
                toast.error('Failed to add School info')
            }
      });
    };

    const handleUpdate = async(e) => {
      e.preventDefault()

    const formData = new FormData();

    const reqData = {
      name:updateName,
      address:updateAddress,
      country:updateCountry,
      managerId:Manager_ID,
      logo: file,
    }

    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }

     await axios({
        method: "PATCH",
        url: `${API.updateSchoolInfo}/${data._id}`,
        data: formData,
        headers: authHeader(),
    }).then((response) => {
      setImagePreviewUrl('')
      toast.success('School info updated successfully')
      handleGetSchoolInfo()
      localStorage.setItem("logoImage", response.data.data.logo);
      localStorage.setItem("schoolLocation", response.data.data.country);

    }).catch((error) => {
        if (error.response.status === 401) {
            handleLogout()
          }else  if (error.response.status === 400) {
            if (error.response.data.message) {
              toast.error('Something went wrong, please try again later!')
            } 
          }else{
              toast.error('Failed to update School info')
          }
    });
  };

    useEffect(() => {
        getCountry()
        handleGetSchoolInfo()
      }, [])
      


  return (
    <>
      <Sidebar />
      <div className="col-md-8 col-lg-9 col-xl-10 mr-30">
        <div className="header">
          {" "}
          <ImageAvatars />
        </div>
        {!loading ? (data ?
         <Container
          maxWidth="100%"
          style={{ padding: "0", display: "inline-block" }}
        >
            <div className="heading">
            <h1> <MapsHomeWorkIcon/> &nbsp;Edit School Information</h1>
            </div>
          <React.Fragment>
          <form id='regvalidation' onSubmit={handleUpdate}>
                  <div className="profileBox">
                    <div className="row">
                      <div className="form-outline mb-4 col-md-6">
                        <label htmlFor="upload-button">
                          <label>School Logo</label>
                          {imagePreviewUrl
                            ? (
                                <div className="previewText">
                                  {" "}
                                  <Avatar
                                    alt={"School Logo"}
                                    src={`${imagePreviewUrl}`}
                                    sx={{ width: 80, height: 80 }}
                                  />{" "}
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px",right: "16px" }}
                                  ></i>
                                </div>
                              )
                            : (

                                <div className="previewText">
                                  {" "}
                                  <Avatar
                                    alt={"School Logo"}
                                    src={`${BASE_URL}/${updateFile}`}
                                    sx={{ width: 80, height: 80 }}
                                  />{" "}
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px", right: "16px" }}
                                  ></i>
                                </div>
                              )}
                        </label>
                        <input
                          type="file"
                          id="upload-button"
                          style={{ display: "none" }}
                          onChange={(e) => _handleImageChange(e)}
                          />
                          </div>
                     

                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="updateName">School Name</label>
                        <input
                          type="text"
                          id="updateName"
                          name="updateName"
                          className="form-control"
                          placeholder="Please provide school name"
                          value={updateName}
                          onChange={(e) => setOnChange(e)}
                        />
                      </div>
                      </div>
                      <div className="row">
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="updateAddress">School Address</label>
                        <input
                          type="text"
                          id="updateAddress"
                          name="updateAddress"
                          className="form-control"
                          placeholder="Please provide school address"
                          value={updateAddress}
                          onChange={(e) => setOnChange(e)}
                        />
                      </div>
            
                                   
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="updateCountry" className="w-100">
                        School Country
                        </label>

                        <FormControl
                    sx={{ m: 0, minWidth: 120 }}
                    className="filterbox w-100"
                  >
                    <select
                      name="updateCountry"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={updateCountry}
                      label="Filter"
                      onChange={handleCountry}
                      inputProps={{ "aria-label": "Without label" }}
                      className="form-control "
                    >
                      {getCountryValue.map((item) => {
                        return (
                          <option value={item._id}>{item.name}</option>
                        );
                      })}
                    </select>
                  </FormControl>

                      </div>
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
                </form>
          </React.Fragment>
        </Container>:
        <Container
          maxWidth="100%"
          style={{ padding: "0", display: "inline-block" }}
        >
            <div className="heading1 mb-5">
            <h1> <MapsHomeWorkIcon/> &nbsp;Add School Information</h1>
            </div>
          <React.Fragment>
          <form id='regvalidation' onSubmit={handleSubmit}>
                  <div className="profileBox">
                    <div className="row">
                      <div className="form-outline mb-4 col-md-6">
                        <label htmlFor="upload-button">
                          <label>School Logo</label>
                          {imagePreviewUrl
                            ? (
                                <div className="previewText">
                                  {" "}
                                  <Avatar
                                    alt={"School Logo"}
                                    src={imagePreviewUrl}
                                    sx={{ width: 80, height: 80 }}
                                  />{" "}
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px" }}
                                  ></i>
                                </div>
                              )
                            : (
                                <div className="previewText">
                                  {" "}
                                  <Avatar
                                    alt={"School Logo"}
                                    src={`${BASE_URL}/${"image"}`}
                                    sx={{ width: 80, height: 80 }}
                                  />{" "}
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px", right: "16px" }}
                                  ></i>
                                </div>
                              )}
                        </label>
                        <input
                          type="file"
                          id="upload-button"
                          style={{ display: "none" }}
                          onChange={(e) => _handleImageChange(e)}
                          />
                          </div>
                     

                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="name">School Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          placeholder="Please provide school name"
                          value={name}
                          onChange={(e) => setOnChange(e)}
                        />
                      </div>
                      </div>
                      <div className="row">
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="address">School Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className="form-control"
                          placeholder="Please provide school address"
                          value={address}
                          onChange={(e) => setOnChange(e)}
                        />
                      </div>
            
                                   
                      <div className="form-outline mb-4 col-md-6 addressProfileFields">
                        <label htmlFor="country" className="w-100">
                        School Country
                        </label>

                        <FormControl
                    sx={{ m: 0, minWidth: 120 }}
                    className="filterbox w-100"
                  >
                    <select
                      name="country"
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={country}
                      label="Filter"
                      onChange={handleCountry}
                      inputProps={{ "aria-label": "Without label" }}
                      className="form-control "
                    >
                      <option value="" disabled>select</option>
                      {getCountryValue.map((item) => {
                        return (
                          <option value={item.name}>{item.name}</option>
                        );
                      })}
                    </select>
                  </FormControl>

                      </div>
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
                        value="SAVE"
                      />
                    </div>
                </form>
          </React.Fragment>
        </Container>):<Example/>}
      </div>
    </>
  );
};

export default SchoolDetails;
