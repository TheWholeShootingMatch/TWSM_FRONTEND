//import React, {useEffect} from "react";
import { Link, useHistory } from "react-router-dom";
import "./TctComponant.scss";

function SideMenu() {
  return (
    <div className="tct_sidemenu">
        <div className="logo_area">
          logo
        </div>
        <nav className="menu_area">
            <ul>
                <li className="menu"><Link to="/Model">model</Link></li>
                <li className="menu"><Link to="">photographer</Link></li>
                <li className="menu"><Link to="/WhiteBoard">whiteboard</Link></li>
                <li className="menu"><Link to="/TctWorkflow">workflow</Link></li>
            </ul>
        </nav>
        <div className="back_btn"><a></a></div>
    </div>
  );
}

function Header() {
  return (
    <header className="tct_header">
        <div className="project_title"><input placeholder="project#1" /></div>
        <div className="connected_users">
            <span className="user_icon">k</span>
            <span className="user_icon">u</span>
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

function TctComponant({children}) {
  return (
    <div className="whole_wrapper">
      <SideMenu />
      <div className="tct_wrapper">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default TctComponant;
