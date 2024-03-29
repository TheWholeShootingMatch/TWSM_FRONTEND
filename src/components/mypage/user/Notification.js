import React, { useEffect, useState } from "react";
import UserMyPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import { Link } from "react-router-dom";

import "./Notification.css";

function Notification({ isLogin }) {
    const [notifications] = useFetch("/api/notification");
    console.log(notifications);

    return (
        <UserMyPage user="user" isLogin={isLogin}>
          <h2 className="MyPage_h2">Notification</h2>
          <div className="project_area">
            <table className="notifications">
                {notifications.map((notification, index) => (
                    <NotificationTable
                        key={index}
                        notification={notification}
                    />
                ))}
            </table>
          </div>
        </UserMyPage>
    );
}

function NotificationTable({ notification }) {
    const { _id, TcTnum, sender, sendTime, type, status } = notification;
    const [msgTitle, setTitle] = useState("");

    useEffect(() => {
        if (type === "A") {
            setTitle(`${TcTnum} project is successfully approved.`);
        } else if (type === "B") {
            setTitle(
                `${sender} has invited you to work with them in ${TcTnum}`
            );
        } else if (type === "D") {
            setTitle(`${TcTnum} project is denied `);
        }
    }, []);

    return (
        <tr className="message">
            <td className="msg_checked">{status ? "unread" : "read"}</td>
            <td className="sender">{sender}</td>
            <td className="title">
                <Link to={`/notification/notification_Detail/${_id}`}>
                    {msgTitle}
                </Link>
            </td>
            <td className="date">
                {new Date(Number(sendTime)).toLocaleDateString()}
            </td>
        </tr>
    );
}
export default Notification;
