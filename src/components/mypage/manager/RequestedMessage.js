import React, { useState, useEffect } from "react";
import ManagerPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import axios from "axios";
import "./RequestedMessage.scss";
import "./common.scss";

function RequestedMessage({ isLogin, userType }) {
    const [requestedMessage] = useFetch("/api/project");

    return (
        <ManagerPage
            user={userType}
            isLogin={isLogin}
        >
            <h2 className="MyPage_h2">Requested Projects</h2>
            <div className="project_area">
              <thead className="Thead">
                <tr>
                  <th className="Rusername">Name</th>
                  <th className="Rtitle">Title</th>
                  <th className="Rdescription">Description</th>
                  <th className="Rdate">Date</th>
                  <th className="Rstatus">Status</th>
                  <th className="approve_btn"></th>
                  <th className="deny_btn"></th>
                </tr>
              </thead>
              <tbody className="requested_projects">
                  {requestedMessage.map((message, index) => (
                      <RequestedProject key={index} message={message} />
                  ))}
              </tbody>
            </div>
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
            <td className="Rusername">{username}</td>
            <td className="Rtitle">{title}</td>
            <td className="Rdescription">{description}</td>
            <td className="Rdate">
                {new Date(request_time).toLocaleDateString()}
            </td>
            <td className="Rstatus">{newStatus}</td>
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
