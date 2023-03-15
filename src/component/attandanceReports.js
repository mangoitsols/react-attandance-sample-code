import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ImageAvatars, { handleLogout } from "./header";
import Container from "@mui/material/Container";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { API, SOCKET_URL } from "../config/config";
import { Link, useParams ,useNavigate} from "react-router-dom";
import Loader from "../comman/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
	FormControl,
	NativeSelect,
	TableRow,
	TableCell,
	TableContainer,
	TableHead,
	TableBody,
	Table,
	Tooltip,
} from "@mui/material";
import moment from "moment";
import { authHeader } from "../comman/authToken";
import {
	format,
	addDays,
	lastDayOfWeek,
	lastDayOfMonth,
	addWeeks,
	subWeeks,
	subDays,
	addMonths,
	subMonths,
} from "date-fns";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from "material-ui-search-bar";
import html2pdf from "html2pdf-jspdf2";
import Example1 from "../comman/loader1";
import  io  from "socket.io-client";
toast.configure();

export default function AttandanceReport(props) {

	const [loadingDismiss, setLoadingDismiss] = useState(false);
	const [loadingAttendance, setLoadingAttendance] = useState(false);
	const [loading, setLoading] = useState(true);
	const [attandanceData, setattandanceData] = useState([]);
	const [classData, setClassData] = useState([]);
	const [onSelectData, setOnSelectData] = useState("");
	const [monthData, setMonthData] = useState('today');
	const [counsellorName, setCounsellorName] = useState("");
	const [calenderDate, setCalenderDate] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [currentMonthNew, setCurrentMonthNew] = useState(new Date());
	const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
	const [startDateOfMonth, setStartDateMonth] = useState(getFirstDayOfMonth(new Date()));
	const [search, setSearch] = useState("");
	let classNameId = localStorage.getItem("className");

	useEffect(() => {
		handleAttandanceReport(finalId, monthData,'','','',calenderDate);
		GetClassData();
		handleCounsellorNameByClassId(finalId);
	}, []);

	const { id } = useParams();

	let finalId = id ? id : classNameId;

	// Today Data render start

	const handleStuDismiss = async(row) => {

		var socket = io.connect(SOCKET_URL);
		socket.on("connected", () => {});

		var date = new Date();
		var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
		var am_pm = date.getHours() >= 12 ? "PM" : "AM";
		hours = hours < 10 ? "0" + hours : hours;
		var minutes =
		  date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		var seconds =
		  date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
	
		if (row && row.dismiss) {
			toast.error(`${row && row.name} ${row && row.lastName} is already dismissed`);
		} else {
		  const reqData = {
			id: [row._id],
			time: new Date(),
		  };
		  setLoadingDismiss(true);
		  await axios({
			method: "post",
			url: `${API.studentDismiss}`,
			data: reqData,
			headers: authHeader(),
		  }).then((request) => {
			socket.emit("sendNotificationDismiss", row);
			setLoadingDismiss(false);
			toast.success(`Student Dismissed`);
			handleAttandanceReport(row.assignClass,'today','','','',calenderDate);
			}).catch((err) => {
			  if (err?.response?.status === 401) {
				handleLogout();
			  }
			  setLoadingDismiss(false);
			  toast.error(`${row && row.name} ${row && row.lastName} Dismissed Failed`);
			});
		}
	  };

	const renderCellsToday = () => {
		
		const todayDate = moment(calenderDate).format('DD/MM/YYYY')
		return(
			<div id="weekpdf" className="counselloTabel" style={{ width: "100%" }}>
				<TableContainer>
					<Table >
						<TableHead>
							<TableRow>
								<TableCell style={{ textAlign: "center" }}>
									Student Name
								</TableCell>
								<TableCell style={{ textAlign: "center" }}>
									Attendence
								</TableCell>
								<TableCell style={{ textAlign: "center" }}>
									Action
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{!loadingAttendance ? attandanceData && attandanceData.length > 0 ? attandanceData.map((item) => {
				
								
								return (
									
									<TableRow >
										

										<TableCell style={{ textAlign: "center" }}>
										{item.studentId && item.studentId.name}{" "}{item.studentId && item.studentId.lastName}
										</TableCell>
										{item.attandan.length > 0 ? item.attandan?.map((attn)=> { 
										const dateCreated = moment(attn.createdAt).format('DD/MM/YYYY')
										return(
											<>
											{todayDate === dateCreated ? 
										<TableCell style={{ textAlign: "center" }}>
										{ moment(item.studentId.dismiss).format('DD/MM/YYYY') === dateCreated && item.studentId.dismiss !== null ? "D" : attn.attendence === null || attn.attendence === "0" ? "A" : attn.attendence === "1" ? "P" : '-' }
										</TableCell>
										
										:search !== ''?<TableCell style={{ textAlign: "center" }}>-</TableCell>:null}

										</> 
										)}):<TableCell style={{ textAlign: "center" }}>- </TableCell>}

										 {item.attandan.length > 0 ? item.attandan.map((attn)=> { 
										const dateCreated = moment(attn.createdAt).format('DD/MM/YYYY')
										const CurrentDayDate = moment().format('DD/MM/YYYY')
										
											 return ( 
												todayDate === dateCreated ? 
												attn &&  attn.attendence &&  (attn.attendence !== null || attn.attendence !== "0") && dateCreated === CurrentDayDate ? 
												<TableCell style={{ textAlign: "center" }}>	<span onClick={() => handleStuDismiss(item.studentId)}  > <img  src={require("./images/dismiss.png")}  alt="dismiss icon"/> </span></TableCell>
											   :<TableCell style={{ textAlign: "center" }}> </TableCell>:null
									  	 )}): <TableCell style={{ textAlign: "center" }}> </TableCell>} 
									</TableRow>
								)}
							):<TableRow><TableCell colspan={3} style={{ textAlign: "center" }}>Record not found</TableCell></TableRow>:<Example1/>}
						</TableBody>
					</Table>
				</TableContainer>

			</div>

		)
	}

	// Today data render end

	// Week Data render start
	function getFirstDayOfWeek(d) {
		const date = new Date(d);
		const day = date.getDay(); // 👉️ get day of week
		const diff = date.getDate() - day + (day === 0 ? -6 : 1);
		return new Date(date.setDate(diff));
	}

	const changeWeekHandle = (btnType) => {
		if (btnType === "prev") {
			setStartDate((date) => {
				return subDays(date, 7);
			});
			let sd = subDays(startDate, 7);
			let ld = addDays(sd, 6);
			setCurrentMonth(subWeeks(currentMonth, 1));
			handleAttandanceReport(onSelectData? onSelectData: id, "week",sd,ld,'',calenderDate);
		}
		if (btnType === "next") {
			setStartDate((date) => {
				return addDays(date, 7);
			});
			let sd = addDays(startDate, 7);
			let ld = addDays(sd, 6);
			setCurrentMonth(addWeeks(currentMonth, 1));
			handleAttandanceReport(onSelectData? onSelectData: id, "week",sd,ld,'',calenderDate);
		}
	};
	const ExampleCustomInput = ({ value, onClick }) => {
		return <CalendarTodayIcon onClick={onClick} />;
	};

	const renderCellsWeek = () => {
		const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
		const dateFormat = "d ";
		const dateFormatMonth = " MMM ";
		const dateFormatWeek = "EEE";
		const rows = [];
		let days = [];
		let day = startDate;
		let formattedDate = "";
		let formattedDateMonth = "";
		let formattedDateWeek = "";
		
		for (let i = 0; i < 7; i++) {
			formattedDate = format(day, dateFormat);
			formattedDateMonth = format(day, dateFormatMonth);
			formattedDateWeek = format(day, dateFormatWeek);
			days.push(
				<div
				key={day}
				
				style={{ display: "inline-block" }}
				>
					<div >{formattedDateWeek}</div>
					<div >{formattedDate}</div>
					<div>{formattedDateMonth}</div>
				</div>
			);
			day = addDays(day, 1);
		}
		rows.pop();
		rows.push(<div key={day}>{days}</div>);
		days = [];
		
		return (
			<div id="weekpdf" className="counselloTabel" style={{ width: "100%" }}>
				<TableContainer>
					<Table >
						<TableHead>
							<TableRow>
								<TableCell style={{ textAlign: "center" }}>
									Student Name
								</TableCell>
								{rows[0].props.children.map((res) => {
									return (
										<TableCell style={{ textAlign: "center" }}> {moment(res.key).format("DD MMM YYYY")} </TableCell>
									)
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{!loadingAttendance ? attandanceData && attandanceData.length > 0 ? attandanceData.map((item) => {
								return (
									
									<TableRow >
										<TableCell style={{ textAlign: "center" }}>
										{item.studentId && item.studentId.name}{" "}{item.studentId && item.studentId.lastName}
										</TableCell>
										{rows[0].props.children.map((week) => {
											
											return (
												moment(week.key).format("ddd") === "Sat" || moment(week.key).format("ddd") === "Sun" ?
												<TableCell style={{ textAlign: "center" }} > Leave </TableCell> :
												item.attandan.length === 0 ?  <TableCell style={{ textAlign: "center" }} > - </TableCell>:
												<TableCell   style={{ textAlign: "center" }}>
													{ 
													(
														item.attandan.map((e) => {
															if(moment(e.createdAt).format("YYYY-MM-DD") === moment(week.key).format("YYYY-MM-DD")){
																return moment(item.studentId.dismiss).format('YYYY-MM-DD') === moment(e.createdAt).format("YYYY-MM-DD") && item.studentId.dismiss !== null ? "D" : e.attendence === null || e.attendence === "0" ? "A" : e.attendence === "1" ? "P" : "";
															}
															// else{
															// 	return "no"; 
															// }
														})
													)

													}
												</TableCell>
											)})}
									</TableRow>
								)}
							):<TableRow ><TableCell colspan={8} style={{ textAlign: "center" }}>Record not found</TableCell></TableRow>:<Example1/>}
						</TableBody>
					</Table>
				</TableContainer>

			</div>
		)};
	//week data render end

	//Month data render start
	function daysInMonth(iMonth, iYear) {
		return new Date(iYear, iMonth, 0).getDate();
	}

	function getFirstDayOfMonth(d) {
		const date = new Date(d);
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		return new Date(date.setDate(format(firstDay, "d")));
	}

	const renderCellsMonth = (btnType) => {
		const dateFormat = "d ";
		const dateFormatMonth = " MMM ";
		const dateFormatWeek = "EEE";
		const rows = [];
		let days = [];
		let day = startDateOfMonth;
		let formattedDate = "";
		let formattedDateMonth = "";
		let formattedDateWeek = "";
		let daysCount;

		if (btnType === "prev") {
			let changee = subMonths(currentMonthNew, 1);
			daysCount = daysInMonth(format(changee, "M"), format(changee, "yyyy"));
			setCurrentMonthNew(changee);
			setStartDateMonth((date) => {
				return subDays(date, daysCount);
			});
			let sd = subDays(startDateOfMonth, daysCount);
			let ld = addDays(sd, daysCount);
			handleAttandanceReport(onSelectData? onSelectData: id, "month",sd,ld,'',calenderDate);
		} else if (btnType === "next") {
			setCurrentMonthNew(addMonths(currentMonthNew, 1));
			daysCount = daysInMonth(
				format(currentMonthNew, "M"),
				format(currentMonthNew, "yyyy")
			);
			setStartDateMonth((date) => {
				return addDays(date, daysCount);
			});
			let sd = addDays(startDateOfMonth, daysCount);
			let ld = addDays(sd, daysCount-1);

			handleAttandanceReport(onSelectData? onSelectData: id, "month",sd,ld,'',calenderDate);
		} else if (btnType === undefined) {
			daysCount = daysInMonth(
				format(currentMonthNew, "M"),
				format(currentMonthNew, "yyyy")
			);

		}

		for (let i = 0; i < daysCount; i++) {
			formattedDate = format(day, dateFormat);
			formattedDateMonth = format(day, dateFormatMonth);
			formattedDateWeek = format(day, dateFormatWeek);
			days.push(
				<div key={day} style={{ display: "inline-block" }}>
					<div>{formattedDateWeek}</div>
					<div>{formattedDate}</div>
					<div>{formattedDateMonth}</div>
				</div>
			);
			day = addDays(day, 1);
		}
		rows.pop();
		rows.push(<div key={day}>{days}</div>);
		days = [];


		return (
			
			<div className="counselloTabel" style={{ width: "100%" }}>
				<TableContainer>
					<Table >
						<TableHead>
							<TableRow>
								<TableCell style={{ textAlign: "center" }}>Student Name</TableCell>
								{rows[0].props.children.map((month) => {
									return (<TableCell style={{ textAlign: "center" }}> {moment(month.key).format("DD MMM YYYY")}</TableCell>);
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{!loadingAttendance ? attandanceData && attandanceData.length > 0 ? attandanceData.map((item) => {
									return (
										<>
											<TableRow key={item._id}>
												<TableCell style={{ textAlign: "center" }}>
													{item.studentId && item.studentId.name}{" "}{item.studentId && item.studentId.lastName}
												</TableCell >
												{rows[0].props.children.map((month) => {
													return (
														moment(month.key).format("ddd") === "Sat" || moment(month.key).format("ddd") === "Sun" ?
														<TableCell style={{ textAlign: "center" }} > Leave </TableCell> 
														: item.attandan.length === 0 ?  <TableCell   style={{ textAlign: "center" }}> - </TableCell> :(
														<TableCell  style={{ textAlign: "center" }}>															
																{item.attandan.map((e) => {
																	if (moment(e.createdAt).format("YYYY-MM-DD") === moment(month.key).format("YYYY-MM-DD")) {
																 		return  moment(item.studentId.dismiss).format('YYYY-MM-DD') === moment(e.createdAt).format("YYYY-MM-DD")  && item.studentId.dismiss !== null ? "D" : e.attendence === null || e.attendence === "0" ? "A" : e.attendence === "1" ? "P" : "-";
																	}
																})
															}
														</TableCell>
														)
								 					)
												})}
											</TableRow>
										</>
									);
								}):<TableRow ><TableCell colspan={32} style={{ textAlign: "center" }}>Record not found</TableCell></TableRow>:<Example1/>}	
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		)};

	//month data render end

	const GetClassData = async () => {
		await axios.get(`${API.getClass}`).then((response)=>{
			if (response.status === 200) {
				setLoading(false);
				const filterData = response.data.data.filter((fil) => fil.className !== 'class unassigned')
				setClassData(filterData);
			} else {
				setLoading(true);
			}

		}).catch((err) => {
			if (err.response.status === 401) {
				handleLogout()
			  }
		 });
	};

	const handleAttandanceReport = async (idd, byWhich,strd,endd,data,calenderDatee) => {
		console.log(idd,byWhich,strd,endd,data,calenderDatee)
		setSearch(data);

		setattandanceData([])
		if(byWhich === "week"){
			setLoadingAttendance(true)
			const requestData = {
				fromDate: moment(strd? strd:startDate).format("YYYY-MM-DD"),
				toDate:	moment(endd ? endd : lastDayOfWeek(currentMonth, { weekStartsOn: 1 })).format("YYYY-MM-DD"),
				searchName:data
			}
			await axios({
				method: "post",
				url: `${API.previousAttendanceReport}/${idd}`,
				data: requestData,
				headers: authHeader(),
			  }).then((res)=> {
				setLoadingAttendance(false);
				setattandanceData(res.data);
			}).catch((err) => {
				if (err.response.status === 401) {
					handleLogout()
				  }
				  setLoadingAttendance(false);
				toast.error("Failed to fetch week of data")
			 });

		}else if(byWhich === "month"){
			setLoadingAttendance(true);
			const requestData = {
				fromDate: moment(strd ? strd : startDateOfMonth).format("YYYY-MM-DD"),
				toDate:	moment(endd ? endd : lastDayOfMonth(currentMonthNew, { weekStartsOn: 1 })).format("YYYY-MM-DD"),
				searchName:data
			}
			await axios({
				method: "post",
				url: `${API.previousAttendanceReport}/${idd}`,
				data: requestData,
				headers: authHeader(),
			  }).then((res)=> {
				setLoadingAttendance(false);
				setattandanceData(res.data);
			}).catch((err) => {
				if (err.response.status === 401) {
					handleLogout()
				  }
				  setLoadingAttendance(false);
				toast.error("Failed to fetch month of data")
			 });
		}else if(byWhich === "today"){
			setLoadingAttendance(true);
			const requestData = {
				fromDate: moment(calenderDatee).format("YYYY-MM-DD"),
				toDate:	moment(calenderDatee).format("YYYY-MM-DD"),
				searchName:data
			}
			await axios({
				method: "post",
				url: `${API.previousAttendanceReport}/${idd}`,
				data: requestData,
				headers: authHeader(),
			  }).then((res)=> {
				setLoadingAttendance(false);
				setattandanceData(res.data);
			}).catch((err) => {
				if (err.response.status === 401) {
					handleLogout()
				  }
				  setLoadingAttendance(false);
				toast.error("Failed to fetch week of data")
			 });

		}
	};

	const SelectOnChange = async (ele) => {
		setOnSelectData(ele);
		localStorage.setItem("className", ele);

		if (ele === ele) {
			handleAttandanceReport(ele, monthData,'','','',calenderDate);
			handleCounsellorNameByClassId(ele);
		}
	};

	const handleDataAccWeekAndMonth = (data) => {
		if (data === "month") {
			setMonthData('month');
		} else if(data === 'today'){
			setMonthData('today');
		setCalenderDate(calenderDate);
		}else if(data === 'week'){
			setMonthData('week');
		}
		handleAttandanceReport(onSelectData ? onSelectData : id, data,'','','',calenderDate);

	};

	const handleCounsellorNameByClassId = async (idd) => {
		await axios
			.get(`${API.getCounsellorNameByClassId}/${idd}`, {
				headers: authHeader(),
			}).then((response) =>{
				setCounsellorName(response.data.data[0]);
			})
			.catch((err) => {
				if (err.response.status === 401) {
				handleLogout()
			  } });
	};

	const classNaam = classData.find((item) => {
		return item && item._id === (counsellorName && counsellorName.classId)
			? item.className
			: "";
	});

	const pdfClick = () => {
		if(monthData === 'month'){
			var opt = {
				margin:       1,
				filename:     'Attandance_report.pdf',
				image:        { type: 'jpeg', quality: 0.98 },
				html2canvas:  { scale: 2 },
				jsPDF:        { unit: 'cm', format: 'a2', orientation: 'landscape'}
			};
			var element = document.getElementById('main-div');
			html2pdf().set(opt).from(element).save();
		}else{
			var opt = {
				margin:       1,
				filename:     'Attandance_report.pdf',
				image:        { type: 'jpeg', quality: 0.98 },
				html2canvas:  { scale: 2 },
				jsPDF:        { unit: 'cm', format: 'a4', orientation: 'landscape'}
			  };
			var element = document.getElementById('main-div');
			html2pdf().set(opt).from(element).save();
		}
		
	}

	const HandleDate = (e)=> {
		if(e) {
			setCalenderDate(e)
			setMonthData('today')
	
		handleAttandanceReport(onSelectData ? onSelectData : id, 'today','','','',e);

		}
	  }

	return (
		<>
			<Sidebar />
			<div className="col-md-8 col-lg-9 col-xl-10 mr-30">
				<button onClick={pdfClick}>Download PDF</button> 
				<div className="header">  {" "}  <ImageAvatars />
				</div>
		
				{!loading ? (
					<div id="main-div">
						<Container maxWidth="100%"	style={{ padding: "0", display: "inline-block" }}>
							<div className="heading">
								<h1>
									<span className="icon">
										<DashboardIcon fontSize="35px" />
									</span>
									Attendance Reports
								</h1>
								<div>
									<label>Filter By:</label>
									<FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
										<NativeSelect
											defaultValue={id}
											onChange={(e) => SelectOnChange(e.target.value)}
											inputProps={{
												name: "age",
												id: "uncontrolled-native",
											}}
											className="w-100"
										>
											{classData.map((item) => {
												return (
													<option key={item._id} value={item._id}>
														{item.className?.slice(6)}
													</option>
												);
											})}
										</NativeSelect>
									</FormControl>
									<div style={{ display: "flex" ,  position: 'absolute',  top: '154px',fontSize: '13px'}} >

										{monthData === 'month'? <>

											{/* previous next functionality of Month */}
											<div style={{fontSize: 'smaller'}}>
												<div style={{ display: "inline-block",cursor:'pointer'}} onClick={() => renderCellsMonth("prev")}>
													<ArrowBackIosIcon  />
												Prev Month
												</div> | 
												{/* <div style={{ display: "inline-block" }}>
													<DatePicker
														placeholderText="Please select date of birth"
														name="dob"
														selected={calenderDate}
														onChange={(date) => HandleDate(date)}
														customInput={<ExampleCustomInput />}
														peekNextMonth
														showMonthDropdown
														showYearDropdown
														dateFormat="dd/MM/yyyy"
														dropdownMode="select"
														className="form-control"
														/> 
												</div> */}
												 <div style={{ display: "inline-block" ,marginLeft:'3px',cursor:'pointer'}} onClick={() => renderCellsMonth("next")}>
												 Next Month
													<ArrowForwardIosIcon />
												</div>
											</div></> : monthData === 'week' ?<>

											{/* previous next functionality of week */}
											<div style={{fontSize: '13px'}}>
												<div onClick={() => changeWeekHandle("prev")} style={{ display: "inline-block",cursor:'pointer' }}>
													<ArrowBackIosIcon
														
														/>
														Prev Week 
												</div> |
												{/* <div style={{ display: "inline-block" }}>
												<DatePicker
														placeholderText="Please select date of birth"
														name="dob"
														selected={calenderDate}
														onChange={(date) => HandleDate(date)}
														customInput={<ExampleCustomInput />}
														peekNextMonth
														showMonthDropdown
														showYearDropdown
														dateFormat="dd/MM/yyyy"
														dropdownMode="select"
														className="form-control"
														/> 
												</div> */}
											
												 <div style={{ display: "inline-block",marginLeft:'3px',cursor:'pointer' }} onClick={() => changeWeekHandle("next")}>
													 Next Week
													<ArrowForwardIosIcon
														
													/>
												</div>
											
											</div>
										</> : monthData === 'today' ? <div>
										<DatePicker
														placeholderText="Please select date of birth"
														name="dob"
														selected={calenderDate}
														onChange={(date) => HandleDate(date)}
														customInput={<ExampleCustomInput />}
														peekNextMonth
														showMonthDropdown
														showYearDropdown
														dateFormat="dd/MM/yyyy"
														dropdownMode="select"
														className="form-control"
														/> 
										</div> : null }
									</div>
								</div>
							</div>
							<div>
								<div>
									<span>{classNaam && classNaam.className?.slice(6)}</span> |{" "}
									<span>
										{counsellorName
											? `${counsellorName.name} ${counsellorName.lastname}`
											: `No Counsellor assign to this class`}
									</span>
								</div>
								<div>
								<div>
								<span onClick={() => handleDataAccWeekAndMonth("today")} style={{color:monthData === 'today'? '#007bff':'black' ,cursor:'pointer'}}>{moment(calenderDate).format('DD-MMM-YYYY') === moment().format('DD-MMM-YYYY') ? 'Today' : moment(calenderDate).format('DD-MMM-YYYY')}</span> |
								<span onClick={() => handleDataAccWeekAndMonth("week")} style={{color:monthData === 'week'? '#007bff':'black' ,cursor:'pointer'}}> Week{" "}  </span> | 
								<span onClick={() => handleDataAccWeekAndMonth("month")} style={{color:monthData === 'month'? '#007bff':'black' ,cursor:'pointer'}}>{" "} Month </span>
								</div>
								<SearchBar
									value={search}
									onChange={(newValue) => handleAttandanceReport(onSelectData? onSelectData: id, monthData , '','',newValue,calenderDate)}
									placeholder="Search Student"
								/>
								</div>
							</div>
							<div >
							</div>
							{monthData === 'month'? (
								<div>{renderCellsMonth()} </div>
							) : monthData === 'week' ?(
								<div>{renderCellsWeek()}</div>
							) : monthData === 'today' ? (
								<div>{renderCellsToday()}</div>
							): null}
						</Container>
					</div>
				) : (
					<Loader />
				)}
			</div>
		</>
	);
}
