import React from "react";
import ManagerPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";

function RequestedMessage() {
    
    const [requestedMessage] = useFetch('/api/tct');
    console.log(requestedMessage);

    return(
        <ManagerPage user="manager" header="Requested project">
            {requestedMessage.map((message, index) => <RequestedProject key={index} message={message}/>)}
        </ManagerPage>
    )
}

function RequestedProject({ message }) {
    
    const { owner, description, request_time, status, title } = message;
    
    return(
        <>
        <tbody className="requested_projects">
            <tr className="project_info">
                <td className="username">{owner}</td>
                <td className="title">{title}</td>
                <td className="description">{description}</td>
                <td className="date">{new Date(Number(request_time)).toLocaleDateString()}</td>
                <td className="status">{status}</td>
                <td className="approve_btn">approve btn</td>
                <td className="deny_btn">deny btn</td>
            </tr>
        </tbody>
        </>
    )
}

export default RequestedMessage;