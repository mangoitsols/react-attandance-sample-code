import React, { useState } from "react";
import ImageAvatars, { handleLogout } from "./header";
import {
  Container,
  Box,
  FormControl,
  styled,
  Paper,
  Grid,
  Avatar,
  Stack,
  NativeSelect,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Sidebar from "./sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API, BASE_URL } from "../config/config";
import moment from "moment";
import attendance1 from "./images/attendance.svg";
import { Link } from "react-router-dom";
import { authHeader } from "../comman/authToken";
import Loader from "../comman/loader";

toast.configure();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const DashBoard1 = () => {
  const [classData, setClassData] = useState([]);
  const [rows, setStudentDetail] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterr, setFilter] = React.useState([]);
  const [classNameOnChange, setclassNameOnChange] = React.useState("");
  const [classNameIdOnChange, setclassNameIdOnChange] = React.useState("");

  var socket;

  React.useEffect(() => {
    GetStudentData();
    GetClassData();
  }, []);

  const GetStudentData = async () => {
    await axios
      .get(`${API.getStudent}`, { headers: authHeader() })
      .then((response) => {
        setLoading(false);
        setStudentDetail(response.data);
        setFilter(response.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setLoading(false);
      });
  };

  const GetClassData = async () => {
    await axios
      .get(`${API.getClass}`)
      .then((res) => {
        setLoading(false);
        setClassData(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setLoading(true);
      });
  };

  const SelectOnChange = (ele) => {
    const classNameGet = classData.find((item) => {
      return item && item._id === ele ? item.className : "";
    });
    setclassNameOnChange(classNameGet && classNameGet.className);

    setclassNameIdOnChange(ele);
    localStorage.setItem("className", ele);

    if (ele === "all") {
      setFilter(rows.data);
    } else if (ele === ele) {
      const data = rows.data.filter((item) => {
        return item.assignClass ? item.assignClass._id === ele : "";
      });
      if (data.length > 0) {
        setFilter(data);
      } else {
        setFilter([]);
      }
    }
  };

  const filterDataAbs = filterr.filter(
    (vall) => vall && vall.attaindence && vall.attaindence.attendence === "0"
  );

  const filterDataNull = filterr.filter(
    (vall) =>
      vall && vall.dismiss === null && vall.attaindence.attendence === null
  );

  const AbsConcatNull = filterDataAbs.concat(filterDataNull);

  const filterDataPre =
    filterr &&
    filterr.filter(
      (vall) => vall && vall.attaindence && vall.attaindence.attendence === "1"
    );

  const filteroutofClass =
    filterr.length === 0
      ? []
      : filterr.filter((vall) =>
          vall && vall.attaindence && vall.attaindence === null
            ? []
            : vall.attaindence &&
              vall.attaindence.out_of_class !== "no" &&
              vall?.dismiss === null &&
              vall.attaindence.attendence !== "0" &&
              vall.attaindence.outclassDateTime
        );
  const absBySubs = filterr.length - filterDataPre.length;

  let dismiss = filterr.filter((e) => e.dismiss !== null);
  let finalAbsRecord = filterDataAbs.filter((e) => e.dismiss === null);

  return (
    <React.Fragment>
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
          {loading ? <Loader /> : ""}
          <div className="heading">
            <h1>
              <span className="icon">
                <DashboardIcon fontSize="35px" />
              </span>
              Dashboard
            </h1>
            <div>
              <label>Filter By:</label>
              <FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
                <NativeSelect
                  defaultValue="all"
                  onChange={(e) => SelectOnChange(e.target.value)}
                  inputProps={{
                    name: "age",
                    id: "uncontrolled-native",
                  }}
                  className="w-100"
                >
                  <option value="all">All</option>
                  {classData.map((item) => {
                    const str = item?.className;
                    const capitalizeFirstLetter =
                      str?.charAt(0)?.toUpperCase() + str?.slice(1);
                    return (
                      <option key={item._id} value={item._id}>
                        {capitalizeFirstLetter}
                      </option>
                    );
                  })}
                </NativeSelect>
              </FormControl>
            </div>
          </div>

          <div className="filter-text">
            {classNameOnChange === "all" ? "" : classNameOnChange}
            {classNameOnChange ? (
              <span>
                <div className="filter-text">
                  {classNameOnChange === "all" ? (
                    ""
                  ) : filterr.length === 0 ? (
                    ""
                  ) : (
                    <Link to={`/attendance/${classNameIdOnChange}`}>
                      <img src={attendance1} className="" alt="logo" />
                      Attendance Report
                    </Link>
                  )}
                </div>
              </span>
            ) : (
              ""
            )}
          </div>
          <Box sx={{ flexGrow: 1 }} className="dashboard-grid">
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Total Students</h2>
                    <span className="count">
                      {classNameOnChange === "all" || classNameOnChange === ""
                        ? rows.totalcount
                        : filterr?.length}
                    </span>
                  </div>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Present Students</h2>
                    <span className="count">
                      {classNameOnChange === undefined ||
                      classNameOnChange === ""
                        ? rows?.totalpresent
                        : filterDataPre?.length}
                    </span>
                  </div>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Absent Students</h2>
                    <span className="count">
                      {classNameOnChange === undefined ||
                      classNameOnChange === ""
                        ? AbsConcatNull?.length
                        : AbsConcatNull?.length}
                    </span>
                  </div>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Out of Class</h2>
                    <span className="count">
                      {classNameOnChange === "all" || classNameOnChange === ""
                        ? filteroutofClass.length
                        : filteroutofClass.length}
                    </span>
                  </div>
                </Item>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ flexGrow: 1 }} className="dashboard-bottom-grid">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Item className="dashboaed-text">
                  <h2>Absents</h2>

                  {AbsConcatNull && AbsConcatNull.length === 0 ? (
                    <p>No records found</p>
                  ) : (
                    AbsConcatNull &&
                    AbsConcatNull.map((item) => {
                      return (
                        <Stack direction="row" spacing={2} key={item._id}>
                          {item &&
                          item.image &&
                          item.image.startsWith("http") ? (
                            <span className="avtar-text">
                              {
                                <Avatar
                                  alt={item.name}
                                  src={`${item.image}`}
                                  sx={{ width: 56, height: 56 }}
                                />
                              }
                            </span>
                          ) : (
                            <span className="avtar-text">
                              {
                                <Avatar
                                  alt={item.name}
                                  src={`${BASE_URL}/${item.image}`}
                                  sx={{ width: 56, height: 56 }}
                                />
                              }
                            </span>
                          )}
                          <div className="profile-timer">
                            <span>
                              <strong className="avtar-text">
                                {item.name} {item.lastName}
                              </strong>
                              <small className="avtar-text">
                                {item &&
                                  item.assignClass &&
                                  item.assignClass.className}
                              </small>
                            </span>
                          </div>
                        </Stack>
                      );
                    })
                  )}
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item className="dashboaed-text">
                  <h2>Students Out of Class</h2>

                  {filteroutofClass.length === 0 ? (
                    <p>No records found</p>
                  ) : (
                    filteroutofClass.length &&
                    filteroutofClass.map((item) => {
                      const inTime = moment(
                        item.attaindence.inclassDateTime
                      ).format("DD/MM/YYYY HH:mm:ss");
                      const outTime = moment(
                        item.attaindence.outclassDateTime
                      ).format("DD/MM/YYYY HH:mm:ss");
                      var timee,
                        timeetimer = false;
                      if (inTime.toString() > outTime.toString()) {
                        timee = moment
                          .utc(
                            moment(inTime, "DD/MM/YYYY HH:mm:ss").diff(
                              moment(outTime, "DD/MM/YYYY HH:mm:ss")
                            )
                          )
                          .format("mm:ss");
                        timeetimer = false;
                      } else {
                        timeetimer = true;
                      }

                      return (
                        <Stack direction="row" spacing={2} key={item._id}>
                          <Avatar
                            alt={item.name}
                            src={`${BASE_URL}/${item.image}`}
                          />
                          <div className="profile-timer">
                            <span>
                              <strong>{item.name}</strong>
                              <small>{item.attaindence.out_of_class}</small>
                            </span>
                            <span className="timer">
                              {item.attaindence.outclassDateTime &&
                              item.attaindence.inclassDateTime &&
                              !timeetimer
                                ? timee + "min"
                                : "00:00 min"}{" "}
                            </span>
                          </div>
                        </Stack>
                      );
                    })
                  )}
                </Item>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashBoard1;
