import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import { csvData } from "../comman/test";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Box,
  Fade,
  Backdrop,
  FormControl,
  Container,
  Modal,
  Button,
  FormControlLabel,
  Tooltip,
  IconButton,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Switch,
  NativeSelect,
  Avatar,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { API, BASE_URL, SOCKET_URL } from "../config/config";
import Example from "../comman/loader";
import { getStudentData } from "../action/functional";
import axios from "axios";
import ImageAvatars, { handleLogout } from "./header";
import Sidebar from "./sidebar";
import SearchBar from "material-ui-search-bar";
import { useDispatch } from "react-redux";
import "./css/student.css";
import { io } from "socket.io-client";
import InputField from "../comman/inputField";
import { authHeader } from "../comman/authToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LinearWithValueLabel from "../comman/progressBar";
import cross from "./images/cross.svg";
import student from "../images/student.svg";
import Example1 from "../comman/loader1";
import PinInput from "react-pin-input";
import $ from "jquery";
import LoaderButton from "../comman/loader1";
import { capitalizeFirstLetter } from "../comman/capitalizeFirstLetter";

toast.configure();

const headCells = [
  {
    id: "Name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "Class",
    numeric: false,
    disablePadding: true,
    label: "Class",
  },
  {
    id: "Medical",
    numeric: true,
    disablePadding: false,
    label: "Medical",
  },
  {
    id: "Emergency",
    numeric: true,
    disablePadding: false,
    label: "Emergency",
  },
  {
    id: "Action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 4,
  pt: 2,
  px: 4,
  pb: 3,
};

export function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
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

const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    allData,
    selectedRow,
    allClasses,
    GetClassData,
    setSelected,
    rowsData,
  } = props;
  const socket = useRef(io(SOCKET_URL));
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const [childOppen, setChildOpen] = useState(false);
  const [selectBox, setSelectBox] = useState("");
  const [nameC, setNameC] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [openModelAllDelete, setOpenModelAllDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCloseAllStudentDeleteModal = () =>
    setOpenModelAllDelete(!openModelAllDelete);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      id: selectedRow,
      assignClass: selectBox,
    };
    setButtonDisable(true);
    const res = axios({
      method: "put",
      url: `${API.studentAssignClass}`,
      data: requestData,
      headers: authHeader(),
    })
      .then((res) => {
        setButtonDisable(true);
        toast.success("Students assigned class");
        allData();
        handleClose();
        setSelected([]);
      })
      .catch((err) => {
        setButtonDisable(true);
        toast.error("Students assigned class failed");
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const childOpen = () => {
    setChildOpen(true);
  };
  const childClose = () => {
    setChildOpen(false);
  };

  const handleChildSubmit = async (e) => {
    e.preventDefault();

    if (nameC === "") {
      toast.error("Class name is required");
    } else {
      const requestData = {
        className: nameC,
      };
      setButtonDisable(true);
      await axios({
        method: "post",
        url: `${API.createClass}`,
        data: requestData,
        headers: authHeader(),
      })
        .then((res) => {
          toast.success(`${capitalizeFirstLetter(nameC)} created successfully`);
          setButtonDisable(false);
          GetClassData();
          childClose();
        })
        .catch((err) => {
          if (err.response.data.message === "class already exists") {
            toast.error("Classname already exists");
            setButtonDisable(false);
          } else if (err.response.status === 401) {
            handleLogout();
          } else if (err.response.status === 400) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Failed to created class");
            setButtonDisable(false);
          }
        });
    }
  };

  const handleAllStuDelete = () => {
    setLoading(true);
    axios
      .delete(`${API.studentDelete}`, {
        data: { id: selectedRow },
        headers: authHeader(),
      })
      .then((res) => {
        toast.success("Students Deleted");
        allData();
        setSelected([]);
        setLoading(false);
        handleCloseAllStudentDeleteModal();
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Students deleted failed");
        if (err.response.status === 401) {
          handleLogout();
        }
        handleCloseAllStudentDeleteModal();
      });
  };

  const handleOnChange = (e) => {
    setNameC(e.target.value);

    $(document).ready(function () {
      $("#addClass").validate({
        rules: {
          classNameAdd: {
            required: true,
          },
        },
        messages: {
          classNameAdd: {
            required: "<p style='color:red'>Class name is required</P>",
          },
        },
      });
    });

    $('input[name="classNameAdd"]').keyup(function (e) {
      if (/[^A-Za-z0-9-\s]/g.test(this.value)) {
        this.value = this.value.replace(/[^A-Za-z0-9-\s]/g, "");
      }
    });
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={childOppen}
        onClose={childClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={childOppen}>
          <Box sx={style}>
            <form
              className="mui-form"
              id="addClass"
              onSubmit={handleChildSubmit}
            >
              <legend>Add Class</legend>
              <div className="mui-textfield">
                <input
                  type="text"
                  placeholder="class E"
                  name="classNameAdd"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="btndesign text-right">
                <button
                  type="button"
                  className="btn btn-transparent"
                  onClick={childClose}
                >
                  CLOSE
                </button>
                {!buttonDisable ? (
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="SAVE"
                  />
                ) : (
                  <>
                    <Button type="button" disabled>
                      SAVE
                    </Button>
                    {/* <LoaderButton /> */}
                  </>
                )}
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form className="mui-form" onSubmit={handleSubmit}>
              <legend>Assign</legend>
              <div className="mui-textfield">
                <FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
                  <NativeSelect
                    defaultValue="all classes"
                    onChange={(e) => setSelectBox(e.target.value)}
                    inputProps={{
                      name: "age",
                      id: "uncontrolled-native",
                    }}
                  >
                    <option value="select">Select</option>
                    {allClasses.map((item) => {
                      const capitalFirstLetterClassName = capitalizeFirstLetter(item.className);
                      return (
                        <>
                          <option key={item._id} value={item._id}>
                            {capitalFirstLetterClassName}
                          </option>
                        </>
                      );
                    })}
                  </NativeSelect>
                </FormControl>
              </div>

              <a className="float-right pointer blue" onClick={childOpen}>
                Add new class
              </a>

              <div className="btndesign text-right">
                <button
                  type="button"
                  className="btn btn-transparent"
                  onClick={handleClose}
                >
                  CLOSE
                </button>
                {!buttonDisable ? (
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="UPDATE"
                  />
                ) : (
                  <input
                    type="submit"
                    className="btn btn-secondary"
                    disabled
                    value="UPDATE"
                  />
                )}
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* Delete all student modal */}
      {
        <Modal
          open={openModelAllDelete}
          onClose={handleCloseAllStudentDeleteModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: 500, textAlign: "center" }}>
            <Box>
              <CancelOutlinedIcon
                sx={{ fontSize: "4.5rem !important", fill: "red" }}
              />
            </Box>
            <Typography id="modal-modal-title" component="h1">
              Are you sure?
            </Typography>
            <Typography id="modal-modal-description" component={"subtitle2"}>
              Do you really want to delete the selected student ?
            </Typography>
            <Box marginTop={"30px"}>
              {!loading ? (
                <Button
                  variant="contained"
                  className="delete-button"
                  size="large"
                  onClick={handleAllStuDelete}
                >
                  Delete
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    className="delete-button"
                    size="large"
                    disabled
                  >
                    Delete
                  </Button>
                  <Example1 />
                </>
              )}

              <Button
                variant="outlined"
                size="large"
                onClick={handleCloseAllStudentDeleteModal}
                sx={{
                  marginLeft: "15px",
                  borderColor: "text.primary",
                  color: "text.primary",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      }
      <Toolbar
        className="delete-outer-box"
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          ></Typography>
        )}

        {numSelected > 0 ? (
          <span className="delete-box">
            <span title="Delete" onClick={handleCloseAllStudentDeleteModal}>
              Delete
            </span>
            |
            <span title="Assign" onClick={handleOpen}>
              Assign
            </span>
          </span>
        ) : (
          <Tooltip title="Filter list">
            <IconButton></IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setStudentDetail] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loading1, setLoading1] = React.useState(false);
  const [openmodel, setOpenmodel] = useState(false);
  const [openModelDelete, setOpenModelDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [filterr, setFilter] = useState([]);
  const [emergencyVal, setEmergencyVal] = useState([]);
  const [classData, setClassData] = useState([]);
  const [array, setArray] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [progress, setProgress] = useState(false);
  const [pin, setPin] = useState("");
  const [openMedical, setOpenMedical] = React.useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [counsellorDetail, setCounsellorDetail] = useState([]);
  const [medicalRow, setMedicalRow] = useState('');
  const [stateByCountry, setStateByCountry] = useState([]);
  const [getCountry, setGetCountry] = useState([]);
  const [deleteStudentDetail, setDeleteStudentDetail] = useState('')

  const handleGetCouncellor = () => {
    fetch(API.getAllUser, { headers: authHeader() })
      .then((a) => {
        if (a.status === 200) {
          setLoading(false);
          return a.json();
        } else {
          setLoading(true);
        }
      })
      .then((data) => {
        setCounsellorDetail(data.filter((e) => e.role.name === "counsellor"));
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const getCountries = async() =>{
    await axios.get(`${API.getAllCountry}`, { headers: authHeader() }).then((res) => {
      setGetCountry(res.data.country);
      handleState(res.data.country[0]?._id)
    })
    .catch((err) => {
      if (err.response.status === 401) {
        handleLogout();
      }
    });
  }

  const handleState = async(id) => {
    await axios.get(`${API.getStateBYCountryId}/${id}`, { headers: authHeader() }).then((res) => {
        setStateByCountry(res.data);
      });
    };

  const dispatch = useDispatch();

  const handleClose1 = () => setOpenmodel(false);
  const handleOpen1 = () => setOpenmodel(true);
  const handleCloseDeleteModal = (row) => {setOpenModelDelete(!openModelDelete); setDeleteStudentDetail(row)};

  const fileReader = new FileReader();

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

  const handleOnChange = (e) => {
    if (e.target.files[0]) {
      fileReader.onload = function (event) {

        const text = event.target.result.replace(/["]+/g, "");
        const csvHeader = text.slice(0, text.indexOf("\n")).split(",");
        const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");

        csvRows.splice(-1);

        const array = csvRows.map((i) => {
          const values = i.split(",");
          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
        
        //  check zipcode
         const check_Zipcode = array.map(obj => {
          const zipcode_length_Compare =  (obj.zip_code.length > 5 || obj.zip_code.length < 5)
          return zipcode_length_Compare;
         })
        
         // check state
         const check_State = array.map(obj => {
            const stateCompare = stateByCountry.map((res)=>{ return (
                res.name === obj.state)
              })
  
          return stateCompare;
         })
         //check country
         const check_Country = array.map(obj => {
          const countryCompare = getCountry.map((res)=>{ return (
              res.name === obj.country.toUpperCase())
            })

        return countryCompare;
       })

      //  check DOB
      const Dob_length = []
      const check_Dob = array.map(obj => {
        const age = getAge(obj.DOB)
        const Dob_compare = age >= 2 ? true : false;
          Dob_length.push(Dob_compare)
        return Dob_compare;
       })

       let classNameRegex = [];
       //  update classname key object 
       const update_Obj = array.map(obj => {
         const classRegex = /[^A-Za-z0-9-\s]/g;
        classNameRegex = (obj.assignClass.match(classRegex) ? obj.assignClass.match(classRegex) : []);
        if (Object.keys('assignClass')) {
          obj.assignClass=`${obj.assignClass}`;
        }
        return obj
      })

      const reqData = {
        array: update_Obj,
      };

        if (classNameRegex.length <= 0) {
          if(!check_Dob.includes(false)){
          if(!check_Zipcode.includes(true)){
            if(!check_Country[0].includes(false)){
            if(check_State[0].includes(true)){
           axios({
            method: "post",
            url: `${API.bulkUpload}`,
            data: reqData,
            headers: authHeader(),
          })
            .then((res) => {
              setProgress(true);
              GetStudentData();
              GetClassData();
              setTimeout(() => {
                setProgress(false);
                handleClose1();
              }, 8500);
            })
            .catch((err) => {
              if (err.response.status === 401) {
                handleLogout();
              }
              toast.error("Failed to uploading csv file");
            });

          setArray(array);
        } 
        else{
          toast.error(
            "Please check the state"
          );
        }
      }else{
        toast.error(
          "Please check the country"
        );
      }
      }
        else {
          toast.error(
            "Please check the zip code"
          );
        }}else{
          toast.error(
            "Student age must be greather than 2 or equal."
          );
        }
      
      }else{
        toast.error(
          "Class name verification failed."
        );

      }
    }

      fileReader.readAsText(e.target.files[0]);
    }
  };

  const handleStuDelete = (rowId) => {
    setDeleteId(rowId);
    setLoading1(true);
    axios
      .delete(`${API.studentDelete}`, {
        data: {
          id: [rowId],
        },
        headers: authHeader(),
      })
      .then((res) => {
        toast.success("Student Deleted");
        GetStudentData();
        setLoading1(false);
        setSelected([]);
        handleCloseDeleteModal(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setLoading1(false);
        handleCloseDeleteModal(false);
        toast.error("Student Deleted Failed");
      });
  };


  const handleStuFilter = (e) => {
    if (e.target.value === "all classes") {
      setFilter(rows);
    } else if (e.target.value === e.target.value) {
      const data = rows.filter((item) => {
        return item.assignClass
          ? item.assignClass.className === e.target.value
          : "";
      });
      if (data.length > 0) {
        setFilter(data);
      } else {
        setFilter([]);
      }
    }
  };

  const handleSearch = async (data) => {
    setSearch(data);
    if (data !== "") {
      // setLoading(true)
      await axios
        .get(`${API.studentSearch}/${data}`, { headers: authHeader() })
        .then((res) => {
          // setLoading(false)
          setFilter(res.data.data);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            handleLogout();
          }
          alert("er");
          // setLoading(false)
          setFilter([]);
        });
    } else {
      GetStudentData();
    }
  };

  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
  };

  const handleOpen = (val) => {
    setOpen(true);
    setEmergencyVal(val);
  };
  const handleClose = () => {
    setOpen(false);
    setSelected([]);
  };

  React.useEffect(() => {
    GetStudentData();
    GetClassData();
    handleGetCouncellor();
    getCountries();
  }, []);

  const GetClassData = async () => {
    setLoading(true);
    const response = await axios.get(`${API.getClass}`).catch((err) => {
      if (err.response.status === 401) {
        handleLogout();
      }
    });
    if (response.status === 200) {
      setLoading(false);
      setLoading1(false);
    } else {
      setLoading(false);
      setLoading1(false);
    }
    const filterData = response.data.data.filter((fil) => fil.className !== 'class unassigned')

    setClassData(filterData);
  };

  const GetStudentData = async () => {
    setLoading(true);
    const response = await axios
      .get(`${API.getStudent}`, { headers: authHeader() })
      .then((res) => {
        setStudentDetail(res.data.data);
        setFilter(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setLoading(false);
      });

    dispatch(getStudentData(response));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filterr.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, rowId) => {
    const selectedIndex = selected.indexOf(rowId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(rowId, selected);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleOpenMedical = (row) => {
    setOpenMedical(true);
    setMedicalRow(row)
  };

  const handleCloseMedical = () => {
    setOpenMedical(false);

  };

  const handleMedicalByPin = async () => {
    const requestData = {
      pin: pin,
    };
    setLoading1(true);
    await axios({
      method: "post",
      url: `${API.varifyPin}`,
      data: requestData,
      headers: authHeader(),
    })
      .then((res) => {
        setLoading1(false);
        toast.success("Pin verified");
        setOpenModel(true);
        handleCloseMedical();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
        setLoading1(false);
        toast.error("Pin failed");
      });
  };

  const closeModel = () => {
    setOpenModel(false);
    setMedicalRow('')
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
          className="upload_csv"
          open={openmodel}
          onClose={handleClose1}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openmodel}>
            <Box sx={style} className="upload_csv_box">
              <legend className="text-center">
                Upload students record in CSV{" "}
              </legend>
             {!progress ?<div style={{ textAlign: "center", width: "100%" }} >
                <form>
                  <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                    onClick={(e) => {e.target.value = null}}
                  />
                </form>
              </div> : <div className="notbulkupload" > UPLOAD CSV</div>}
              <div style={{ textAlign: "center" ,width:'100%'}} >
                Sample Csv File &nbsp;
                <CSVLink data={csvData} filename="sample.csv" target="_blank">
                  Download
                </CSVLink>
              </div>
              {progress ? (
                <span className="loader-bar">
                  <LinearWithValueLabel value={0} color="warning" />
                </span>
              ) : (
                ""
              )}
            </Box>
          </Fade>
        </Modal>
        <Container
          maxWidth="100%"
          style={{ padding: "0", display: "inline-block" }}
        >
          <div className="heading">
            <div className="d-flex justify-content-between w-100">
              <h1>
                <span className="counsellor-logo">
                  {" "}
                  <img src={student} className="" alt="logo" />
                </span>
                Students
              </h1>
              <div>
                <Link to="/addStudent">Add Student</Link>
                <span>|</span>
                <button className="mr-0 bluk-uploads" onClick={handleOpen1}>
                  Bulk Add Students
                </button>
              </div>
            </div>
          </div>
          <div className="heading2  d-flex justify-content-between align-items-center mt-4 mb-5">
            <div>
              <SearchBar
                value={search}
                onChange={(newValue) => handleSearch(newValue)}
                placeholder="Search Student"
              />
            </div>
            <div>
              <label>Filter By:</label>
              <FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
                <NativeSelect
                  defaultValue="all classes"
                  onChange={(e) => handleStuFilter(e)}
                  inputProps={{
                    name: "age",
                    id: "uncontrolled-native",
                  }}
                >
                  <option value="all classes">All Class</option>
                  {classData.map((item) => {
                     const capitalFirstLetterClassName = capitalizeFirstLetter(item.className);
                    return (
                      <option key={item._id} value={item.className}>
                        {capitalFirstLetterClassName}
                      </option>
                    );
                  })}
                </NativeSelect>
              </FormControl>
            </div>
          </div>
          {!loading ? (
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%", mb: 2 }}>
                <EnhancedTableToolbar
                  numSelected={selected.length}
                  selectedRow={selected}
                  allData={GetStudentData}
                  allClasses={classData}
                  GetClassData={GetClassData}
                  setSelected={setSelected}
                  rowsData={rows}
                />
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={filterr.length}
                    />
                    <TableBody>
                      {filterr ? (
                        filterr.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                              Record not found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filterr &&
                          filterr
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                              const isItemSelected = isSelected(row._id);
                              const labelId = `enhanced-table-checkbox-${index}`;
                              const capitalFirstLetterClassName = capitalizeFirstLetter(row.assignClass && row.assignClass.className);
                              return (
                                <React.Fragment key={row._id}>
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={1}
                                    key={row._id}
                                    // selected={isItemSelected}
                                  >
                                    <TableCell
                                      padding="checkbox"
                                      onClick={(event) => {
                                        handleClick(event, row._id);
                                      }}
                                      selected={isItemSelected}
                                    >
                                      <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        inputProps={{
                                          "aria-labelledby": labelId,
                                        }}
                                      />
                                    </TableCell>

                                    <TableCell
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                    >
                                      {row &&
                                      row.image &&
                                      row.image.startsWith("http") ? (
                                        <span className="avtar-text">
                                          {
                                            <Avatar
                                              alt={row.name}
                                              src={`${row.image}`}
                                              sx={{ width: 56, height: 56 }}
                                            />
                                          }
                                          <span>
                                            {row.name} {row.lastName} S/o{" "}
                                            {row.fatherName} {row.lastName}
                                          </span>
                                        </span>
                                      ) : (
                                        <span className="avtar-text">
                                          {
                                            <Avatar
                                              alt={row.name}
                                              src={`${BASE_URL}/${row.image}`}
                                              sx={{ width: 56, height: 56 }}
                                            />
                                          }
                                          <span>
                                            {row.name} {row.lastName} S/o{" "}
                                            {row.fatherName} {row.lastName}
                                          </span>
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                      padding="none"
                                      style={{ width: "100px" }}
                                    >
                                      {capitalFirstLetterClassName ? capitalFirstLetterClassName : ''}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{ width: "100px" }}
                                    >
                                      {row.medical === "" ? (
                                        ""
                                      ) : (
                                        <i
                                          onClick={() =>
                                            handleOpenMedical(row)
                                          }
                                        >
                                         
                                          <img
                                            src={require("./images/medical.png")}
                                            alt="Medical_Img"
                                          />
                                        </i>
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{ width: "100px" }}
                                    >
                                      {row.emergency === "" ? (
                                        ""
                                      ) : (
                                        <Button
                                          onClick={() =>
                                            handleOpen(row.emergency)
                                          }
                                        >
                                          <i>
                                            <img
                                              src={require("./images/emergency.png")}
                                              alt="Emergency_Img"
                                            />
                                          </i>
                                        </Button>
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="action"
                                      style={{ width: "150px" }}
                                    >
                                      <span>
                                        <Link to={`/editstudent/${row._id}`}>
                                          <img
                                            src={require("./images/edit.png")}
                                            alt="edit icon"
                                          />
                                        </Link>
                                      </span>
                                      <span onClick={() => handleCloseDeleteModal(row)}>
                                        <img
                                          src={require("./images/delet.png")}
                                          alt="delete icon"
                                        />
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                  {/* Medical message modal */}
                                  {
                                    <Modal
                                      open={openModel}
                                      onClose={closeModel}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                    >
                                      <Box
                                        sx={{ ...style1, width: 833 }}
                                        className="medical-message"
                                      >
                                        <Box onClick={closeModel}>
                                          <CancelOutlinedIcon />
                                        </Box>
                                        <Typography
                                          id="modal-modal-title"
                                          variant="h6"
                                          component="h2"
                                        >
                                          {}
                                          <strong>Student Name: </strong>
                                          <span>
                                            {medicalRow.name} {medicalRow.lastName} S/o{" "}
                                            {medicalRow.fatherName} {medicalRow.lastName}
                                          </span>
                                        </Typography>
                                        <Typography
                                          id="modal-modal-description"
                                          sx={{ mt: 2 }}
                                        >
                                          <strong>Medical Message </strong>
                                          <div id="medical" name="medical">
                                            {" "}
                                            {medicalRow.medical}
                                          </div>
                                        </Typography>
                                      </Box>
                                    </Modal>
                                  }
                                  {/* Delete student modal */}
                                  {
                                    <Modal
                                      open={openModelDelete}
                                      onClose={handleCloseDeleteModal}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style1,
                                          width: 500,
                                          textAlign: "center",
                                        }}
                                      >
                                        <Box>
                                          <CancelOutlinedIcon
                                            sx={{
                                              fontSize: "4.5rem !important",
                                              fill: "red",
                                            }}
                                          />
                                        </Box>
                                        <Typography
                                          id="modal-modal-title"
                                          component="h1"
                                        >
                                          Are you sure?
                                        </Typography>
                                        <Typography
                                          id="modal-modal-description"
                                          component={"subtitle2"}
                                        >
                                          Do you really want to delete the
                                          student{" "}
                                          <strong>
                                            {capitalizeFirstLetter(deleteStudentDetail.name)} {capitalizeFirstLetter(deleteStudentDetail.lastName)}
                                          </strong> ?
                                        </Typography>
                                        <Box
                                          marginTop={"30px"}
                                          className="button-action"
                                        >
                                          {!loading1 ? (
                                            <Button
                                              variant="contained"
                                              className="delete-button"
                                              size="large"
                                              onClick={() =>
                                                handleStuDelete(deleteStudentDetail._id)
                                              }
                                            >
                                              Delete
                                            </Button>
                                          ) : (
                                            <>
                                              <Button
                                                variant="contained"
                                                size="large"
                                                disabled
                                              >
                                                Delete
                                              </Button>
                                              <Example1 />
                                            </>
                                          )}

                                          <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={handleCloseDeleteModal}
                                            sx={{
                                              marginLeft: "15px",
                                              borderColor: "text.primary",
                                              color: "text.primary",
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                        </Box>
                                      </Box>
                                    </Modal>
                                  }
                                </React.Fragment>
                              );
                            })
                        )
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6}>Record not found</TableCell>
                        </TableRow>
                      )}
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
                  count={filterr.length}
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
            <Example />
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
          <Box className="emergency" sx={{ ...style1, width: 400 }}>
            <h2 id="parent-modal-title">Emergency No.</h2>
            {emergencyVal.map((item) => {
              return (
                <div className="emergency-data" key={item._id}>
                  <InputField
                    type="text"
                    value={item.Ename}
                    inputprops={true}
                  />

                  <a href={`tel:+${item.number}`}>
                    {" "}
                    <InputField
                      type="text"
                      value={item.number}
                      inputprops={true}
                    />
                  </a>
                </div>
              );
            })}
            <Button className="cross" onClick={handleClose}>
              <img src={cross} className="" alt="logo" />
            </Button>
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          open={openMedical}
          onClose={handleCloseMedical}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style1, width: 500, padding: "55px" }}>
            <h2 id="parent-modal-title" style={{ textAlign: "center" }}>
              Enter Your Pin
            </h2>
            <div style={{ textAlign: "center" }}>
              <PinInput
                length={4}
                initialValue=""
                type="password"
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
            <div className="pinDivDesign">
              <button
                type="button"
                className="btn btn-transparent pinButtonDesign"
                onClick={handleCloseMedical}
              >
                CANCEL
              </button>
              {!loading1 ? (
                <button
                  type="submit"
                  className="btn btn-primary pinButtonDesign"
                  onClick={handleMedicalByPin}
                >
                  SUBMIT
                </button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    className="btn pinButtonDesign"
                    disabled
                  >
                    SUBMIT
                  </Button>
                  <LoaderButton />
                </>
              )}
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
