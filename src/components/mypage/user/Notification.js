import React from "react";
import UserMyPage from "../common/MyPage";

function Notification(){
    return(
        <UserMyPage user="user" header="Notification">
            <NotificationTable/>
        </UserMyPage>
    )
}

function NotificationTable(){
    return(
        <tbody className="notifications">
            <tr className="message">
                <td className="check_msg">true</td>
                <td className="name">kim</td>
                <td className="title">msg title</td>
                <td className="date">2020/11/11</td>
            </tr>
            <tr className="message"></tr>
            <tr className="message"></tr>
        </tbody>
    )
}

export default Notification;
