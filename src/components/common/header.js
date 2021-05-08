import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "./logo.png";

function Header({ isLogin }) {

    /* 유저가 관리자냐 일반 유저냐에 따라 링크 조정 필요 */

    return(
        <header className="main_header">
            <a href="/" className="logo"><img src={logo} alt="TWSM"/></a>
            <div className="header_nav_left">
                <Link to="/model/Model/0/L">model</Link>
                <Link to="/photographer/Photographer/0/L">photographer</Link>
                <Link to="/collaboration/project/1/L">collaborate</Link>
            </div>
            <div className="header_nav_right">
                {isLogin ? <Link to="/mypage">my page</Link> : <Link to="/login">my page</Link>}
                {isLogin ? <Link to="/logout">logout</Link> : <Link to="/login">login</Link>}
            </div>
        </header>
    )
}

export default Header;
