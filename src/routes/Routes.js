import React from "react";
import { BrowserRouter, Route, Switch, Router} from "react-router-dom";
import MainPage from "../components/main/MainPage";
import TctWorkflow from "../components/tct/workflow_tab/TctWorkflow";
import WhiteBoard from "../components/tct/whiteboard_tab/Whiteboard";
import Header from "../components/main/header/Header";
import Overview from "../components/mypage/common/Overview";
import Notification from "../components/mypage/user/Notification";
import MyProject from "../components/mypage/user/MyProject";
import CreateProject from "../components/mypage/user/CreateProject";
import RequestedProject from "../components/mypage/manager/Requested";

/* Header 있는 페이지와 없는 페이지 구분 필요 */
/* 유저 형태(관리자/일반유저)에 따라서 mypage 경로 변경해야 함
   지금은 mypage와 manager-page로 구분됨 */

function Routes() {
    return (
        <BrowserRouter>
        <>
        <Switch>
                <Route exact path="/"><MainPage /></Route>
                <Route exact path="/mypage/user"><Overview type="user"/></Route>
                <Route exact path="/manager-page"><Overview type="manager"/></Route>
                <Route path="/mypage/notification"><Notification/></Route>
                <Route path="/mypage/project"><MyProject/></Route>
                <Route path="/mypage/create-project"><CreateProject/></Route>
                <Route path="/manager-page/requested-project"><RequestedProject/></Route>
                <Route path="/whiteboard"><WhiteBoard/></Route>
                <Route path="/TctWorkflow"><TctWorkflow/></Route>
                <Route path="/login"><Login/></Route>
                <Route path="/signup"><Signup/></Route>
        </Switch>
        </>
        </BrowserRouter>
    );
}

export default Routes;
