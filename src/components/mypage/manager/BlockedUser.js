import React, { useState, useEffect } from "react";
import ManagerPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import axios from "axios";
import "./BlockedUser.scss";

function BlockedUser({ isLogin, userType }) {
    const [userList] = useFetch("/api/users/user-list");

    return (
        <ManagerPage
            user={userType}
            isLogin={isLogin}
        >
            <h2 className="MyPage_h2">Blocked User</h2>
            <div className="project_area">
            <tbody className="requested_projects">
                {userList.map((user, index) => (
                    <UserList key={index} user={user} />
                ))}
            </tbody>
            </div>
        </ManagerPage>
    );
}

function UserList({ user }) {
    const { name, id, email, status } = user;
    const [userStatus, setUserStatus] = useState(status);
    const [restoreBtn, setRestoreBtn] = useState(false);
    const [blockedBtn, setBlockedBtn] = useState(false);

    useEffect(() => {
        /* true : blocked status */
        if (userStatus) {
            setBlockedBtn(true);
            setRestoreBtn(false);
        } else {
            setRestoreBtn(true);
            setBlockedBtn(false);
        }
    }, [userStatus]);

    const onRestore = () => {
        axios
            .post("/api/users/restore", { id: id }, { withCredentials: true })
            .then(res => {
                if (res.data) {
                    setUserStatus(false);
                }
            })
            .catch(err => {
                alert("fail to restore user!");
            });
    };

    const onBlock = () => {
        axios
            .post("/api/users/block", { id: id }, { withCredentials: true })
            .then(res => {
                if (res.data) {
                    setUserStatus(true);
                }
            })
            .catch(err => {
                alert("fail to block user");
            });
    };

    return (
        <tr className="user_info">
            <td className="username">{name}</td>
            <td className="id">{id}</td>
            <td className="email">{email}</td>
            <td className="approve_btn">
                <button onClick={() => onRestore()} disabled={restoreBtn}>
                    Restore
                </button>
            </td>
            <td className="deny_btn">
                <button onClick={() => onBlock()} disabled={blockedBtn}>
                    Blocked
                </button>
            </td>
        </tr>
    );
}

export default BlockedUser;
