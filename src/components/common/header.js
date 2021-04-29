import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header({ isLogin }) {

    /* 유저가 관리자냐 일반 유저냐에 따라 링크 조정 필요 */

    return(
        <header className="main_header">
            <a href="/" className="logo">TWSM</a>
            <nav className="header_nav">
                <div className="header_nav_left">
                    <ul>
                        <li><Link to="/model/Model/0/L">model</Link></li>
                        <li><Link to="/photographer/Photographer/0/L">photographer</Link></li>
                        <li><Link to="/collaboration/project/1/L">collaborate</Link></li>
                    </ul>
                </div>
                <div className="header_nav_right">
                    <ul>
                        <li>{isLogin ? <Link to="/mypage">my page</Link> : <Link to="/login">my page</Link>}</li>
                        <li>{isLogin ? <Link to="/logout">logout</Link> : <Link to="/login">login</Link>}</li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header;
