import React, { Component } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import { Checkbox, Container } from "@mui/material";
import { changePassword } from "../action/auth";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";
import Loader from "../comman/loader1";
import "react-toastify/dist/ReactToastify.css";
import PasswordChecklist from "react-password-checklist";

toast.configure();

class ChangePassword extends Component {
  state = {
    oldPass: "",
    newPass: "",
    confirmPass: "",
    oldPassVerification: false,
    newPassVerification: false,
    confirmPassVerification: false,
    loading: false,
    checked: false,
  };

  componentDidMount() {
    $(document).ready(function () {
      $("#myform").validate({
        rules: {
          oldPass: {
            required: true,
          },
          newPass: {
            required: true,
          },
          confirmPass: {
            required: true,
          },
        },
        messages: {
          oldPass: {
            required: "<p style='color:red'>Please provide a Old Password</p>",
          },
          newPass: {
            required: "<p style='color:red'>Please provide a New Password</p>",
          },
          confirmPass: {
            required:
              "<p style='color:red'>Please provide a Confirm Password</p>",
          },
        },
      });
    });
  }
  handleCancel = () => {
    window.location.replace("/dashboard");
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      oldPass,
      newPass,
      confirmPass,
      oldPassVerification,
      newPassVerification,
      confirmPassVerification,
    } = this.state;
    if (oldPassVerification && newPassVerification && confirmPassVerification) {
      const requestData = {
        oldPassword: oldPass,
        newPassword: newPass,
        confirmPassword: confirmPass,
        id: localStorage.getItem("id"),
      };
      this.setState({ loading: true });
      this.props.changePassword(requestData, (res) => {
        if (res.status === 200) {
          this.setState({ loading: false });
          this.setState({ oldPass: "" });
          this.setState({ newPass: "" });
          this.setState({ confirmPass: "" });
          toast.success("Password updated");
        } else {
          this.setState({ loading: false });
        }
      });
    } else {
      toast.error("Please provide valid password updated");
    }
  };

  handleChange = (event) => {
    this.setState({ checked: event.target.checked });
  };

  render() {
    const {
      newPassVerification,
      oldPass,
      newPass,
      confirmPass,
      oldPassVerification,
      loading,
      checked,
    } = this.state;
    const passwordType = checked ? "text" : "password";

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
            <div className="heading1 mb-5">
              <h1>
                <span className="counsellor-logo">
                  <LockOpenIcon />
                </span>
                Change Password
              </h1>
            </div>
            <form id="myform" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label for="oldPass">Old Password</label>
                  <input
                    type={passwordType}
                    id="oldPass"
                    name="oldPass"
                    className="form-control"
                    placeholder="Please provide old password"
                    value={this.state.oldPass}
                    onChange={(e) => this.setState({ oldPass: e.target.value })}
                  />
                  {oldPass == "" ||
                    (!oldPassVerification && (
                      <PasswordChecklist
                        rules={[
                          "minLength",
                          "specialChar",
                          "number",
                          "capital",
                        ]}
                        minLength={8}
                        value={oldPass}
                        onChange={(isValid) => {
                          this.setState({ oldPassVerification: isValid });
                        }}
                      />
                    ))}
                </div>
              </div>
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label for="newPass">New Password</label>
                  <input
                    type={passwordType}
                    id="newPass"
                    name="newPass"
                    className="form-control"
                    placeholder="Please provide new password"
                    value={newPass}
                    onChange={(e) => this.setState({ newPass: e.target.value })}
                  />
                  {newPass == "" ||
                    (!newPassVerification && (
                      <PasswordChecklist
                        rules={[
                          "minLength",
                          "specialChar",
                          "number",
                          "capital",
                        ]}
                        minLength={8}
                        value={newPass}
                        onChange={(isValid) => {
                          this.setState({ newPassVerification: isValid });
                        }}
                      />
                    ))}
                </div>
              </div>
              {loading === true ? (
                <div className="loader">
                  <Loader />
                </div>
              ) : (
                ""
              )}
              <div className="row">
                <div className="form-outline mb-4 col-md-6">
                  <label for="confirmPass">Confirm Password</label>
                  <input
                    type={passwordType}
                    id="confirmPass"
                    name="confirmPass"
                    className="form-control"
                    placeholder="Please provide confirm password"
                    value={confirmPass}
                    onChange={(e) =>
                      this.setState({ confirmPass: e.target.value })
                    }
                  />
                  {confirmPass !== "" && (
                    <PasswordChecklist
                      rules={[
                        "minLength",
                        "specialChar",
                        "number",
                        "capital",
                        "match",
                      ]}
                      minLength={8}
                      value={confirmPass}
                      valueAgain={newPass}
                      onChange={(isValid) => {
                        this.setState({ confirmPassVerification: isValid });
                      }}
                      messages={{
                        match: "Confirm password must be same as new password.",
                      }}
                    />
                  )}
                  <div
                    style={{ marginLeft: "-26px" }}
                    className="form-outline mb-4 col-md-6"
                  >
                    <Checkbox
                      checked={checked}
                      onChange={this.handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <label>Show Password</label>
                  </div>
                </div>
              </div>
              <div className="row"></div>
              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-transparent btn-block mb-4"
                  onClick={this.handleCancel}
                >
                  CANCEL
                </button>
                {!loading ? (
                  <input
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                    value="UPDATE"
                  />
                ) : (
                  <input
                    type="button"
                    className="btn btn-secondary btn-block mb-4"
                    disabled
                    value="UPDATE"
                  />
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
  changePassword,
})(ChangePassword);
