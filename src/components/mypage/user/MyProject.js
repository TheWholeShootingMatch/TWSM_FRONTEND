import React from "react";
import UserMyPage from "../common/MyPage";
import { Link } from "react-router-dom";


function MyProject({isLogin}){
    return(
        <UserMyPage user="user" header="My Project" isLogin={isLogin}>
            <Myprojects/>
        </UserMyPage>
    )
}

function Myprojects(){
    return(
        <>
        <div className="contents_upper_flex">
            <div>search</div>
            <Link to="/mypage/create-project">new</Link>
            {/* 누르면 create-project 페이지로 이동 */}
        </div>
        <div className="project_area">
            <div>
                <div className="box_long">project detail</div>
                <div className="box_long">project detail</div>
            </div>
        </div>
        </>
    )
}

export default MyProject;
