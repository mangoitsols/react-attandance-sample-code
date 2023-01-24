import React, { useState,useRef, useEffect } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  styled,
  Grid,
  Container,
  Modal,
  Button,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  Switch,
  NativeSelect,
  Avatar,
  Stack
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { API, BASE_URL } from "../../config/config";
import Loader from "../../comman/loader";
import SearchBar from "material-ui-search-bar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/student.css";
import PinInput from "react-pin-input";
import student from "../../images/student-black.svg";
import present from "../../images/present.svg";
import absent from "../../images/absent.svg";
import { style1 } from "../css/style";
import { authHeader } from "../../comman/authToken";
import PushNotification from "./pushnotification";
import LoaderButton from "../../comman/loader1";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const headCells = [
  {
    id: "Name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "Attendace",
    numeric: false,
    disablePadding: true,
    label: "Attendance",
  },
  {
    id: " OutofClass",
    numeric: true,
    disablePadding: false,
    label: " Out of Class",
  },
  {
    id: "Medical",
    numeric: true,
    disablePadding: false,
    label: "Medical",
  },
  {
    id: "Action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];
export function EnhancedTableHead(props) {
  const { onRequestSort, order, orderBy } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const CounsellorDashboard = (props) => {
  const [rows, setCounsellorDetail] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);
  const [selectSubBox, setSelectSubBox] = useState(false);
  const [pin, setPin] = useState("");
  const [selectCheck, setSelectCheck] = useState([]);
  const [preAbs, setPreAbs] = useState(false);
  const [preAbsId, setPreAbsId] = useState(false);
  const [className, setClassName] = useState([]);
  const [loading1, setLoading1] = React.useState(false);
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(false);
  const firstStart = useRef(true);
  const tick = useRef();

  useEffect(() => {
    GetCounsellorData();
  }, []);

  // timer useeffect start

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
      return;
    }
    if (start) {
      tick.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(tick.current);
    }

    return () => clearInterval(tick.current);
  }, [start]);

  //timer useeffect end

  const GetCounsellorData = async (dataa) => {
    if(!dataa){
      dataa = '';
    }
    setSearch(dataa)
    const id = localStorage.getItem("id");
   await axios
      .get(`${API.getCounsellorStudent}/${id}`, { headers: authHeader() })
      .then((response) => {

        const filteredPersons = response.data.data.filter(
          person => {
            return (
              person
              .name
              .toLowerCase()
              .includes(dataa.toLowerCase())
            );
          }
        );

        setLoading(false);
        setCounsellorDetail({...response.data,data:filteredPersons});
        setClassName(response.data.data[0]);
      }).catch((err) => {
        setLoading(true);
      });
      
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.data.length) : 0;

  const handleAttendance = async (row, attdance) => {
    var today = new Date();
  
    const requestData = {
      attendence: attdance,
    };

    if (today.getDay() == 6 || today.getDay() == 0) {
      toast.warning("Today is weekend");
    } else if (row && row.dismiss) {
      toast.warning("This student is dismiss by manager");
    } else {
       await axios({
        method: "put",
        url: `${API.updateAttendace}/${row && row.attaindence._id}`,
        data: requestData,
        headers: authHeader(),
      })
        .then((res) => {
          toast.success("Attendance Saved");
          GetCounsellorData();
          // setToggle(true);
        })
        .catch((err) => {
          if(err.response.data.message === "attaindence already save"){
            toast.error("Attaindance alredy save");
          }
          toast.error("Failed to save attendance");

        });
    }
  };

  const handleAttendanceUpdate = async (attdance, row) => {
    const requestData = {
      attendence: attdance,
    };

    if (row && row.dismiss) {
      toast.warning("This student is dismiss by manager");
    } else {
      await axios({
        method: "put",
        url: `${API.updateAttendace}/${row && row.attaindence._id}`,
        data: requestData,
        headers: authHeader(),
      })
        .then((res) => {
          toast.success("Attendance updated");
          GetCounsellorData();
          setPreAbs(!preAbs)
        })
        .catch((err) => {
          toast.error("Failed to save attendance");
        });
    }
  };

  const handleMedicalByPin = async () => {
    const requestData = {
      pin: pin,
    };
    setLoading1(true)
    const res = await axios({
      method: "post",
      url: `${API.varifyPin}`,
      data: requestData,
      headers: authHeader(),
    }).catch((err) => {});
    if (res) {
      setLoading1(false)
      toast.success("Pin Verification Confirm");
      setOpenModel(true);
      handleClose();
      setSelected([]);
    } else {
      toast.error("Pin Verification Failed");
      setLoading1(false)
      setSelected([]);
    }
  };

  const closeModel = () => {
    setOpenModel(false);
  };

  const handleOnChangeSelect = async (e, row) => {
    if (row.attaindence === null) {
      toast.warning("First you have to mark attandance");
    } else if (row.attaindence && row.attaindence.attendence === "0") {
      toast.warning("You are mark as an absent");
    } else if (row && row.dismiss) {
      toast.warning("This student is dismiss by manager");
    } else if (row.attaindence && row.attaindence.attendence === null) {
      toast.warning("Student is not mark as out of class until he is Present");
    } else {
      const requestData = {
        out_of_class: e.target.value,
      };
  
      const res = axios({
        method: "put",
        url: `${API.studentStatusUpdate}/${row._id}`,
        data: requestData,
        headers: authHeader(),
      }).catch((err) => {});
      if (res) {
        setSelectSubBox(true);
        setSelectCheck([...selectCheck, row._id]);
        GetCounsellorData();
       } else {
        toast.error("Status updated failed", e.target.value);
      }
    }
  };

  const handleEditPreAbs = (id, attandance) => {
    if (attandance.attendence === null) {
      toast.warning("First you have to mark attandance");
    } else {
      setPreAbsId(id);
      setPreAbs(!preAbs);
    }
  };
  const handleDismiss = () => {
    toast.warning("This student is dismiss by manager");
  };

  // Timer Functionality start


  const toggleStart = async(id) => {

    setStart(true);
    setLoading1(true);
     await axios({
			method: "put",
			url: `${API.timerStart}/${id}`,
			headers: authHeader(),
		}).then((res)=>{
    setLoading1(false); 
    }).catch((err) => { 
    setLoading1(false);
    toast.error("Something went wrong during start timer")
    });
  };

 const toggleStop = async(id) => {
  
    setStart(false);
    setLoading1(true);
    await axios({
			method: "put",
			url: `${API.timerStop}/${id}`,
			headers: authHeader(),
		}).then((res)=>{
    setLoading1(false);
      setSelectSubBox(false)
      GetCounsellorData();
    })
    .catch((err) => {
      setLoading1(false);
      toast.error("Something went wrong during stop timer")
     });
  };

  const dispSecondsAsMins = (seconds) => {

    let divisor_for_minutes = seconds % (60 * 60);
    const mins = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    const seconds_ = Math.ceil(divisor_for_seconds);

    return (
      (mins === 0
        ? "00"
        : mins === 1
        ? "01"
        : mins === 2
        ? "02"
        : mins === 3
        ? "03"
        : mins === 4
        ? "04"
        : mins === 5
        ? "05"
        : mins === 6
        ? "06"
        : mins === 7
        ? "07"
        : mins === 8
        ? "08"
        : mins === 9
        ? "09"
        : mins.toString()) +
      ":" +
      (seconds_ === 0
        ? "00"
        : seconds_ === 1
        ? "01"
        : seconds_ === 2
        ? "02"
        : seconds_ === 3
        ? "03"
        : seconds_ === 4
        ? "04"
        : seconds_ === 5
        ? "05"
        : seconds_ === 6
        ? "06"
        : seconds_ === 7
        ? "07"
        : seconds_ === 8
        ? "08"
        : seconds_ === 9
        ? "09"
        : seconds_.toString())
    );
  };

   // Timer Functionality end

   const filteroutofClass =
   rows?.data?.length === 0
     ? []
     : rows?.data?.filter((vall) =>
         vall && vall?.attaindence && vall?.attaindence === null
           ? []
           : vall?.attaindence && vall?.attaindence?.out_of_class !== "no" && vall?.dismiss === null &&  vall?.attaindence?.attendence !== "0" && vall?.attaindence?.inclassDateTime 
       );
   
   return (
     <>
      <div className="col-md-3 col-lg-3">
        <Sidebar />
      </div>
      <div className="col-md-9 col-lg-9 mr-30">
        <div className="header">
          {" "}
          <ImageAvatars />
        </div>
        <Container
          maxWidth="100%"
          style={{ padding: "0", display: "inline-block" }}
        >
          <PushNotification />

          <div className="heading">
            <h1 className="mb-5">
              Today Attendance for{" "}
              {className && className.assignClass?.className}
            </h1>
          </div>
          <Box sx={{ flexGrow: 1 }} className="dashboard-grid">
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Total Students</h2>
                    <span className="count">{rows.totalcount}</span>
                  </div>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Present Students</h2>
                    <span className="count">{rows.totalpresent}</span>
                  </div>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Absent Students</h2>
                      <span className="count">

                      {rows.totalcount
                        ? (rows.totalcount ?(rows.totalcount - rows.totalpresent) : 0)
                        : "0"}
                    </span>
                    {/* })} */}
                  </div>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item className="dashboaed-text">
                  <div>
                    {" "}
                    <h2>Out of Class</h2>
                    <span className="count">{filteroutofClass?.length}</span>
                  </div>
                </Item>
              </Grid>
            </Grid>
          </Box>

          <div className="heading">
            <div className="d-flex justify-content-between w-100">
              <h1>
                <span className="icon-black">
                  {" "}
                  <img src={student} className="" alt="logo" />
                </span>
                Students
              </h1>
            </div>
          </div>
          <div className="heading2   justify-content-between align-items-center mt-4 mb-4">
            <div className="w-100">
              <SearchBar
                value={search}
                onChange={(newValue) => GetCounsellorData(newValue)}
                placeholder="Search Student"
              />
            </div>
          </div>
          {!loading ? (
            <Box sx={{ width: "100%" }} className="student_table">
              <Paper
                sx={{ width: "100%", mb: 2 }}
                className="student_table-inner"
              >
                <EnhancedTableToolbar
                  numSelected={selected.length}
                  selectedRow={selected}
                  allData={GetCounsellorData}
                  setSelected={setSelected}
                />
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                    className="stuble-table-box"
                  >
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows === false ? "" : rows.data.length}
                    />
                    <TableBody>
                      {rows === false ? (
                        <TableRow>
                          <TableCell>Record not found</TableCell>
                        </TableRow>
                      ) : (
                        rows.data.length ? rows.data
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            const isItemSelected = isSelected(row._id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            const found =
                              selectCheck &&
                              selectCheck.find(
                                (element) => element === row._id
                              );
                            const handleNoStatus = rows.data.find(
                              (ele) => ele._id === row._id
                            );

                            return (
                              <React.Fragment key={row._id}>
                                <Modal
                                  open={openModel}
                                  onClose={closeModel}
                                  aria-labelledby="modal-modal-title"
                                  aria-describedby="modal-modal-description"
                                >
                                  <Box sx={{ ...style1, width: 400 }}>
                                    <Typography
                                      id="modal-modal-title"
                                      variant="h6"
                                      component="h2"
                                    >
                                      <strong>
                                        Student Name:{" "}
                                        <span>
                                          {row.name} {row.lastName}
                                        </span>
                                      </strong>
                                    </Typography>
                                    <Typography
                                      id="modal-modal-description"
                                      sx={{ mt: 2 }}
                                    >
                                      <strong>Medical Message </strong>
                                      <div
                                        id="medical"
                                        name="medical" >{
                                        row.medical === "" ? "" : row.medical
                                      }</div>
                                    </Typography>
                                  </Box>
                                </Modal>
                                <TableRow
                                  hover
                                  role="checkbox"
                                  aria-checked={isItemSelected}
                                  tabIndex={1}
                                  key={row._id}
                                  selected={isItemSelected}
                                >
                                  <TableCell
                                    component="td"
                                    id={labelId}
                                    scope="row"
                                  >
                                    <span className="d-flex align-items-center">
                                      {
                                        <Avatar
                                          alt={row.name}
                                          src={`${BASE_URL}/${row.image}`}
                                          sx={{ width: 56, height: 56 }}
                                          className="mr-4"
                                        />
                                      }
                                      {row.name} {row.lastName} S/o{" "}
                                      {row.fatherName} {row.lastName}
                                    </span>
                                  </TableCell>

                                  <TableCell
                                    component="td"
                                    id={labelId}
                                    scope="row"
                                    padding="none"
                                    style={{ width: "150px" }}
                                  >
  
                            {preAbs && preAbsId === row._id ? (
                              <div className="display form-outline mb-4 col-md-12 medicaltextarea attendance" >
																<button onClick={() => handleAttendanceUpdate("1", row )} className="present-button"><span className=''> <img src={present} className="" alt="icon" /></span></button>
																<button onClick={() => handleAttendanceUpdate("0", row)} className="absent-button"><span className=''> <img src={absent} className="" alt="" /></span></button>
															</div>
                                    ) : row && row.dismiss?"Dismissed" : row && row.attaindence && row.attaindence.attendence === "1" ? "Present" : row && row.attaindence && row.attaindence.attendence === "0" ? "Absent" :
                                  <div className="display form-outline mb-4 col-md-12 medicaltextarea attendance" >
                                    <button onClick={() => handleAttendance(row, "1")} className="present-button"><span className=''> <img src={present} className="" alt="icon" /></span></button>
                                    <button onClick={() => handleAttendance(row, "0")} className="absent-button"><span className=''> <img src={absent} className="" alt="" /></span></button>
                                  </div>   }
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ width: "150px" }}
                                  >
                                    <FormControl
                                      sx={{ m: 1, minWidth: 30 }}
                                      className="filter ml-0 mb-3 w-100 select-box"
                                    >
                                    
                                      <NativeSelect
                                        onChange={(e) => 
                                          handleOnChangeSelect(e, row)
                                        } 
                                        value={row && row.attaindence && row.attaindence.out_of_class
                                          ? row.attaindence.out_of_class
                                          : "No"}
                                        disabled = {row.attaindence && row.attaindence.attendence === null || row.attaindence && row.attaindence.attendence === "0" ||  row.dismiss ? true : false}
                                    
                                        inputProps={{
                                          name: "No",
                                          id: "uncontrolled-native",
                                        }}
                                      >
                                        <option value="No">No</option>
                                        <option value="in Rest Room">
                                          In Rest Room
                                        </option>
                                        <option value="in Front Office">
                                          In Front Office
                                        </option>
                                        <option value="in Camp">In camp</option>
                                      </NativeSelect>

                                      {row &&
                                      row.attaindence &&
                                      row.attaindence.attendence === "1" ? (
                                        selectSubBox === false ? (
                                          ""
                                        ) : found &&
                                          handleNoStatus.attaindence &&
                                          handleNoStatus.attaindence
                                            .out_of_class !== "No" ? (
                                              <Stack direction="row" spacing={1} margin="5px 14px">
         
                                                    {!start ? (!loading1 ?  <button  onClick={() => toggleStart(row._id)}>start</button> : <LoaderButton/>) :
                                                     (!loading1 ?  <button onClick={() => toggleStop(row._id)}>stop</button>:<LoaderButton/> )}
                                              {" "}
                                                  <span style={{color:"red",margin:"7px 2px" }}>
                                                      {dispSecondsAsMins(timer)}
                                                  </span>
                                                
                                                </Stack>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </FormControl>
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ width: "100px" }}
                                  >
                                    {row.medical === "" ? (
                                      ""
                                    ) : (
                                      <Button
                                        onClick={() => handleOpen(row.medical)}
                                      >
                                         <i>
                                          <img
                                            src={require("../images/medical.png")}
                                            alt="emergency"
                                          />
                                        </i>
                                      </Button>
                                    )}
                                  </TableCell>
                                  {row.dismiss ? (
                                    <TableCell
                                      align="center"
                                      className="action"
                                      style={{ width: "150px" }}
                                    >
                                      <span onClick={() => handleDismiss()}>
                                        <img
                                          src={require("../images/edit.png")}
                                          alt="emer"
                                        />
                                      </span>
                                    </TableCell>
                                  ) : (
                                    <TableCell
                                      align="center"
                                      className="action"
                                      style={{ width: "150px" }}
                                    >
                                      <span
                                        onClick={() =>
                                          handleEditPreAbs(
                                            row._id,
                                            row.attaindence
                                          )
                                        }
                                      >
                                        <img
                                          src={require("../images/edit.png")}
                                          alt="emer"
                                        />
                                      </span>
                                    </TableCell>
                                  )}
                                </TableRow>
                              </React.Fragment>
                            );
                          })
                      : <TableRow>
                      <TableCell colSpan={5}>Record not found</TableCell>
                    </TableRow>)}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 33 : 53) * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows === false ? "" : rows.data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              <FormControlLabel
                control={
                  <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
              />
            </Box>
          ) : (
            <Loader />
          )}
          {/* <div className="student-box"><EnhancedTable data={searchData}/></div> */}
        </Container>
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style1, width: 400 }}>
            <h2 id="parent-modal-title">Enter Your Pin</h2>
            <div>
              <PinInput
                length={4}
                initialValue=""
                type="numeric"
                inputMode="number"
                placeholder="0"
                style={{ padding: "10px" }}
                onComplete={(value, index) => {
                  setPin(value);
                }}
                autoSelect={true}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              />
            </div>
            <Button onClick={handleClose}>CANCEL</Button>
            {!loading1 ? <Button onClick={handleMedicalByPin}>SUBMIT</Button> : <><Button disabled>SUBMIT</Button><LoaderButton /></>}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default CounsellorDashboard;
