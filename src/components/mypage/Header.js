import React from "react";
import { NavLink } from "react-router-dom";
import accountIcon from "./Icons/person.png";

/* 일반 유저 */
export function UHeader() {
    const id = window.localStorage.getItem("id");
    return (
        <div className="profile_nav">
            <div className="profile_upper">
                <img src={accountIcon} alt="acount_logo" />
                <h1>{id}</h1>
            </div>
            <ul>
                <li>
                    <NavLink to="/mypage/requested-project">
                        Requested Project
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/notification">Notification</NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/project">My Project</NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/bookmark">Bookmark</NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/profile">My Profile</NavLink>
                </li>
            </ul>
        </div>
    );
}

/* 매니저 */
export function MHeader() {
    const id = window.localStorage.getItem("id");

    return (
        <div className="profile_nav">
            <div className="profile_upper">
                <img src={accountIcon} alt="acount_logo" />
                <h1>{id}</h1>
            </div>
            <ul>
                <li>
                    <NavLink to="/mypage/requested-message">
                        requested project
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/blocked-user">blocked user</NavLink>
                </li>
            </ul>
        </div>
    );
}
