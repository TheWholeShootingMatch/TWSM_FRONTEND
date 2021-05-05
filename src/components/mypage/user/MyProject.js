import React, { useEffect, useState } from "react";
import UserMyPage from "../common/MyPage";
import { Link } from "react-router-dom";
import { useFetch } from "../../common/useFetch";

import "./MyProject.css";

function MyProject({ isLogin }) {
    const [myProjects] = useFetch("/api/project/my-project");

    return (
        <UserMyPage user="user" header="My Project" isLogin={isLogin}>
            <Myprojects myProjects={myProjects} />
        </UserMyPage>
    );
}

function Myprojects({ myProjects }) {
    return (
        <>
            <div className="contents_upper_flex">
                <Link to="/mypage/create-project">new</Link>
                {/* 누르면 create-project 페이지로 이동 */}
            </div>
            <div className="project_area">
                <div>
                    {myProjects.map(project => (
                        // <Link to={`/whiteboard/${project.TcTnum._id}`}>
                        <div
                            className="box_long"
                            onClick={() =>
                                window.open(
                                    `/whiteboard/${project.TcTnum._id}`,
                                    "_blank"
                                )
                            }
                        >
                            <h3>{project.TcTnum.title}</h3>
                            <p>{project.TcTnum.description}</p>
                        </div>
                        // </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export default MyProject;
