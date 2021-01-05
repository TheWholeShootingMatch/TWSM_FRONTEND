import React from "react";
import UserMyPage from "../common/MyPage"

function MyProject(){
    return(
        <UserMyPage user="user" header="My Project">
            <Myprojects/>
        </UserMyPage>
    )
}

function Myprojects(){
    return(
        <>
        <div class="contents_upper_flex">
            <div>search</div>
            <a>new</a>
            {/* 누르면 create-project 페이지로 이동 */}
        </div>
        <div class="project_area">
            <div>
                <div class="box_long">project detail</div>
                <div class="box_long">project detail</div>
            </div>
        </div>
        </>
    )
}

export default MyProject;