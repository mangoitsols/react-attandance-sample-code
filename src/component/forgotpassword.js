import React, { Component } from 'react';
import logo from '../images/logo-2.png';
import TextField from '@material-ui/core/TextField';
import {sendMail} from "../action/auth";
import { connect } from "react-redux";
import './css/login.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
toast.configure();
class ForgotPassword extends Component {

    state = {
        email:"",
    }

    validate = () => {
        let emailError = "";
    
        if (!this.state.email.includes("@")) {
          emailError = "Please enter your correct mailId";
        }
        if (emailError) {
          this.setState({ emailError });
          return false;
        }
        return true;
      };
    
    handleSubmit = (e) => {
        e.preventDefault();
        const isValid = this.validate();
        const { email } = this.state;
        if (isValid) {
          const requestData = {
            email: email,
          };
          this.props.sendMail(requestData, (res) => {
            if (res.status === 200) {
              localStorage.setItem(
                "ForgotPasswordToken",
                (res.data.token)
              );
              toast.success(res.data.message)
            } else {
            }
          });
        } 
      };
    
    

    render() { 
        return (
            <React.Fragment>
                  <div className='loginBox'> 
                    <div className='loginLeft col-md-7'>
                        <div className='banner-bg'>
                            <div className='bg-circle orange1'></div> 
                            <div className='bg-circle orange2'></div>
                            <div className='bg-circle blue1'></div>
                            <div className='bg-circle blue2'></div>
                            <div className='bg-circle blue2'></div>
                        </div>
                        <div id="demo" className="carousel slide" data-ride="carousel">

                
                            <ul className="carousel-indicators">
                                <li data-target="#demo" data-slide-to="0" className="active"></li>
                                <li data-target="#demo" data-slide-to="1"></li>
                                <li data-target="#demo" data-slide-to="2"></li>
                            </ul>

                            
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                <h2>Lorem Ipsum is simply dummy text of <br/> the printing and typesetting industry.<br/> Lorem Ipsum </h2>
                                <img src={require("../images/banner.png")}/>
                                </div>
                                <div className="carousel-item">
                                <h2>Lorem Ipsum is simply dummy text of <br/> the printing and typesetting industry.<br/> Lorem Ipsum </h2>
                                <img src={require("../images/banner.png")}/>
                                </div>
                                <div className="carousel-item">
                                <h2>Lorem Ipsum is simply dummy text of <br/> the printing and typesetting industry.<br/> Lorem Ipsum </h2>
                                <img src={require("../images/banner.png")}/>
                                </div>
                            </div>

                        </div>
                    </div>   
                    <div className='formRight col-md-5'>
                        
                        <div className='logo'>
                            <img src={logo} className="" alt="logo" />
                        </div>
                        <form id='myform' onSubmit={this.handleSubmit}>
                            <fieldset>
                                <legend>Forgot Password</legend>
                                <div className="form-outline mb-3">
                                     <TextField  label="Email"  type="email" id="email outlined-basic" name="email" className="form-control" variant="outlined" onChange={(e) => {this.setState({email:e.target.value})}} />
                                </div>
                                <input type="submit" value="Submit" className="btn btn-primary btn-block mb-1 mt-4  " />
                            </fieldset>    
                        </form>
                    </div>     
                  </div>
              
            
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
	return {};
};

export default connect(mapStateToProps, {
	sendMail
})(ForgotPassword);
