import React from "react";
import UserMyPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import "./RequestedProject.scss";

function RequestedProject({isLogin}){
    return(
        <UserMyPage user="user" isLogin={isLogin}>
            <RequestedProjectList/>
        </UserMyPage>
    )
}

function RequestDetail({ request }) {

    const { title, description, request_time, status } = request;

    return (
        <div className="box_long">
            <div className="box_long_upper">
                <span className="req_box_title">{title}</span>
                <span className="req_box_date">{new Date(request_time).toLocaleDateString()}</span>
            </div>
            <p className="req_box_des">{description}</p>
            {/*<span>{status}</span>*/}
        </div>
    )
}

function RequestedProjectList() {

    /* 요청보낸 프로젝트를 불러옴 */
    const [requestedProject]  = useFetch('/api/project');
    console.log(requestedProject);

    return (
        <>
            <h2 className="MyPage_h2">Requested Project</h2>
            <div className="project_area">
                <div>
                    {requestedProject.map((request) => <RequestDetail request={request} />)}
                </div>
            </div>
        </>
    )
}

export default RequestedProject;
