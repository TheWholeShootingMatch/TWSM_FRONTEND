import React, {useEffect} from "react";

function TctComponant(contents) {
  return (
    <div>
      {sidemenu()}
      <div class="tct_wrapper">
        {header()}
        {contents}
      </div>
    </div>
  );
}

function sidemenu() {
  return (
    <div class="tct_sidemenu">
        <div class="logo_area">
        </div>
        <nav class="menu_area">
            <ul>
                <li class="menu">model</li>
                <li class="menu">photographer</li>
                <li class="menu">whiteboard</li>
                <li class="menu">workflow</li>
            </ul>
        </nav>
        <div class="back_btn"><a></a></div>
    </div>
  );
}

function header() {
  return (
    <header class="tct_header">
        <div class="project_title"><input placeholder="project#1" /></div>
        <div class="connected_users">
            <span class="user_icon"></span>
            <span class="user_icon"></span>
            <span class="invite_btn">
                <details>
                    <summary>plus</summary>
                    <div>user list</div>
                </details>
            </span>
        </div>
    </header>
  );
}

export default TctComponant;
