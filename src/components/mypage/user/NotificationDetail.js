import React, { useEffect, useState } from "react";
import {Link, useHistory, useParams} from 'react-router-dom';
import UserMyPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";

function NotificationDetail({isLogin, props}){

    let { notificationNum } = useParams();

    const param = {
        method: "POST",
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id : notificationNum })
    }
    const [notification, setNotification] = useFetch('/api/notification/fetch', param);
    const [msgTitle, setTitle] = useState("");

    const { _id, TcTnum, sender, sendTime, type, status } = notification;

    useEffect(() => {
        if (type === "A") {
            setTitle(`${TcTnum} 프로젝트가 승인되었습니다.`);
        }
    },[])

    return(
        <UserMyPage user="user" header={msgTitle} isLogin={isLogin}>
            <div className="mail_upper">
                <span>보내는 사람: {sender}</span>
                <span>받는 사람: 나</span>
                <span>보낸 시간: {new Date(Number(sendTime)).toLocaleDateString()}</span>
            </div>
            <div className="mail_content">
                <MsgContent TcTnum={TcTnum}/>
            </div>
        </UserMyPage>
    )
}

function MsgContent({ TcTnum }) {
    return (
        <p>프로젝트로 이동하시려면 아래 링크를 클릭하세요 <br /> <Link to={`/whiteboard/${TcTnum}`}>"http://localhost:3000/whiteboard/{TcTnum}"</Link></p>
    )
}
export default NotificationDetail;
