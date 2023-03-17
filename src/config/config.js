//client work
// export const BASE_URL = "https://api-aelix.mangoitsol.com";
// export const SOCKET_URL = "https://api-aelix.mangoitsol.com/"; 

// mangoit server
 export const BASE_URL = "http://103.127.29.85:6020";
 export const SOCKET_URL = "http://103.127.29.85:6020/"; 

// local server
// export const BASE_URL = "http://localhost:6020";
// export const SOCKET_URL = "http://localhost:6020/"; 

export const API = {
  login: `${BASE_URL}/api/login`,
  sendMail: `${BASE_URL}/api/sendMail`,
  changePassword: `${BASE_URL}/api/resetPassword`,
  createPin: `${BASE_URL}/api/createPin`,
  updatePin: `${BASE_URL}/api/updatePin`,

  createClass: `${BASE_URL}/api/createClass`,
  getClass:`${BASE_URL}/api/getClass`,
  createCounsellorandManager:`${BASE_URL}/api/createUser`,
  getUser: `${BASE_URL}/api/user`,
  getAllUser: `${BASE_URL}/api/getUser`,
  updateUser: `${BASE_URL}/api/updateUser`,
  deleteUser: `${BASE_URL}/api/deleteUser`,
  counsellorSearch: `${BASE_URL}/api/searchUser`,

  getAllCountry:`${BASE_URL}/api/getAllCountry`,
  getStateBYCountryId:`${BASE_URL}/api/state`,

  addStudent: `${BASE_URL}/api/createStudent`,
  getStudent: `${BASE_URL}/api/student`, 
  studentSearch: `${BASE_URL}/api/search`,
  studentDelete: `${BASE_URL}/api/deleteStudent`,
  studentUpdate: `${BASE_URL}/api/updateStudent`,
  studentDismiss: `${BASE_URL}/api/dismiss`,
  studentAssignClass: `${BASE_URL}/api/updateManyRecords`,
  bulkUpload: `${BASE_URL}/api/uploadcsv`,

  saveAttendance:  `${BASE_URL}/api/saveAttaindence`,
  updateAttendace: `${BASE_URL}/api/updateAttaindence`,
  previousAttendanceReport : `${BASE_URL}/api/getPreviousRecords`,
  getCounsellorNameByClassId: `${BASE_URL}/api/getCouncellorbyClass`,
  getCounsellorStudent: `${BASE_URL}/api/getStu`,
  varifyPin: `${BASE_URL}/api/varifyPin`,
  studentStatusUpdate: `${BASE_URL}/api/updateStatus`,
  timerStart: `${BASE_URL}/api/startTime`,
  timerStop: `${BASE_URL}/api/stopTime`,
  
  accessChatByChatId : `${BASE_URL}/api/accessChat`,
  sendMessage : `${BASE_URL}/api/sendMessage`,
  getMessage : `${BASE_URL}/api/getMessage`,
  seenGroupMessage : `${BASE_URL}/api/seenGroupMessage`,
  
  
  createGroup : `${BASE_URL}/api/groupChat`,
  fetchGroup : `${BASE_URL}/api/chat`,
  removeGroupUser : `${BASE_URL}/api/removeGroupUser`,
  addUserInGroup:`${BASE_URL}/api/addUserInGroup`,
  allGCs:`${BASE_URL}/api/allGroup`,
  updateMessage: `${BASE_URL}/api/updateMessage`,
  deleteMessage: `${BASE_URL}/api/deleteMessage`,
  deleteGroup: `${BASE_URL}/api/deletegroup`,
  deleteMessageReceiver: `${BASE_URL}/api/softDeleteMessage`,

  searchClass: `${BASE_URL}/api/searchClass`,
  updateClass: `${BASE_URL}/api/updateClass`, 
  deleteClass: `${BASE_URL}/api/deleteClass`,

  addSchoolInfo: `${BASE_URL}/api/addSchoolInfo`,
  updateSchoolInfo: `${BASE_URL}/api/updateSchoolInfo`,
  getSchoolInfo: `${BASE_URL}/api/getSchoolInfo`,

  getCurrentLocation:'https://ipinfo.io/json?token=5c5585f95b146b',

  getLoginStatus :`${BASE_URL}/api/getStatusInfo`,
  addLoginStatus :`${BASE_URL}/api/addStatusInfo`,
  updateLoginStatus :`${BASE_URL}/api/updateStatusInfo`,
  
};
