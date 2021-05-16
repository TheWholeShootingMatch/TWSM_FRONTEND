import React, { useState, useEffect } from "react";
import ManagerPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import axios from "axios";

function RequestedMessage({ isLogin, userType }) {
    const [requestedMessage] = useFetch("/api/project");

    return (
        <ManagerPage
            user={userType}
            isLogin={isLogin}
        >
            <h2 className="MyPage_h2">Requested Projects</h2>
            <tbody className="requested_projects">
                {requestedMessage.map((message, index) => (
                    <RequestedProject key={index} message={message} />
                ))}
            </tbody>
        </ManagerPage>
    );
}

function RequestedProject({ message }) {
    const { _id, owner, description, request_time, status, title } = message;
    const username = owner.id;
    const user_Uid = owner._id;
    const [approveToggleBtn, setApproveToggleBtn] = useState(false);
    const [denyToggleBtn, setDenyToggleBtn] = useState(false);
    const [newStatus, setStatus] = useState(status);

    useEffect(() => {
        if (newStatus === "A") {
            setApproveToggleBtn(true);
            setDenyToggleBtn(false);
        } else if (newStatus === "D") {
            setDenyToggleBtn(true);
            setApproveToggleBtn(false);
        }
    }, [newStatus]);

    const onApprove = () => {
        axios
            .post(
                "/api/project/approve",
                { _id, owner: user_Uid, title },
                { withCredentials: true }
            )
            .then(res => {
                if (res.data) {
                    setStatus("A");
                }
            })
            .catch(err => {
                alert("fail to approve project!");
            });
    };

    const onDeny = () => {
        axios
            .post(
                "/api/project/deny",
                { _id, owner: user_Uid, title },
                { withCredentials: true }
            )
            .then(res => {
                if (res.data) {
                    setStatus("D");
                }
            })
            .catch(err => {
                alert("fail to approve project!");
            });
    };

    return (
        <tr className="project_info">
            <td className="username">{username}</td>
            <td className="title">{title}</td>
            <td className="description">{description}</td>
            <td className="date">
                {new Date(request_time).toLocaleDateString()}
            </td>
            <td className="status">{newStatus}</td>
            <td className="approve_btn">
                <button onClick={() => onApprove()} disabled={approveToggleBtn}>
                    approve
                </button>
            </td>
            <td className="deny_btn">
                <button onClick={() => onDeny()} disabled={denyToggleBtn}>
                    deny
                </button>
            </td>
        </tr>
    );
}

export default RequestedMessage;
