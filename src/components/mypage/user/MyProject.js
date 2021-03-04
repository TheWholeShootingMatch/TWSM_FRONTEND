import React from "react";
import UserMyPage from "../common/MyPage";
import { Link } from "react-router-dom";
import { useFetch } from "../../common/useFetch";

function MyProject({ isLogin }) {
    
    const [myProjects] = useFetch('/api/tct/my-project');
    
    return(
        <UserMyPage user="user" header="My Project" isLogin={isLogin}>
            <Myprojects myProjects={myProjects}/>
        </UserMyPage>
    )
}

function Myprojects({myProjects}) {
    return(
        <>
        <div className="contents_upper_flex">
            <div>search</div>
            <Link to="/mypage/create-project">new</Link>
            {/* 누르면 create-project 페이지로 이동 */}
        </div>
        <div className="project_area">
                <div>
                    {myProjects.map(project => <div className="box_long">
                        <p>{project.title}</p>
                        <p>{project.description}</p>
                </div>)}
            </div>
        </div>
        </>
    )
}

export default MyProject;
