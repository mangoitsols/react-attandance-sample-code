import React from "react";
import { Routes, Route } from "react-router-dom";
import { history } from "../comman/history";
import AddStudent from '../component/addStudent';
import DashBoard1 from '../component/dashboard';
import Login from '../component/login';
import Profile from '../component/profile';
import ForgotPassword from '../component/forgotpassword';
import AddCounsellor from '../component/addCounsellor';
import Counsellor from '../component/counsellor';
import ChangePassword from '../component/changePassword';
import CreatePin from '../component/createPin';
import ImportCSV from '../component/ImportCSV';
import EditCounsellor from '../component/editCounsellor';
import CounsellorDashboard from '../component/counsellor/dashboard';
import Welcome from '../component/welcome';
import EnhancedTable from "../component/student-table";
import ResetPassword from "../component/resetPassword";
import EditStudent from "../component/edit-student";
import AttandanceReport from "../component/attandanceReports";
import Chat from "../component/chat";
import CouncellorChat from "../component/counsellor/councellorchat";
import ManageClass from "../component/manageClass";
import PageNotFound from "../comman/pageNotFound";
import Cprofile from "../component/counsellor/cprofile";

const Routing = () => {
    return ( 
      
        <Routes>
        
          <Route history={history} 
          exact 
          path="/" 
          element={< Login/>} 
          />
          <Route history={history} 
          exact 
          path="/dashboard" 
          element={< DashBoard1/>} 
          />
          <Route history={history} 
          exact 
          path="/profile" 
          element={<Profile/>} 
          />
          <Route history={history} 
          exact 
          path="/cprofile" 
          element={<Cprofile/>} 
          />
          <Route history={history} 
          exact 
          path="/student" 
          element={<EnhancedTable/>} 
          />
          <Route history={history} 
          exact 
          path="/addStudent" 
          element={<AddStudent/>} 
          />
          <Route history={history} 
          exact 
          path="/editstudent/:id" 
          element={<EditStudent/>} 
          />
          <Route history={history} 
          exact 
          path="/forgotpassword" 
          element={< ForgotPassword/>} 
          />
          <Route history={history} 
          exact 
          path="/addCounsellor" 
          element={< AddCounsellor/>} 
          />
          <Route history={history} 
          exact 
          path="/counsellor" 
          element={< Counsellor/>} 
          />
          <Route history={history} 
          exact 
          path="/changepassword" 
          element={< ChangePassword/>} 
          /> 
          <Route history={history} 
          exact 
          path="/createpin" 
          element={<CreatePin/>} 
          /> 
          <Route history={history} 
          exact 
          path="/importcsv" 
          element={<ImportCSV/>} 
          />
          <Route history={history} 
          exact 
          path='/editCounsellor/:id' 
          element={<EditCounsellor/>} 
          />
          <Route history={history}
          exact
          path="/councellordash"
          element={<CounsellorDashboard />}
          />
          <Route history={history} 
          exact 
          path="/welcome" 
          element={< Welcome/>} 
          />
          <Route history={history} 
          exact 
          path="/resetpassword" 
          element={< ResetPassword/>} 
          />
          <Route history={history} 
          exact 
          path="/attendance/:id" 
          element={< AttandanceReport/>} 
          />
          <Route history={history} 
          exact 
          path="/chat" 
          element={<Chat/>} 
          />
          <Route history={history} 
          exact 
          path="/councellorchat" 
          element={< CouncellorChat/>} 
          />
          <Route history={history}
          exact
          path="/class"
          element={<ManageClass/>}
          />
          <Route history={history}
          exact
          path="*"
          element={<PageNotFound/>}
          />
          
        
          
        </Routes>
    );
}

         

export default Routing;

