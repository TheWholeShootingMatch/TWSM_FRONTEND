import React, {useEffect, useState} from "react";
import { Link, useHistory } from "react-router-dom";
import {awareness, originSuffix} from "../whiteboard_tab/tools/SharedTypes";
import { getActiveUserState } from "../whiteboard_tab/tools/activeUserInfo";
import "./TctComponant.scss";

function SideMenu() {
  return (
    <div className="tct_sidemenu">
        <div className="logo_area">
          logo
        </div>
        <nav className="menu_area">
            <ul>
                <li className="menu"><Link to="/TctModel/0">model</Link></li>
                <li className="menu"><Link to="/TctPhotographer/0">photographer</Link></li>
                <li className="menu"><Link to={`/whiteboard/${originSuffix}`}>whiteboard</Link></li>
                <li className="menu"><Link to="/TctWorkflow">workflow</Link></li>
            </ul>
        </nav>
        <div className="back_btn"><a></a></div>
    </div>
  );
}

function Header() {
  
  const [activeUserState, setActiveUserState] = useState([]);

  useEffect(() => {
    
    const activeUserList = getActiveUserState();
    setActiveUserState(activeUserList);
  }, []);

  awareness.on('update', () => {
    const localState = awareness.getLocalState();
    if (localState !== null && JSON.stringify(localState) !== JSON.stringify({})) {
      if (activeUserState.length > 0 && !activeUserState.includes(localState)) {
        const userList = getActiveUserState();
        console.log(activeUserState, userList);
        setActiveUserState(userList);
      }
    }
  })

  awareness.on('change', () => {
    const userList = getActiveUserState();
    setActiveUserState(userList);
  })

  return (
    <header className="tct_header">
        <div className="project_title"><input placeholder="project#1" /></div>
      <div className="connected_users">
        {activeUserState.map(state => <span className="user_icon" style={{ color: state.userInfo.color }}>{state.userInfo.name}</span>)}
        <span className="invite_btn">
                <details>
                    <summary>plus</summary>
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
