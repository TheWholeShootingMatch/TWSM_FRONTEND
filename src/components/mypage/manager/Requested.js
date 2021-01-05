import React from "react";
import ManagerPage from "../common/MyPage";

function Requested(){
    return(
        <ManagerPage user="manager" header="Requested project">
            <RequestedProjects/>
        </ManagerPage>
    )
}

function RequestedProjects(){
    return(
        <>
        <tbody className="requested_projects">
            <tr className="project_info">
                <td className="approve_btn">approve btn</td>
                <td className="username">username</td>
                <td className="title">title</td>
                <td className="date">date</td>
                <td className="deny_btn">deny btn</td>
            </tr>
        </tbody>
        </>
    )
}

export default Requested;