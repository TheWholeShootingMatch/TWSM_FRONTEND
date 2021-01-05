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
        <tbody class="notifications">
            <tr class="message">
                <td class="check_msg">true</td>
                <td class="name">kim</td>
                <td class="title">msg title</td>
                <td class="date">2020/11/11</td>
            </tr>
            <tr class="message"></tr>
            <tr class="message"></tr>
        </tbody>
    )
}

export default Notification;