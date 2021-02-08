import React, { useEffect,useState } from "react";
import UserMyPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import { Link } from "react-router-dom";


function Notification({isLogin}){
    
    const [notifications] = useFetch('/api/notification');
    console.log(notifications);

    return(
        <UserMyPage user="user" header="Notification" isLogin={isLogin}>
            <tbody className="notifications">
                {notifications.map((notification, index) => <NotificationTable key={index} notification={notification}/>)}
            </tbody>
        </UserMyPage>
    )
}

function NotificationTable({ notification }) {
                
    const { _id, TcTnum, sender, sendTime, type, status } = notification;
    const [msgTitle, setTitle] = useState("");

    useEffect(() => {
        if (type === "A") {
            setTitle(`${TcTnum} 프로젝트가 승인되었습니다.`);
        }
    },[])

    return (
        <tr className="message">
            <td className="msg_checked">{status? "안 읽음" : "읽음"}</td>
            <td className="sender">{sender}</td>
            <Link to={`/notification/notification_Detail/${_id}`}><td className="title">{msgTitle}</td></Link>
            <td className="date">{new Date(Number(sendTime)).toLocaleDateString()}</td>
        </tr>
    )
}
export default Notification;
