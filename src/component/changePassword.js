import React, { Component } from 'react';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import { Container } from "@mui/material";
import { changePassword} from "../action/auth";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { toast } from "react-toastify";
import Loader from "../comman/loader1";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class ChangePassword extends Component {
    state = {
      oldPass:"",
      newPass:"",
      confirmPass:"",
      loading:false
       } 

     componentDidMount() {
        $(document).ready(function () {
          $("#myform").validate({
            rules: {
                oldPass: {
                  required: true,
                },
                newPass: {
                  required: true,
                  minlength: 6,
                },
                confirmPass: {
                  required: true,
                    minlength: 6,
                    equalTo: "#newPass"
                },
            },
            messages: {
              oldPass: {
                required: "<p style='color:red'>Please provide a Old Password</p>",
              },
              newPass: {
                required: "<p style='color:red'>Please provide a New Password</p>",
                minlength: "<p style='color:red'>Please provide minimum length 6</p>",
              },
              confirmPass: {
                required: "<p style='color:red'>Please provide a Confirm Password</p>",
                minlength: "<p style='color:red'>Please provide minimum length 6</p>",
                equalTo:"<p style='color:red'>Confirm password must be same as new password</p>"
              }
            },
          });
        });
      }
      handleCancel = () =>{
        window.location.replace("/dashboard");
      }
      handleSubmit = (e) => {
      e.preventDefault();
      const {oldPass,newPass,confirmPass} = this.state;
     
        const requestData = {
          oldPassword:oldPass,
          newPassword:newPass,
          confirmPassword:confirmPass,
          id:localStorage.getItem("id"),
        }
        this.setState({loading:true})
        this.props.changePassword(requestData,(res)=>{
          if(res.status === 200){
            this.setState({loading:false})
            this.setState({oldPass:""})
            this.setState({newPass:""})
            this.setState({confirmPass:""})
            toast.success("Password updated");
            this.setState({loading:false})
          }
          else{
        this.setState({loading:false})
          }
        })
     
  }

    render() { 
   
        return (<>
          <Sidebar/>
          <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
             <div className='header'> <ImageAvatars/></div>
          
             <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
             <div className='heading1 mb-5'>
             
                <h1>
                <span className='counsellor-logo'><LockOpenIcon/></span>Change Password</h1>
            </div>
            <form id='myform' onSubmit={this.handleSubmit}>
 
              <div className='row'>
                <div className="form-outline mb-4 col-md-6">
                  <label for="oldPass">Old Password</label>
                  <input type="password" id="oldPass" name="oldPass" className="form-control" placeholder='Please provide old password' value={this.state.oldPass} onChange={(e) => this.setState({ oldPass: e.target.value }) } />
                </div>
              </div>
              <div className='row'>
                <div className="form-outline mb-4 col-md-6">
                  <label for="newPass">New Password</label>
                  <input type="password"  id="newPass" name="newPass" className="form-control" placeholder='Please provide new password' value={this.state.newPass} onChange={(e) => this.setState({ newPass: e.target.value }) } />
                </div>
              </div>
              {this.state.loading === true ? (
                  <div className="loader">
                    <Loader />
                  </div>
                ) : (
                  ""
                )}
              <div className='row'>  
                <div className="form-outline mb-4 col-md-6">
                  <label for="confirmPass">Confirm Password</label>
                  <input type="password" id="confirmPass" name="confirmPass" className="form-control" placeholder='Please provide confirm password'  value={this.state.confirmPass} onChange={(e) => this.setState({ confirmPass: e.target.value }) } />
                </div>
              </div>
              <div className='mt-4'>
              <button type="button" className="btn btn-transparent btn-block mb-4" onClick={this.handleCancel} >CANCEL</button>
             {!this.state.loading ? <input type="submit" className="btn btn-primary btn-block mb-4" value="UPDATE" /> : <input type="button" className="btn btn-secondary btn-block mb-4" disabled value="UPDATE" /> }
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
  changePassword
})(ChangePassword);