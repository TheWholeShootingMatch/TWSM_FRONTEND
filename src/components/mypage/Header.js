import React from "react";
import {NavLink} from "react-router-dom";

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

export function MHeader(){
    return(
        <div className="profile_nav">
            <div className="profile_upper">이미지랑 이름</div>
            <ul>
                <li><NavLink to="/manager-page/requested-project">requested project</NavLink></li>
                <li><NavLink to="/manager-page/approved-project">approved project</NavLink></li>
                <li><NavLink to="/manager-page/deleted-project">deleted project</NavLink></li>
                <li><NavLink to="/manager-page/blocked-user">blocked user</NavLink></li>
            </ul>
        </div>
    )
}