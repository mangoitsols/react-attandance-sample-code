import React, { Component } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import { Container } from "@mui/material";
import { createPin, updatePin } from "../action/auth";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import PinInput from "react-pin-input";
import { toast } from "react-toastify";
import pin from "../images/pin.svg";
import Loader from "../comman/loader1";
import "react-toastify/dist/ReactToastify.css";
import LoaderButton from "../comman/loader1";
import { authHeader } from "../comman/authToken";
import axios from "axios";
toast.configure();

class CreatePin extends Component {
 
    state = {
      pint: "",
      pintt: "",
      old: "",
      loading: false,
      forgotPinPage : false,
      createNewPin:'',
      createConfirmPin:'',
    };
 

  handleSubmit = (e) => {
    e.preventDefault();
    const { pint, pintt, old } = this.state;
    if (pint === "" || pintt === "" || old === "") {
      toast.error("You should fill out the Pins");
    } else if (pint === pintt) {
      const requestData = {
        oldPin: old,
        newPin: pint,
        confirmPin: pintt,
      };
      this.setState({ loading: true });
      this.props.updatePin(requestData, localStorage.getItem("id"), (res) => {
        if (res.status === 200) {
          this.setState({ loading: false });
          toast.success("Pin is updated successfully");
          setTimeout(() => {
            window.location.replace("/createPin");
          }, 500);
        }else{
          this.setState({ loading: false });
        }
      });
    } else if (pint !== pintt) {
      this.setState({ loading: false });
      toast.error("New Pin and Confirm Pin should match");
    }
  };

  forgetPin = () =>{
    const {forgotPinPage} = this.state;
    this.setState({forgotPinPage:!forgotPinPage});
  }

  handleCreate = async(e) => {
    e.preventDefault();
    const { createNewPin,createConfirmPin,forgotPinPage } = this.state;
    if (createNewPin === "" || createConfirmPin === "" ) {
      toast.error("Both pins are required");
    } else if (createNewPin === createConfirmPin) {
      const requestData = {
        newPin: createNewPin,
      };
      this.setState({ loading: true });
      await axios({
        method: "put",
        // url: `${API.studentStatusUpdate}/${dismissStudentDetails._id}`,
        data: requestData,
        headers: authHeader(),
        }).then((request) => {
          toast.success("Pin reset successfully");
          this.setState({forgotPinPage:!forgotPinPage});
          this.setState({ loading: false });
        }).catch((err) => {
          this.setState({ loading: false });
          toast.error("Failed to reset the pin");
        })
    }else if (createNewPin !== createConfirmPin) {
      this.setState({ loading: false });
      toast.error("Both pins should match");
    }
  }

  render() {
    const {forgotPinPage} = this.state;

    return (
      <>
        <Sidebar />
        <div className="col-md-8 col-lg-9 col-xl-10 mr-30 ">
          <div className="header">
            {" "}
            <ImageAvatars />
          </div>

          <Container
            maxWidth="100%"
            style={{ padding: "0", display: "inline-block" }}
          >
            <div className="heading1">
              <h1>
                <span className="counsellor-logo">
                  {" "}
                  <img src={pin} className="" alt="logo" />
                </span>
                Manage Pin for Medical Information
              </h1>
            </div>
            {forgotPinPage ?
             <form id="myform" onSubmit={this.handleCreate}>
              <div className="pinbox mt-4">
                <div className="form-outline mb-4" name="rrr">
                  <label for="createPin">New Pin</label>
                  <div className="createPin">
                    <div>
                      <PinInput
                        length={4}
                        initialValue=""
                        type="password"
                        inputMode="number"
                        placeholder="0"
                        style={{ padding: "10px" }}      
                        onComplete={(value, index) => {
                          this.setState({ createNewPin: value });
                        }}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-outline mb-4">
                  <label for="confirmPin">Confirm Pin</label>
                  <div className="confirmPin">
                    <div>
                      <PinInput
                        length={4}
                        initialValue=""
                        placeholder="0"
                        type="password"
                        inputMode="number"
                        style={{ padding: "10px" }}
                        onComplete={(value, index) => {
                          this.setState({ createConfirmPin: value });
                        }}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                      />
                    </div>
                  </div>
                </div>

                 <div className="text-right pinSave" >
                  <button type="button" className="btn btn-transparent btn-block mb-4" onClick={() => {this.setState({forgotPinPage:!forgotPinPage})}}>CANCEL</button>
                {!this.state.loading ? (
                 <input
                    type="submit"
                    className="btn btn-primary btn-block mb-4 mr-0"
                    value="RESET"
                    
                  /> ):( <><button type="button" class="btn btn-secondary" disabled >RESET</button><LoaderButton /></>  )}
                </div>
              </div>
            </form> : 
            <form id="myform" onSubmit={this.handleSubmit}>
              <div className="pinbox mt-4">
                <div className="form-outline mb-4" name="rrr">
                  <label for="createPin">Old pin</label>
                  <div className="createPin">
                    <div>
                      <PinInput
                        length={4}
                        initialValue=""
                        type="password"
                        inputMode="number"
                        style={{ padding: "10px" }}
                        onComplete={(value, index) => {
                          this.setState({ old: value });
                        }}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-outline mb-4" name="rrr">
                  <label for="createPin">New Pin</label>
                  <div className="createPin">
                    <div>
                      <PinInput
                        length={4}
                        initialValue=""
                        type="password"
                        inputMode="number"
                        placeholder="0"
                        style={{ padding: "10px" }}      
                        onComplete={(value, index) => {
                          this.setState({ pintt: value });
                        }}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                      />
                    </div>
                  </div>
                </div>
                
                   

                <div className="form-outline mb-4">
                  <label for="confirmPin">Confirm Pin</label>
                  <div className="confirmPin">
                    <div>
                      <PinInput
                        length={4}
                        initialValue=""
                        placeholder="0"
                        // secret
                        // onChange={ (value, index) => {this.setState({ pint: value })}}
                        type="password"
                        inputMode="number"
                        style={{ padding: "10px" }}
                        // inputStyle={{borderColor: 'red'}}
                        // inputFocusStyle={{borderColor: 'blue'}}
                        onComplete={(value, index) => {
                          this.setState({ pint: value });
                        }}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                      />
                    </div>
                  </div>
                <div onClick={() => this.forgetPin()} style={{float:'right',margin:'10px 0 0 0',color:'#007bff',cursor:'pointer'}}>Forgot pin</div>
                </div>

                {!this.state.loading ? (
                 <div className="text-right pinSave"  style={{marginTop:'45px'}}>
                 <input
                    type="submit"
                    className="btn btn-primary btn-block mb-4 mr-0"
                    value="UPDATE"
                    
                  /> 
                </div>)  : (
                    <><button type="button" class="btn btn-secondary" disabled style={{marginTop:'45px'}}>UPDATE</button><LoaderButton /></>
                )}
              </div>
            </form>}
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
  createPin,
  updatePin,
})(CreatePin);
