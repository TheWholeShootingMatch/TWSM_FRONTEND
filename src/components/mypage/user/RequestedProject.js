import React from "react";
import UserMyPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";

function RequestedProject({isLogin}){
    return(
        <UserMyPage user="user" header="Requested Project" isLogin={isLogin}>
            <RequestedProjectList/>
        </UserMyPage>
    )
}

function RequestDetail({ request }) {
    
    const { title, description, request_time, status } = request;

    return (
        <div className="box_long">
            <div className="box_long_upper">
                <span>{title}</span>
                <span>{new Date(Number(request_time)).toLocaleDateString()}</span>
            </div>
            <p>{description}</p>
            <span>{status}</span>
        </div>
    )
}
    
function RequestedProjectList() {
    
    /* 요청보낸 프로젝트를 불러옴 */
    const [requestedProject]  = useFetch('/api/tct');
    console.log(requestedProject);

    return (
        <>
            <div className="project_area">
                <div>
                    {requestedProject.map((request) => <RequestDetail request={request} />)}
                </div>
            </div>
        </>
    )
}

export default RequestedProject;
