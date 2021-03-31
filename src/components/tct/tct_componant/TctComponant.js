import React, {useEffect, useState} from "react";
import { Link, useHistory, useParams, NavLink } from "react-router-dom";
import {originSuffix, activeUserList, awareness, doc} from "../whiteboard_tab/tools/SharedTypes";
import { setActiveUserInfo } from "../whiteboard_tab/tools/activeUserInfo";
import useSocket from "./useSocket";
import "./TctComponant.scss";
import axios from "axios";

function SideMenu() {
  return (
    <div className="tct_sidemenu">
        <div className="logo_area">
          logo
        </div>
        <nav className="menu_area">
            <ul>
          <li className="menu"><NavLink to="/TctModel/0"
            activeClassName="tct-menu-active">model</NavLink></li>
          <li className="menu"><NavLink to="/TctPhotographer/0"
            activeClassName="tct-menu-active">photographer</NavLink></li>
          <li className="menu"><NavLink to={`/whiteboard/${originSuffix}`}
            activeClassName="tct-menu-active">whiteboard</NavLink></li>
          <li className="menu"><NavLink to="/TctWorkflow"
            activeClassName="tct-menu-active">workflow</NavLink></li>
            </ul>
        </nav>
    </div>
  );
}

function Header() {
  const [activeUserState, setActiveUserState] = useState([]);

  activeUserList.observe((ymapEvent) => {
    ymapEvent.changes.keys.forEach((change, key) => {
      const currentActiveUserList = activeUserList.get('activeUserList');
      if (change.action === "update") {
        setActiveUserState(currentActiveUserList);
      }
    })
  })

  // for post
  const {TcTnum} = useParams();

  const [inputs, setInputs] = useState({ TcTnum: TcTnum });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/notification/invite', inputs)
      .then (res => {  })
      .catch(err => { console.error(err); });
  };

  return (
    <header className="tct_header">
        <div className="project_title"><input placeholder="project#1" /></div>
      <div className="connected_users">
        {activeUserState.map(state => <span className="user_icon" style={{ color: state.userInfo.color }}>{state.userInfo.name}</span>)}
        <span className="invite_btn">
                <details>
                    <summary>plus</summary>
                    <form onSubmit={handleSubmit}>
                      <input type="text" name="id" placeholder="Enter the ID" onChange={handleChange}/>
                      <button type="submit">Invite</button>
                    </form>
                    <div>user list</div>
                </details>
        </span>
      </div>
    </header>
  );
}

function TctComponant({ children }) {
  return (
    <div className="whole_wrapper">
      <SideMenu/>
      <div className="tct_wrapper">
        <Header/>
        {children}
      </div>
    </div>
  );
}

export default TctComponant;
