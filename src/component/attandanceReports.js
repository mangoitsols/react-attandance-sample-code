import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ImageAvatars, { handleLogout } from "./header";
import Container from "@mui/material/Container";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { API } from "../config/config";
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
toast.configure();

export default function AttandanceReport(props) {

	const [loading, setLoading] = useState(true);
	const [attandanceData, setattandanceData] = useState([]);
	const [classData, setClassData] = useState([]);
	const [onSelectData, setOnSelectData] = useState("");
	const [monthData, setMonthData] = useState('week');
	const [counsellorName, setCounsellorName] = useState("");
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [currentMonthNew, setCurrentMonthNew] = useState(new Date());
	const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
	const [startDateOfMonth, setStartDateMonth] = useState(getFirstDayOfMonth(new Date()));
	const [search, setSearch] = useState("");
	let classNameId = localStorage.getItem("className");

	useEffect(() => {
		handleAttandanceReport(finalId, "week");
		GetClassData();
		handleCounsellorNameByClassId(finalId);
	}, []);

	const { id } = useParams();

	let finalId = id ? id : classNameId;

	// Today Data render start
	const renderCellsToday = () => {

		const todayDate = moment().format('DD/MM/YYYY')
		console.log(todayDate)
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
							{attandanceData && attandanceData.length > 0 ? attandanceData.map((item) => {
								
								return (
									<TableRow >
										<TableCell style={{ textAlign: "center" }}>
										{item.studentId && item.studentId.name}{" "}{item.studentId && item.studentId.lastName}
										</TableCell>

										{item.attandan.map((attn)=> { 
										const dateCreated = moment(attn.createdAt).format('DD/MM/YYYY')
										return(
											todayDate === dateCreated ? 
										<TableCell style={{ textAlign: "center" }}>
										{item.studentId.dismiss !== null ? "D" : attn.attendence === null || attn.attendence === "0" ? "A" : attn.attendence === "1" ? "P" : null }
										</TableCell>:null	

										)})}

										<TableCell style={{ textAlign: "center" }}>
										dismiss
										</TableCell>
									</TableRow>
								)}
							):<TableRow colspan={3} style={{ textAlign: "center" }} >Record not founiid</TableRow>}
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
			handleAttandanceReport(onSelectData? onSelectData: id, "week",sd,ld);
		}
		if (btnType === "next") {
			setStartDate((date) => {
				return addDays(date, 7);
			});
			let sd = addDays(startDate, 7);
			let ld = addDays(sd, 6);
			setCurrentMonth(addWeeks(currentMonth, 1));
			handleAttandanceReport(onSelectData? onSelectData: id, "week",sd,ld);
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
							{attandanceData && attandanceData.length > 0 ? attandanceData.map((item) => {
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
																return item.studentId.dismiss !== null ? "D" : e.attendence === null || e.attendence === "0" ? "A" : e.attendence === "1" ? "P" : "";
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
							):<TableRow style={{ textAlign: "center" }} >Record not found</TableRow>}
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
			handleAttandanceReport(onSelectData? onSelectData: id, "month",sd,ld);
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

			handleAttandanceReport(onSelectData? onSelectData: id, "month",sd,ld);
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
							{attandanceData && attandanceData.length > 0 ? attandanceData.map((item) => {
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
																 		return e.attendence === null || e.attendence === "0" ? "A" : e.attendence === "1" ? "P" : "";
																	}
																})
															}
														</TableCell>)
								 					)
												})}
											</TableRow>
										</>
									);
								}):<TableRow style={{ textAlign: "center" }} >Record not found</TableRow>}	
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
				setClassData(response.data.data);
			} else {
				setLoading(true);
			}

		}).catch((err) => {
			if (err.response.status === 401) {
				handleLogout()
			  }
		 });
	};

	const handleAttandanceReport = async (idd, byWhich,strd,endd,data) => {
		setSearch(data);

		setattandanceData([])
		if(byWhich === "week"){

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
				setLoading(false);
				setattandanceData(res.data);
			}).catch((err) => {
				if (err.response.status === 401) {
					handleLogout()
				  }
				toast.error("Failed to fetch week of data")
			 });

		}else if(byWhich === "month"){
			const requestData = {
				fromDate: moment(strd ? strd : startDateOfMonth).format("YYYY-MM-DD"),
				toDate:	moment(endd ? endd : lastDayOfMonth(currentMonthNew, { weekStartsOn: 1 })).format("YYYY-MM-DD")
			}
			await axios({
				method: "post",
				url: `${API.previousAttendanceReport}/${idd}`,
				data: requestData,
				headers: authHeader(),
			  }).then((res)=> {
				setLoading(false);
				setattandanceData(res.data);
			}).catch((err) => {
				if (err.response.status === 401) {
					handleLogout()
				  }
				toast.error("Failed to fetch month of data")
			 });
		}else if(byWhich === "today"){

			const requestData = {
				fromDate: moment().format(),
				toDate:	moment().format(),
				searchName:data
			}
			await axios({
				method: "post",
				url: `${API.previousAttendanceReport}/${idd}`,
				data: requestData,
				headers: authHeader(),
			  }).then((res)=> {
				setLoading(false);
				setattandanceData(res.data);
			}).catch((err) => {
				if (err.response.status === 401) {
					handleLogout()
				  }
				toast.error("Failed to fetch week of data")
			 });

		}
	};

	const SelectOnChange = async (ele) => {
		setOnSelectData(ele);
		localStorage.setItem("className", ele);
		if (ele === ele) {
			handleAttandanceReport(ele, "week");
			handleCounsellorNameByClassId(ele);
		}
	};

	const handleDataAccWeekAndMonth = (data) => {
		if (data === "month") {
			setMonthData('month');
		} else if(data === 'today'){
			setMonthData('today');
		}else if(data === 'week'){
			setMonthData('week');
			// window.location.reload();
		}
		handleAttandanceReport(onSelectData ? onSelectData : id, data);
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
		if(monthData){
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
									<div style={{ display: "flex" }} >

										{monthData ? <>

											{/* previous next functionality of Month */}
											<div>
												<div style={{ display: "inline-block" }}>
													<ArrowBackIosIcon onClick={() => renderCellsMonth("prev")} />
												</div>
												<div style={{ display: "inline-block" }} hidden>
													<DatePicker
														selected={startDateOfMonth}
														onChange={(date) => setStartDateMonth(date)}
														customInput={<ExampleCustomInput />}
													/>
												</div>
												<div style={{ display: "inline-block" }}>
													<ArrowForwardIosIcon onClick={() => renderCellsMonth("next")} />
												</div>
											</div></> : <>

											{/* previous next functionality of week */}
											<div >
												<div style={{ display: "inline-block" }}>
													<ArrowBackIosIcon
														onClick={() => changeWeekHandle("prev")}
													/>
												</div>
												<div style={{ display: "inline-block" }} hidden>
													<DatePicker
														selected={startDate}
														onChange={(date) => setStartDate(date)}
														customInput={<ExampleCustomInput />}
													/>
												</div>
												<div style={{ display: "inline-block" }}>
													<ArrowForwardIosIcon
														onClick={() => changeWeekHandle("next")}
													/>
												</div>
											</div>
										</>}
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
								<span onClick={() => handleDataAccWeekAndMonth("week")}> Week{" "}  </span> | <span onClick={() => handleDataAccWeekAndMonth("month")}>{" "} Month </span> | <span onClick={() => handleDataAccWeekAndMonth("today")}> Today{" "}  </span>
								</div>
								<SearchBar
									value={search}
									onChange={(newValue) => handleAttandanceReport(onSelectData? onSelectData: id, monthData ? "month" : "week", '','',newValue)}
									placeholder="Search Counsellor"
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
