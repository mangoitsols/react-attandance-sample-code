import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ImageAvatars, { handleLogout } from "./header";
import Container from "@mui/material/Container";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { API } from "../config/config";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Loader from "../comman/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import { authHeader } from "../comman/authToken";
import counsellor from "../images/counsellor.svg";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import "./css/student.css";
import Example1 from "../comman/loader1";

toast.configure();

export function handleEdit(edit) {
  return edit;
}
export default function Counsellor() {
  const [counsellorDetail, setCounsellorDetail] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModelDelete, setOpenModelDelete] = useState(false);
  const [selectedCouncellorDetail, setSelectedCouncellorDetail] =
    useState("false");

  useEffect(() => {
    handleGetUser();
    setSearch("");
  }, []);

  const handleGetUser = () => {
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleDelete = (id) => {
    setLoading(!loading);
    fetch(`${API.deleteUser}/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    })
      .then((a) => {
        if (a.status === 200 || a.status === 201) {
          setLoading(false);
          handleGetUser();
          toast.success("Deleted successfully");
          handleCloseDeleteModal("");
        } else {
          setLoading(true);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          handleLogout();
        }
      });
  };

  const handleSearch = async (data) => {
    setSearch(data);
    if (data !== "") {
      await axios
        .get(`${API.counsellorSearch}/${data}`, { headers: authHeader() })
        .then((data) => {
          const dataCouncellor = data.data.data.filter(
            (e) => e.role.name === "counsellor"
          );
          setCounsellorDetail(dataCouncellor);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            handleLogout();
          }
          setCounsellorDetail([]);
        });
    } else {
      handleGetUser();
    }
  };

  const handleCloseDeleteModal = (data) => {
    setOpenModelDelete(!openModelDelete);
    setSelectedCouncellorDetail(data);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - counsellorDetail.length)
      : 0;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
  };

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
          <div className="heading">
            <h1>
              <span className="counsellor-logo">
                <img src={counsellor} className="" alt="logo" />
              </span>
              Counsellor
            </h1>
            <div>
              <a href="addCounsellor">ADD COUNSELLOR</a>
            </div>
          </div>
          <div className="search">
            <div>
              <SearchBar
                value={search}
                onChange={(newValue) => handleSearch(newValue)}
                placeholder="Search Counsellor"
              />
            </div>
          </div>

          {!loading ? (
            <React.Fragment>
              <div className="counselloTabel" style={{ width: "100%" }}>
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          Class
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {counsellorDetail.length > 0 ? (
                        counsellorDetail
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item) => {
                            const renameClassName = item && item.classId && item.classId.className?.slice(6);
                            const capitalFirstLetterClassName = renameClassName?.charAt(0)?.toUpperCase() + renameClassName?.slice(1);
                            return (
                              <TableRow key={item && item._id}>
                                <TableCell>
                                  {" "}
                                  {item &&
                                    item.name.charAt(0).toUpperCase() +
                                      item.name.slice(1)}{" "}
                                  {item &&
                                    item.lastname.charAt(0).toUpperCase() +
                                      item.lastname.slice(1)}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  style={{ width: "100px" }}
                                >
                                  {capitalFirstLetterClassName}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  className="action"
                                  style={{ width: "150px" }}
                                >
                                  <span>
                                    <Link
                                      to={`/editCounsellor/${item && item._id}`}
                                    >
                                      <img
                                        src={require("./images/edit.png")}
                                        alt="Edit icon"
                                      />
                                    </Link>
                                  </span>
                                  <span>
                                    <img
                                      src={require("./images/delet.png")}
                                      alt="Delete icon"
                                      onClick={() =>
                                        handleCloseDeleteModal(item)
                                      }
                                    />
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <TableCell colSpan={3} style={{ textAlign: "center" }}>
                          Record Not found
                        </TableCell>
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
                  rowsPerPageOptions={[5, 10, 15]}
                  component="div"
                  count={counsellorDetail.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  rows={counsellorDetail}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <FormControlLabel
                  control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                  }
                  label="Dense padding"
                />
              </div>
            </React.Fragment>
          ) : (
            <Loader />
          )}
        </Container>
        {
                                   <Modal
                                         open={openModelDelete}
                                         onClose={() => handleCloseDeleteModal('')}
                                         aria-labelledby="modal-modal-title"
                                         aria-describedby="modal-modal-description"
                                       >
                                         <Box sx={{ ...style,width: 600, textAlign:'center' }}>
                                           <Box>
                                                   <CancelOutlinedIcon sx={{fontSize:'4.5rem !important', fill:'red !important'}}/>
                                           </Box>
                                           <Typography
                                             id="modal-modal-title"
                                             component="h1"
                                             
                                           >
                                             Are you sure? 
                                           </Typography>
                                           <Typography
                                             id="modal-modal-description"
                                             component={'subtitle2'}>
                                               Do you really want to delete the counsellor  
                                               <strong> { selectedCouncellorDetail &&
                                       selectedCouncellorDetail?.name?.charAt(0).toUpperCase() +
                                         selectedCouncellorDetail?.name?.slice(1) }{' '} 
                                     { selectedCouncellorDetail &&
                                       selectedCouncellorDetail?.lastname?.charAt(0).toUpperCase() +
                                         selectedCouncellorDetail?.lastname?.slice(1)}</strong> ?
                                             </Typography>
                                           <Box marginTop={'30px'} className="button-action" >
                                          
                                          
                                             {!loading ? (
                                               <Button variant="contained" size="large" className="delete-button" onClick={() => handleDelete(selectedCouncellorDetail && selectedCouncellorDetail?._id)}>Delete</Button>
                                             ) : (
                                               <>
                                             <Button variant="contained" size="large" disabled>Delete</Button> 
                                             <Example1 />
                                               </>
                                             )}
                                          
                                       
                                              <Button variant='outlined' size="large"  onClick={() => handleCloseDeleteModal('')} sx={{marginLeft:'15px',borderColor:'text.primary',color:'text.primary'}}>
                                               Cancel
                                             </Button>
                                            
                                           </Box>
                                         </Box>
                                       </Modal>
                                        }
      </div>
    </>
  );
}
