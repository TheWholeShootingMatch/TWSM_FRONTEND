import React from "react";
import {NavLink} from "react-router-dom";

/* 일반 유저 */
export function UHeader(){
    return(
        <div className="profile_nav">
            <div className="profile_upper">이미지랑 이름</div>
            <ul>
                <li><NavLink to="/mypage/requested-project">requested project</NavLink></li>
                <li><NavLink to="/mypage/notification">notification</NavLink></li>
                <li><NavLink to="/mypage/project">my project</NavLink></li>
                <li><NavLink to="/mypage/profile">my profile</NavLink></li>
            </ul>
        </div>
    )
}

/* 매니저 */
export function MHeader(){
    return(
        <div className="profile_nav">
            <div className="profile_upper">이미지랑 이름</div>
            <ul>
                <li><NavLink to="/manager-page/requested-project">requested project</NavLink></li>
                <li><NavLink to="/manager-page/deleted-project">deleted project</NavLink></li>
                <li><NavLink to="/manager-page/blocked-user">blocked user</NavLink></li>
            </ul>
        </div>
    )
}