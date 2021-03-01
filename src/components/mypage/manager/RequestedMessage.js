import React, {useState, useEffect} from "react";
import ManagerPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import axios from "axios";

function RequestedMessage({isLogin, userType}) {
    const [requestedMessage] = useFetch('/api/tct');

    return(
        <ManagerPage header="Requested project" user={userType} isLogin={isLogin}>
            <tbody className="requested_projects">
                {requestedMessage.map((message, index) => <RequestedProject key={index} message={message}/>)}
            </tbody>
        </ManagerPage>
    )
}

function RequestedProject({ message }) {
    
    const { _id, owner, description, request_time, status, title } = message;
    const [approveToggleBtn, setToggleBtn] = useState(false);
    const [newStatus, setStatus] = useState(status);

    useEffect(() => {
        if (newStatus === "A") {
            setToggleBtn(true);
        }
    }, []);

    const onApprove = () => {
        axios.post('/api/tct/approve', { _id, owner, title }, { withCredentials: true })
            .then(res => {
                if (res.data) {
                    setStatus('A');
                    setToggleBtn(true);
                }
            })
            .catch(err => { alert("fail to approve project!") });
    }
    
    return(
            <tr className="project_info">
                <td className="username">{owner}</td>
                <td className="title">{title}</td>
                <td className="description">{description}</td>
                <td className="date">{new Date(Number(request_time)).toLocaleDateString()}</td>
                <td className="status">{newStatus}</td>
                <td className="approve_btn"><button onClick={() => onApprove()} disabled={approveToggleBtn}>approve btn</button></td>
                <td className="deny_btn">deny btn</td>
            </tr>
    )
}

export default RequestedMessage;