import React from "react";
import UserMyPage from "../common/MyPage";
import { Link } from "react-router-dom";
import { useFetch } from "../../common/useFetch";

function MyProject({ isLogin }) {
    
    const [myProjects] = useFetch('/api/project/my-project');
    
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
                    {myProjects.map(project =>
                        <Link to={`/whiteboard/${project._id}`}>
                            <div className="box_long">
                                <p>{project.title}</p>
                                <p>{project.description}</p>
                            </div>
                        </Link>)}
                </div>
            </div>
        </>
    )
}

export default MyProject;