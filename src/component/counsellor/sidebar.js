import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../images/defaultSchoolLogo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import chat from '../images/chat.svg';
import { authHeader } from '../../comman/authToken';
import { API, BASE_URL } from '../../config/config';
import axios from 'axios';
import { handleLogout } from '../header';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data:'',
          loading:false,
          getCountryValue:[]
        }
      }

      getCountry = async() => {
        this.setState({loading:true});
          await axios
          .get(`${API.getAllCountry}`, { headers: authHeader() })
          .then((data) => {
            this.setState({loading:false});
            this.setState({getCountryValue:data.data.country});
            this.handleGetSchoolInfo()
          }).catch((err) => {
            this.setState({loading:false});
            if (err.response.status === 401) {
              handleLogout()
            }
          })
      };

    handleGetSchoolInfo = async() =>{

        const Manager_ID = localStorage.getItem('id');
    
        this.setState({loading:true});
        await axios
        .get(`${API.getSchoolInfo}/${Manager_ID}`, { headers: authHeader() })
        .then((res) => {
          this.setState({loading:false});
          this.setState({data:res.data});
          const countryname =  this.state.getCountryValue.filter((value) => value._id === res.data.country)
          localStorage.setItem("schoolLocation", countryname[0]?.name);
    
        })
        .catch((err) => {
          if (err.response.status === 401) {
            handleLogout()
          }
          localStorage.setItem("schoolLocation",'');
          this.setState({data:''});
          this.setState({loading:false});
        });
      }
      
      componentDidMount() {
        this.getCountry()
      }

    render() { 
        const {data} = this.state
        const localData = localStorage.getItem('logoImage')

        return <React.Fragment > 
            <div style={{height:"100%", minHeight:"100vh"}}>
                <div className="sidebar d-flex flex-column flex-shrink-0 pl-0 p-3  " style={{width:'100%', height:"100%"}}>
                        <a href="#" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none logo">
                        {localData ? <img src={BASE_URL+'/'+localData} className="" alt="local_logo" width={'200px'} height={'80px'}/> : !data.logo ? <img src={logo} className="" alt="db_logo" width={'200px'} height={'80px'}/> :  <img src={BASE_URL+'/'+data.logo} className="" alt="db_logo" width={'200px'} height={'80px'}/> }

                        </a>
        
                        <ul className="nav nav-pills flex-column mb-auto">
                    
                        <li>
                            <Link to="/councellordash" className="nav-link link-dark">
                            <span className='icon'><DashboardIcon/></span>
                            Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/councellorchat" className="nav-link link-dark">
                            <span className='icon'><img src={chat} className="" alt="logo" /></span>
                            chat
                            </Link>
                        </li>
                       
                        </ul>
        
                </div>
            </div>
        </React.Fragment>
    }
}
 
export default Sidebar;