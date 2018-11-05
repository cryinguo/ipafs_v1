import React from 'react'
import {Route, NewLink} from './my-react-router-dom'
import Home from './routes/Home'
import User from './routes/User'
import Topics from './routes/Topics'
// import Login from '../src/routes/Login'
//import {Login} from './routes/Login'

import { LoginPage } from '../src/routes/login/LoginPage';
import { Link } from 'react-router-dom';

const App = () => (
    <div className="appRoot">
        <ul className="nav">
            {/*<li><Link to="/"></Link></li>*/}
            <li><NewLink to="/home">Home</NewLink></li>
            <li><NewLink to="/user">User</NewLink></li>
            <li><NewLink to="/topics">Topics</NewLink></li>
            <span>
              <li style={{fontSize:'14px'}}>welcome,{sessionStorage.getItem('fn')} {sessionStorage.getItem('ln')}</li>
              <li><Link to="/login" className="logout">Logout/Login</Link></li>
            </span>
        </ul>      
        <hr/>

        {/*<Route exact path="/" component={Login}/>*/}
        <Route path="/home" component={Home}/>
        <Route path="/user" component={User}/>
        <Route path="/topics" component={Topics}/>  
        <Route path="/login" component={LoginPage} /> 
    </div>
);


export default App