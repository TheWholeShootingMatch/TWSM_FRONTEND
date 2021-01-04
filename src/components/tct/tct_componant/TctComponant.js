import React, {useEffect} from "react";

function SideMenu() {
  return (
    <div className="tct_sidemenu">
        <div className="logo_area">
        </div>
        <nav className="menu_area">
            <ul>
                <li className="menu">model</li>
                <li className="menu">photographer</li>
                <li className="menu">whiteboard</li>
                <li className="menu">workflow</li>
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
            <span className="user_icon"></span>
            <span className="user_icon"></span>
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
    <>
      <SideMenu />
      <div className="tct_wrapper">
        <Header />
        {children}
      </div>
    </>
  );
}

export default TctComponant;
