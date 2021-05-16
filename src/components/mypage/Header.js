import React from "react";
import { NavLink } from "react-router-dom";
import meIcon from "./Icons/me.png";
import favIcon from "./Icons/fav.png";
import myIcon from "./Icons/myP.png";
import notiIcon from "./Icons/noti.png";
import reqIcon from "./Icons/req.png";

/* 일반 유저 */
export function UHeader() {
    // const id = window.localStorage.getItem("name");
    return (
      <ul className="profile_nav">
          <li>
              <img src={reqIcon} alt="reqIcon" />
              <NavLink to="/mypage/requested-project">
                  Requested Project
              </NavLink>
          </li>
          <li>
              <img src={notiIcon} alt="notiIcon" />
              <NavLink to="/mypage/notification">Notification</NavLink>
          </li>
          <li>
              <img src={myIcon} alt="myIcon" />
              <NavLink to="/mypage/project">My Project</NavLink>
          </li>
          <li>
              <img src={favIcon} alt="favIcon" />
              <NavLink to="/mypage/bookmark">Bookmark</NavLink>
          </li>
          <li>
              <img src={meIcon} alt="meIcon" />
              <NavLink to="/mypage/profile">My Profile</NavLink>
          </li>
      </ul>
    );
}

/* 매니저 */
export function MHeader() {
    // const id = window.localStorage.getItem("name");
    return (
      <ul className="profile_nav">
          <li>
              <img src={reqIcon} alt="reqIcon" />
              <NavLink to="/mypage/requested-message">
                  requested project
              </NavLink>
          </li>
          <li>
              <img src={meIcon} alt="meIcon" />
              <NavLink to="/mypage/blocked-user">blocked user</NavLink>
          </li>
      </ul>
    );
}
