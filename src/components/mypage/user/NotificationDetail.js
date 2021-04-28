import React, { useEffect, useState } from "react";
import {Link, useHistory, useParams} from 'react-router-dom';
import UserMyPage from "../common/MyPage";
import { useFetch } from "../../common/useFetch";
import axios from "axios";

function NotificationDetail({isLogin, props}){

    let { notificationNum } = useParams();

    /* GET notification detail */
    const param = {
        method: "POST",
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id : notificationNum })
    }
    const [notification, setNotification] = useFetch('/api/notification/fetch', param);
    const [msgTitle, setTitle] = useState("");
    const { _id, TcTnum, sender, sendTime, type } = notification;

    useEffect(() => {
        if (type === "A") {
            setTitle(`${TcTnum} 프로젝트가 승인되었습니다.`);
        }
        else if (type === "B") {
          setTitle(`${TcTnum} 프로젝트에 초대되었습니다.`);
        }
    }, [])

    return(
        <UserMyPage user="user" header={msgTitle} isLogin={isLogin}>
            <div className="mail_upper">
                <span>보내는 사람: {sender}</span>
                <span>받는 사람: 나</span>
                <span>보낸 시간: {new Date(Number(sendTime)).toLocaleDateString()}</span>
            </div>
            <div className="mail_content">
                <MsgContent type={type} TcTnum={TcTnum}/>
            </div>
        </UserMyPage>
    )
}

function MsgContent({ type, TcTnum }) {
  const handleAccept = () => {
    axios
    .post('/api/project/invite', {TcTnum:TcTnum})
    .then (res => {  })
    .catch(err => { console.error(err); });
  }

    if (TcTnum) {
      if (type === "A") {
        return (
            <p>If you want to move to the project page, Click on the link below.<br /> <Link to={`/whiteboard/${TcTnum}`}>"http://localhost:3000/whiteboard/{TcTnum}"</Link></p>
        )
      }
      else if (type === "B") {
        return (
            <button onClick={handleAccept}>Accept</button>
        )
      }
    }
    else {
        return(<p>loading...</p>)
    }
}
export default NotificationDetail;
