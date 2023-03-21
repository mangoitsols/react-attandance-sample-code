import React, { Component } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import { connect } from "react-redux";
import Cropper from 'react-easy-crop'
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
  Fade,
  Modal,
  Backdrop,
  Box,
  Typography,
  Slider,
  Button,
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
import getCroppedImg from "../comman/cropImage";

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
    croppedFile:"",
    getUserDetail: [],
    userDetail: "",
    loading: "true",
    numberValid: true,
    cancel: false,
    profileName: "",
    zip_code: "",
    schoolLocation: localStorage.getItem("schoolLocation"),
    currentLocation: localStorage.getItem("currentLocation"),
	  mobileNumberError:'',
    croppedAreaPixels:null,
    croppedImage:null,
    zoom:1,
    rotation:0,
    crop:{ x: 0, y: 0 },
    openmodel:false,
  };

  componentDidMount() {
    this.props.getAllCountry((res) => {
      if (res.status === 200) {
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
      zip_code,
	  mobileNumberError,
    croppedFile
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
        zip_code: zip_code,
        image: croppedFile === "" ? image : croppedFile,
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
    if (file) {
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
        });
        this.handleClose()
        localStorage.setItem("image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // ******* CROP IMAGE FUNCTIONS START ****************

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({croppedAreaPixels})
  }

  showCroppedImage = async () => {

    const {imagePreviewUrl,croppedAreaPixels,rotation,file} = this.state;
    try {
      const croppedImage = await getCroppedImg(
        imagePreviewUrl,
        croppedAreaPixels,
        rotation
      )

      const croppedImageData = { croppedImage }
      let myFile = await fetch(croppedImageData.croppedImage)
      .then(r => r.blob())
      .then(blobFile => new File([blobFile], file.name, { type: file.type })).catch(error => console.log(error))

      this.setState({croppedImage,croppedFile:myFile})
      this.handleClose()
    } catch (e) {
      console.error(e)
    }
  }

  handleClose = () => this.setState({ openmodel: !this.state.openmodel });

  setZoom = (zoom) => {
    this.setState({zoom})
  }

  setCrop = (crop) => {
    this.setState({crop})
  }

  setRotation = (rotation) => {
    this.setState({rotation})
  }

  // ******* CROP IMAGE FUNCTIONS END ****************

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
        this.setState({ image: res.data.data[0].image });
        this.setState({ state: res.data.data[0].state });
        this.setState({ country: res.data.data[0].country });
        this.setState({ zip_code: res.data.data[0].zip_code });
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
      currentLocation,
      schoolLocation,
      zip_code,
      mobileNumberError,
      crop,
      zoom,
      rotation,
      openmodel,
      croppedImage
    } = this.state;

    const capitalizeFirstLetterofName =
      name.charAt(0).toUpperCase() + name.slice(1);

    // Crop image styles start

    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      borderRadius: "15px",
      p: 4,
      height:'550px',
      width: "550px",
    };
  
    const cropperStyle ={
      cropperContainerStyle :{  maxHeight: '300px',  height: '100%',  top: '16%',  left: '32px',  right: '32px' },
      cropperButtonStyle :{ marginTop:'342px',  textAlign:'center'  },
      zoomButtonDiv :{width: '42%', display: 'inline-flex'},
      zoomSpan :{marginRight: '15px'},
      rotationButtonDiv :{width: "48%", display: 'inline-flex'},
      rotationSpan :{margin: '0px 15px 0px 10px'},
  
    } 
  
    // crop image styles end

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
                          
                             My Profile
                        </h1>
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
                <div> <legend style={{fontSize:'25px'}}>Crop your image</legend> </div>
                  <Cropper
                    image={imagePreviewUrl}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={this.setCrop}
                    onRotationChange={this.setRotation}
                    onCropComplete={this.onCropComplete}
                    onZoomChange={this.setZoom}
                    cropShape={'round'}
                    cropSize={ {width: 200, height: 200} }
                    style = {{containerStyle: cropperStyle.cropperContainerStyle}}
                  />
                  <div style={cropperStyle.cropperButtonStyle}  >
                  <div style={{marginBottom:'20px'}}>
                    <div style={cropperStyle.zoomButtonDiv}>
                      <span style={cropperStyle.zoomSpan}>Zoom</span>
                    <Slider
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e, zoom) => this.setZoom(zoom)}
                    />
                  </div>
                  <div style={cropperStyle.rotationButtonDiv}>
                      <span style={cropperStyle.rotationSpan}>Rotation</span>
                    <Slider
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      aria-labelledby="Rotation"
                      onChange={(e, rotation) => this.setRotation(rotation)}
                    />
                  </div>
                  </div>
                  <div className="cancel-submit-btn">
                  <Button
                  onClick={this.handleClose}
                    variant="contained"
                    color="grey"
                    sx={{marginRight:'25px'}}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.showCroppedImage}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                  </div>
                  </div>
              </Box>
            </Fade>
          </Modal>
                <form onSubmit={this.handleSubmit}>

                  <div className="profileBox">
                    <div className="row">
                      <div className="form-outline mb-4 col-md-6">
                        <label htmlFor="upload-button">
                          <label>Profile Image</label>
                          {imagePreviewUrl
                            ? 
                                <div className="previewText">
                                  {" "}
                                  <Avatar
                                    alt={capitalizeFirstLetterofName}
                                    src={croppedImage? croppedImage : `${BASE_URL}/${image}`}
                                    sx={{ width: 56, height: 56 }}
                                  />{" "}
                                  <i
                                    className="fa fa-camera"
                                    style={{ fontSize: "35px", right: "44px" }}
                                  ></i>
                                </div>
                             
                            : 
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
                             }
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
                          "required|min:7"
                        )}
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
                        <label htmlFor="zip_code" className="w-100">
                          Zip Code
                        </label>
                        <input
                          type="number"
                          id="zip_code"
                          name="zip_code"
                          className="form-control"
                          placeholder="Please enter your zipcode"
                          value={zip_code}
                          onChange={(e) => this.setOnChange(e)}
                        />
                        {this.validator.message("zip_code",zip_code.toString(),"required|min:5|max:5")}
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
