import React, {useState,useEffect} from 'react';
import Sidebar from './sidebar';
import ImageAvatars, { handleLogout } from './header';
import {Container,TableBody,Table,TableCell,TableContainer,TableHead,TablePagination,TableRow,FormControlLabel,Switch,Modal,Backdrop,Fade,Box, Typography, Button} from '@mui/material';
import { API } from '../config/config';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from '../comman/loader';
import Loader1 from '../comman/loader1';
import SearchBar from 'material-ui-search-bar';
import axios from 'axios';
import { authHeader } from '../comman/authToken';
import manageclass from "./images/manage-class.svg";
import $ from "jquery";
import "./css/student.css";
import "react-toastify/dist/ReactToastify.css";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Example1 from '../comman/loader1';
import { capitalizeFirstLetter } from '../comman/capitalizeFirstLetter';
toast.configure();
 
    const ManageClass = () => {
        
        const [classDetail, setClassDetail] = useState([]);
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [page, setPage] = useState(0);
        const [dense, setDense] = useState(false);
        const [loading, setLoading] = useState(true);
        const [Editloading, setEditLoading] = useState(false);
        const [Addloading, setAddLoading] = useState(false);
        const [search,setSearch]=useState('');
        const [nameC,setNameC]=useState('');
        const [openmodel,setOpenmodel]=useState(false);
        const [openModelEdit,setOpenmodelEdit]=useState(false);
        const [getClassNameId,setClassNameId]=useState('');
        const [counsellorDetail,setCounsellorDetail]=useState([]);
        const [openModelClassDelete, setOpenModelClassDelete] = useState(false);
        const [selectedClassDetail, setSelectedClassDetail] = useState('');
        const [studentDetail, setStudentDetail] = useState([]);


        const handleCloseClassDeleteModal = (classDetail,councellorDetail) => { 
           if(councellorDetail.length > 0 && classDetail?.totalStudents > 0) {
            toast.error(`Class is already associated with a counsellor/students`);
        }else if(classDetail?.totalStudents > 0) {
            toast.error(`Class is already associated with the students`);
        }else if(councellorDetail.length > 0) {
            toast.error(`Class is already associated with the counsellor`);
        }else{
            setOpenModelClassDelete(!openModelClassDelete)
            setSelectedClassDetail(classDetail)
        }
    }

        useEffect(() => {
            handleGetClass();
            setSearch('');
        }, [])

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
          }).catch((error) => {
            if (error.response.status === 401) {
                handleLogout()
              }
          })
      };

      const GetStudentData = async () => {
        
         await axios
          .get(`${API.getStudent}`, { headers: authHeader() })
          .then((res) => {
            setStudentDetail(res.data.data);
          })
          .catch((err) => {
            if (err?.response?.status === 401) {
              handleLogout();
            }
          })
      };
        
        const handleGetClass = async() =>{
            setLoading(true)
            await axios.get(`${API.getClass}`).then((res) => {
                    setLoading(false);
                    const filterData = res.data.data.filter((fil) => fil.className !== 'class unassigned')
                    setClassDetail(filterData)
                    handleGetUser();
                    GetStudentData()
                }).catch((err) => {
                    if (err.response.status === 401) {
                        handleLogout()
                      }
                      setLoading(false)
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
                    if (err.response.status === 401) {
                        handleLogout()
                      }
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
        const handleOpenEdit = (classname) => {setOpenmodelEdit( true ) ; setNameC(classname.className?.slice(6)); setClassNameId(classname._id)}
        console.log(classDetail,"selectedClassDetail")
        const handleCreateClass = async(e) => {
            e.preventDefault(); 
            
            if(nameC === ''){
                toast.error("Class name is required");
            }
            else {
                setAddLoading(true)
                  const requestData = {
                      className: `class ${nameC}`,
                    };
                    await axios({
                        method: "post",
                        url: `${API.createClass}`,
                        data: requestData,
                        headers: authHeader(),
                    }).then((res)=>{
                        toast.success(`${capitalizeFirstLetter(nameC)} created successfully`);
                        setOpenmodel( false);
                        handleGetClass();
                        setAddLoading(false)
                  }).catch((err) => {
                    if(err.response.data.message === "class already exists"){
                    toast.error("Classname already exists");
                    }else if (err.response.status === 401) {
                        handleLogout()
                    }else if(err.response.status === 400) {
                    toast.error(err.response.data.message);
                    }
                    else{
                    toast.error("Failed to created class");
                    }
                    setAddLoading(false)

                  });
              }
        };

        const handleEditClass = async(e) => {
            e.preventDefault();    
            
            if(nameC === ''){
                toast.error("Class name is required");
            }
            else {
                setEditLoading(true)
                  const requestData = {
                      className: `class ${nameC}`,
                    };
                    await axios({
                        method: "put",
                        url: `${API.updateClass}/${getClassNameId}`,
                        data: requestData,
                        headers: authHeader(),
                    }).then((res)=>{
                        setEditLoading(false)
                        toast.success(`Class name is updated successfully`);
                        setOpenmodelEdit( false);
                        handleGetClass();
                  }).catch((err) => {
                    if(err.response.data.message === "class already exists"){
                    toast.error("Classname already exists");
                    }else if (err.response.status === 401) {
                        handleLogout()
                      }
                    else{
                    toast.error("Failed to created class");
                    }
                    setEditLoading(false)
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
                        },
                    },
                    messages: {
                        class: {
                          required: "<p style='color:red'>Class name is required</P>",
                        },
                    }
                })
            });

          $('input[name="class"]').keyup(function (e) {
            if (/[^A-Za-z0-9-\s]/g.test(this.value)) {
                this.value = this.value.replace(/[^A-Za-z0-9-\s]/g, "");
              }
          });
        }

        const handleDeleteClass = async() => {

                setLoading(true);
                fetch(`${API.deleteClass}/${selectedClassDetail?._id}`, {
                  method: "DELETE",
                  headers: authHeader(),
                }).then((a) => {
                  if (a.status === 200 || a.status === 201) {
                    setOpenModelClassDelete(!openModelClassDelete)
                    toast.success(`Class is deleted successfully`);
                    handleGetClass();
                  }else {
                    setOpenModelClassDelete(!openModelClassDelete)
                    toast.error("Failed to delete class");
                  }
                  setLoading(false);
                }).catch((err) => {
                    if (err.response.status === 401) {
                        handleLogout()
                      }
                })
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
    const classnamee = selectedClassDetail?.className?.slice(6)

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
                {
                                   <Modal
                                         open={openModelClassDelete}
                                         onClose={() => handleCloseClassDeleteModal('',[])}
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
                                               <strong> { selectedClassDetail && capitalizeFirstLetter(classnamee)}</strong> ?
                                             </Typography>
                                           <Box marginTop={'30px'}>
                                          
                                          
                                             {!loading ? (
                                               <Button variant="contained" size="large" onClick={handleDeleteClass}>Delete</Button>
                                             ) : (
                                               <>
                                             <Button variant="contained" size="large" disabled>Delete</Button> 
                                             <Loader1 />
                                               </>
                                             )}                                       
                                              <Button variant='outlined' size="large"  onClick={() => setOpenModelClassDelete(!openModelClassDelete)} sx={{marginLeft:'15px',borderColor:'text.primary',color:'text.primary'}}>
                                               Cancel
                                             </Button>
                                            
                                           </Box>
                                         </Box>
                                       </Modal>
                                        }
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
                                        <TableCell align="center" >
                                                Counsellor
                                                 
                                                </TableCell>
                                                <TableCell align="center" >
                                                   Students
                                                 
                                                </TableCell>
                                        <TableCell style={{ textAlign: "center" }}>
										Action
									</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classDetail.length > 0 ? classDetail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item,index) => {
                                       const counDetail = counsellorDetail.filter((ccitem) => {return ccitem?.classId?._id === item?._id})
                                    
                                    const tableclassnamee = item.className?.slice(6)
                                        return (
                                           
                                            <TableRow key={item && item._id}>
                                                
                                                 <TableCell  > {" "}{tableclassnamee?.charAt(0).toUpperCase() + tableclassnamee.slice(1)}</TableCell>
                                                 <TableCell  > {" "}{counDetail.length > 0 ? capitalizeFirstLetter(counDetail[0]?.name) :''}  {counDetail.length > 0 ? capitalizeFirstLetter(counDetail[0]?.lastname): ''}</TableCell>
                                                 <TableCell  > {" "}{item.totalStudents ? item.totalStudents : 0}</TableCell>
                                                
                                                <TableCell align="center" className='action' style={{ width: "150px", }}>
                                                <span onClick={() => handleOpenEdit(item)}><img src={require('./images/edit.png')} alt="Edit icon" /></span>
                                                    <span onClick={() => handleCloseClassDeleteModal(item,counDetail)}><img src={require('./images/delet.png')} alt="Delete icon" /></span>
                                                 
                                                </TableCell>            
                                            </TableRow>
                                     )
                                    }):  <Typography> Record Not found </Typography>}
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
                    </React.Fragment>:<Loader /> }
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
                        {Addloading ? <Example1/> :<input
                            type="submit"
                            className="btn btn-primary"
                            value="SAVE"
                        />}
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
                        {Editloading ? <Example1/> :<input
                            type="submit"
                            className="btn btn-primary"
                            value="UPDATE"
                        />}
                        </div>
                    </form>
                    </Box>
                </Fade>
                </Modal>
            </>
        );
    }


export default ManageClass