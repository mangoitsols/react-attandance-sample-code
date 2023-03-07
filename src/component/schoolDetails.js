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
  const [updateCity,setUpdateCity] = useState('')
  const [updateState,setUpdateState] = useState('')
  const [updateZipcode,setUpdateZipcode] = useState('')
  const [updateAddress,setUpdateAddress] = useState('')
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [stateByCountry, setStateByCountry] = useState([]);
  
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
        city: { 
          required: true ,
          minlength: 3
        },
        state: { 
          required: true,
        },
        zipcode:{
          required: true,
          minlength:5,
			    maxlength:5,
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
        updateState: { 
          required: true
        },
        updateCity: { 
          required: true ,
          minlength: 3
        },
        updateZipcode:{
          required: true,
          minlength:5,
			    maxlength:5,
        }        
      },
      messages: {
        name: {
          required: "<p style='color:red'>Please provide your school name</p>",
          minlength:
            "<p style='color:red'>School name must be at least 3 characters.</p>",
        },
        address: {
          required: "<p style='color:red'>Please provide your school address</p>",
        },
        country: {
          required: "<p style='color:red'>Please select your country</p>",
        },
        state: {
          required:"<p style='color:red'>Please select your state</p>",
        },
        city:{
            required: "<p style='color:red'>Please provide your city</p>",
            minlength: "<p style='color:red'>City name must consist of at least 3 characters</p>",
        },
        zipcode: {
          required: "<p style='color:red'>Please provide your zipcode</p>",
          minlength: "<p style='color:red'>zipcode must consist of at least 5 characters</p>",
			    maxlength: "<p style='color:red'>zipcode must consist of at least 5 characters</p>",
        },
        updateName: {
          required: "<p style='color:red'>Please provide your school name</p>",
          minlength:
            "<p style='color:red'>School name must be at least 3 characters.</p>",
        },
        updateAddress: {
          required: "<p style='color:red'>Please provide your school address</p>",
        },
        updateCountry: {
          required: "<p style='color:red'>Please select your country</p>",
        },
        updateState: {
          required:"<p style='color:red'> Please select your state </p>",
        },
        updateCity:{
          required: "<p style='color:red'>Please provide your city</p>",
          minlength: "<p style='color:red'>City name must consist of at least 3 characters</p>",
        },
        updateZipcode:{
          required: "<p style='color:red'>zipcode is required</p>",
          minlength: "<p style='color:red'>zipcode must consist of at least 5 characters</p>",
			    maxlength: "<p style='color:red'>zipcode must consist of at least 5 characters</p>",
        }
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
        const id = e.target.value;
      if(id){
      handleState(id)}
    }
  
    const handleState = async(id) => {
    await axios.get(`${API.getStateBYCountryId}/${id}`, { headers: authHeader() }).then((res) => {
        setStateByCountry(res.data);
      });
    };

    const _handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onloadend = () => {
                    setFile(file)
                    setImagePreviewUrl(reader.result)
            };
            reader.readAsDataURL(file);
        }
      }

    const setOnChange = (e) => {
console.log(e.target.name,"55555555555555555")
        if(e.target.name === "name"){
            setName(e.target.value)
        }else if(e.target.name === "address"){
            setAddress(e.target.value)
        }else if(e.target.name === "city"){
          setCity(e.target.value)
      }else if(e.target.name === "zipcode"){
        setZipcode(e.target.value)
    }else if(e.target.name === "updateName"){
          setUpdateName(e.target.value)
      }else if(e.target.name === "updateAddress"){
        setUpdateAddress(e.target.value)
      }else if(e.target.name === "updateCity"){
        setUpdateCity(e.target.value)
    }else if(e.target.name === "updateZipcode"){
      setUpdateZipcode(e.target.value)
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

      $('input[name="city"]').keyup(function (e) {
        if (/[^a-zA-Z]/g.test(this.value)) {
          this.value = this.value.replace(/[^a-zA-Z]/g, "");
        }
      });
    
      $('input[name="updateCity"]').keyup(function (e) {
        if (/[^a-zA-Z]/g.test(this.value)) {
          this.value = this.value.replace(/[^a-zA-Z]/g, "");
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
          setUpdateState(res.data.state)
          setUpdateCity(res.data.city)
          setUpdateZipcode(res.data.zip_code)
          handleState(res.data.country)
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
        state:state,
        zip_code:zipcode,
        city:city,
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
      state:updateState,
      zip_code:updateZipcode,
      city:updateCity,
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
                          <option key={item._id} value={item._id}>{item.name}</option>
                        );
                      })}
                    </select>
                  </FormControl>

                      </div>
                      </div>
                      <div className="row">
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="updateCity">School City</label>
                        <input
                          type="text"
                          id="updateCity"
                          name="updateCity"
                          className="form-control"
                          placeholder="Please provide school city"
                          value={updateCity}
                          onChange={(e) => setOnChange(e)}
                        />
                      </div>
                      
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="updateState" className="w-100">
                        School State
                        </label>
                        <FormControl
                    sx={{ m: 0, minWidth: 120 }}
                    className="filterbox w-100"
                    >
                    <select
                      name="updateState"
                      labelId="demo-simple-select-helper-label state"
                      id="demo-simple-select-helper state"
                      value={updateState}
                      label="updateState"
                      onChange={(e) => setUpdateState(e.target.value)}
                      inputProps={{ "aria-label": "Without label" }}
                      className="form-control"
                      >
                      <option value="" disabled>select</option>
                      {stateByCountry.map((item) => {
                        return (
                          <option key={item._id} value={item._id}>{item.name}</option>
                        );
                      })}
                    </select>
                  </FormControl>

                      </div>
                      </div>
                    <div className="row">
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="zipcode">School Area Zipcode</label>
                        <input
                          type="text"
                          id="zipcode"
                          name="zipcode"
                          className="form-control"
                          placeholder="Please provide school area zipcode"
                          value={updateZipcode}
                          onChange={(e) => setOnChange(e)}
                        />
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
                                  <img
                                    alt={"School Logo"}
                                    src={imagePreviewUrl}
                                    style={{ width: 80, height: 40 }}
                                    />{" "}
                                    <i
                                      className="fa fa-camera"
                                      style={{ fontSize: "35px" }}
                                    ></i>
                                </div>
                              )
                            : (
                                
                                  <div className="previewText1">
                              {" "}
                              <strong>Upload image</strong>
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
                      labelId="demo-simple-select-helper-label country"
                      id="demo-simple-select-helper country"
                      value={country}
                      label="Filter"
                      onChange={handleCountry}
                      inputProps={{ "aria-label": "Without label" }}
                      className="form-control "
                    >
                      <option value="" disabled>select</option>
                      {getCountryValue.map((item) => {
                        return (
                          <option key={item._id} value={item._id}>{item.name}</option>
                        );
                      })}
                    </select>
                  </FormControl>

                      </div>
                      </div>
                      <div className="row">
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="city">School City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="form-control"
                          placeholder="Please provide school city"
                          value={city}
                          onChange={(e) => setOnChange(e)}
                        />
                      </div>
                      
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="state" className="w-100">
                        School State
                        </label>

                        <FormControl
                    sx={{ m: 0, minWidth: 120 }}
                    className="filterbox w-100"
                  >
                    <select
                      name="state"
                      labelId="demo-simple-select-helper-label state"
                      id="demo-simple-select-helper state"
                      value={state}
                      label="state"
                      onChange={(e) => setState(e.target.value)}
                      inputProps={{ "aria-label": "Without label" }}
                      className="form-control"
                    >
                      <option value="" disabled>select</option>
                      {stateByCountry.map((item) => {
                        return (
                          <option key={item._id} value={item._id}>{item.name}</option>
                        );
                      })}
                    </select>
                  </FormControl>

                      </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-outline mb-4 col-md-6 profileName">
                        <label htmlFor="zipcode">School Area Zipcode</label>
                        <input
                          type="text"
                          id="zipcode"
                          name="zipcode"
                          className="form-control"
                          placeholder="Please provide school area zipcode"
                          value={zipcode}
                          onChange={(e) => setOnChange(e)}
                        />
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
