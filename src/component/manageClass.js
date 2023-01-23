import React, {useState,useEffect} from 'react';
import Sidebar from './sidebar';
import ImageAvatars from './header';
import {Container,TableBody,Table,TableCell,TableContainer,TableHead,TablePagination,TableRow,FormControlLabel,Switch,Modal,Backdrop,Fade,Box} from '@mui/material';
import { API } from '../config/config';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Example from '../comman/loader';
import SearchBar from 'material-ui-search-bar';
import axios from 'axios';
import { authHeader } from '../comman/authToken';
import manageclass from "./images/manage-class.svg";
import $ from "jquery";
import "./css/student.css";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
 
    const ManageClass = () => {
        
        const [classDetail, setClassDetail] = useState([]);
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [page, setPage] = useState(0);
        const [dense, setDense] = useState(false);
        const [loading, setLoading] = useState(true);
        const [search,setSearch]=useState('');
        const [nameC,setNameC]=useState('');
        const [openmodel,setOpenmodel]=useState(false);
        const [openModelEdit,setOpenmodelEdit]=useState(false);
        const [getClassNameId,setClassNameId]=useState('');
        

    
        useEffect(() => {
            handleGetClass();
            setSearch('');
        }, [])
        
        const handleGetClass = async() =>{
            await axios.get(`${API.getClass}`).then((res) => {
                    setLoading(false);
                    setClassDetail(res.data.data)
                }).catch((err) => {
                })
            }
            
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
        
        const handleSearch = async(data) =>{
            setSearch(data);
            if(data !== ""){
                await axios
                .get(`${API.searchClass}/${data}`,{headers:authHeader()})
                .then((data) => {
                    setClassDetail(data.data.data)	
                })
                .catch((err) => {
                    setClassDetail([])	
                });
            }
            else { 
                handleGetClass();
            } 
        }
     
        
        const handleClose = () => setOpenmodel( false);
        const handleOpen = () => setOpenmodel( true );
        const handleCloseEdit = () => setOpenmodelEdit( false);
        const handleOpenEdit = (classname) => {setOpenmodelEdit( true ) ; setNameC(classname.className); setClassNameId(classname._id)}
        
        const handleCreateClass = async(e) => {
            e.preventDefault(); 
            
            if(nameC === ''){
                toast.error("Please provide classname");
            }
            else if (!nameC.startsWith("class")) {
                toast.error("Classname must be start with class then space ex: 'class G'");
            }
            else if(nameC.charAt(6) === " "){
                toast.warning("Given classname is not in correct format ex- 'class G'")
            }
            else if(nameC.charAt(5) !== " "){
                toast.warning("Given classname is not in correct format ex- 'class G'")
            }
            else {
                  const requestData = {
                      className: (nameC.slice(0,-1) +  nameC.charAt(6).toUpperCase()),
                    };
                    await axios({
                        method: "post",
                        url: `${API.createClass}`,
                        data: requestData,
                        headers: authHeader(),
                    }).then((res)=>{
                        toast.success("Classname created successfully");
                        setOpenmodel( false);
                        handleGetClass();
                  }).catch((err) => {
                    if(err.response.data.message === "class already exists"){
                    toast.error("Classname already exists");
                    }
                    else{
                    toast.error("Failed to created class");
                    }
                  });
              }
        };

        const handleEditClass = async(e) => {
            e.preventDefault();    
            
            if(nameC === ''){
                toast.error("Please provide classname");
            }
            else if (!nameC.startsWith("class")) {
                toast.error("Classname must be start with class then space ex: 'class G'");
            }
            else if(nameC.charAt(6) === " "){
                toast.warning("Given classname is not in correct format ex- 'class G'")
            }
            else if(nameC.charAt(5) !== " "){
                toast.warning("Given classname is not in correct format ex- 'class G'")
            }
            else {
                  const requestData = {
                      className: (nameC.slice(0,-1) +  nameC.charAt(6).toUpperCase()),
                    };
                    await axios({
                        method: "put",
                        url: `${API.updateClass}/${getClassNameId}`,
                        data: requestData,
                        headers: authHeader(),
                    }).then((res)=>{
                        toast.success("Classname updated successfully");
                        setOpenmodelEdit( false);
                        handleGetClass();
                  }).catch((err) => {
                    if(err.response.data.message === "class already exists"){
                    toast.error("Classname already exists");
                    }
                    else{
                    toast.error("Failed to created class");
                    }
                  });
              }
        };

        const handleOnChange = (e) => {
            setNameC(e.target.value)
           
            $(document).ready(function () {
                $("#addClass").validate({
                  rules: {
                    class: {
                      required: true,
                      minlength: 7, 
                      maxlength: 7
                        },
                    },
                    messages: {
                        class: {
                          required: "<p style='color:red'>Please enter classname</P>",
                          minlength:"<p style='color:red'>Classname must be 7 characters</p>",
                          maxlength:"<p style='color:red'>Classname must be 7 characters</p>",
                        },
                    }
                })
            });

          $('input[name="class"]').keyup(function (e) {
            if (/[^A-Za-z\s]/g.test(this.value)) {
              this.value = this.value.replace(/[^A-Za-z\s]/g, "");
            }
          });
        }

         const style = {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: "15px",
              p: 4,
            };
    
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - classDetail.length) : 0;
    
        return (
            <>
                
            <Sidebar />
            <div className='col-md-8 col-lg-9 col-xl-10 mr-30'>
                <div className='header'> <ImageAvatars /></div>
                <Container maxWidth="100%" style={{ padding: "0", display: "inline-block" }}>
                    <div className='heading'>
                        <h1>
                            <span className='counsellor-logo'><img src={manageclass} className="" alt="logo" /></span>
                            Manage Classes
                        </h1>
                        <Link to='' onClick={handleOpen}>ADD NEW CLASS</Link>
                    </div>
                    <div className='search'>
                        <div>
                        <SearchBar
                            value={search}
                            onChange={(newValue) => handleSearch( newValue )}
                            placeholder='Search Class '/>
                        </div>
                    </div>
    
            {!loading ? <React.Fragment> 
                    <div className='counselloTabel' style={{ width: "100%" }}>
                        <TableContainer>
                            <Table sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell >
                                            Classname
                                        </TableCell>
                                        <TableCell style={{ textAlign: "center" }}>
										Action
									</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classDetail.length > 0 ? classDetail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                                    
                                        return (
                                            <TableRow key={item && item._id}>
                                                
                                                 <TableCell  > {" "}{item && item.className.charAt(0).toUpperCase() + item.className.slice(1)}</TableCell>
                                                
                                                <TableCell align="center" className='action' style={{ width: "150px", }}>
                                                    <span onClick={() => handleOpenEdit(item)}><img src={require('./images/edit.png')} alt="Edit icon" /></span>
                                                 
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }): <p>Record Not found</p>}
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
                            count={classDetail.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            rows={classDetail}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <FormControlLabel
                            control={<Switch checked={dense} onChange={handleChangeDense} />}
                            label="Dense padding"
                        />
                    </div>
                    </React.Fragment>:<Example/> }
                </Container>
            </div>
            {/* ADD NEW CLASSES */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openmodel}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                >
                <Fade in={openmodel}>
                    <Box sx={style}>
                    <form className="mui-form" id="addClass" onSubmit={handleCreateClass}>
                        <legend>Add new class</legend>
                        <div className="mui-textfield">
                        <input
                            type="text"
                            placeholder="Enter class name"
                            onChange={(e) => handleOnChange(e)}
                            name="class"
                        />

                        </div>
                        <div className="btndesign text-right">
                        <button
                            type="button"
                            className="btn btn-transparent"
                            onClick={handleClose}
                        >
                            CLOSE
                        </button>
                        <input
                            type="submit"
                            className="btn btn-primary"
                            value="SAVE"
                        />
                        </div>
                    </form>
                    </Box>
                </Fade>
                </Modal>

                {/* EDIT CLASSES */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModelEdit}
                onClose={handleCloseEdit}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                >
                <Fade in={openModelEdit}>
                    <Box sx={style}>
                    <form className="mui-form" id="addClass" onSubmit={handleEditClass}>
                        <legend>Edit Classname</legend>
                        <div className="mui-textfield">
                        <input
                            type="text"
                            placeholder="class E"
                            onChange={(e) => handleOnChange(e)}
                            name="class"
                            value={nameC}
                        />

                        </div>
                        <div className="btndesign text-right">
                        <button
                            type="button"
                            className="btn btn-transparent"
                            onClick={handleCloseEdit}
                        >
                            CLOSE
                        </button>
                        <input
                            type="submit"
                            className="btn btn-primary"
                            value="UPDATE"
                        />
                        </div>
                    </form>
                    </Box>
                </Fade>
                </Modal>
            </>
        );
    }


export default ManageClass