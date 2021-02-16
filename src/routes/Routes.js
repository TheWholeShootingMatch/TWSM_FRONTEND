import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch, Router} from "react-router-dom";

import Header from "../components/common/header";
import MainPage from "../components/main/MainPage";

/* explore - model pages */
import Model from "../components/model/model";
import Model_Detail from "../components/model/model_detail";
import New_Model from "../components/model/new_model";

/* TCT pages */
import TctWorkflow from "../components/tct/workflow_tab/TctWorkflow";
import WhiteBoard from "../components/tct/whiteboard_tab/Whiteboard";

/* my page (common) */
import Overview from "../components/mypage/common/Overview";
import MyProject from "../components/mypage/user/MyProject";

/* my page (general user) */
import CreateProject from "../components/mypage/user/CreateProject";
import RequestedProject from "../components/mypage/user/RequestedProject";
import NotificationDetail from "../components/mypage/user/NotificationDetail";
import Notification from "../components/mypage/user/Notification";

/* my page (manager) */
import RequestedMessage from "../components/mypage/manager/RequestedMessage";

/* signup, login, logout */
import Signup from "../components/signup/signup";
import {Logout, Login} from "../components/login/login";

function Routes() {

    const [isLogin, setIsLogin] = useState(false);
    const [userType, setUserType] = useState();

    return (
        <BrowserRouter>
            <>
                {/* <Header isLogin={isLogin}/> */}
                <Switch>
                        <Route exact path="/"><MainPage isLogin={isLogin} /></Route>
                        <Route exact path="/mypage"><Overview isLogin={isLogin} userType={userType}/></Route>
                        <Route path="/mypage/notification"><Notification isLogin={isLogin} /></Route>
                        <Route path="/mypage/requested-project"><RequestedProject isLogin={isLogin}/></Route>
                        <Route path="/mypage/project"><MyProject isLogin={isLogin}/></Route>
                        <Route path="/mypage/create-project"><CreateProject isLogin={isLogin}/></Route>
                        <Route path="/mypage/requested-message"><RequestedMessage isLogin={isLogin} userType={userType}/></Route>
                        <Route path="/login"><Login setIsLogin={setIsLogin} isLogin={isLogin} setUserType={setUserType}/></Route>
                        <Route path="/logout"><Logout setIsLogin={setIsLogin} setUserType={setUserType}/></Route>
                        <Route path="/signup"><Signup /></Route>
                        <Route path="/whiteboard/:TcTnum"><WhiteBoard /></Route>
                        <Route path="/TctWorkflow"><TctWorkflow /></Route>
                        <Route path="/model/Model/:skip/:sort"><Model> <Header isLogin={isLogin}/> </Model></Route>
                        <Route path="/model/Model_Detail/:modelId"><Model_Detail> <Header isLogin={isLogin}/> </Model_Detail></Route>
                        <Route path="/model/New_Model"><New_Model> <Header isLogin={isLogin} /> </New_Model></Route>
                        <Route path="/notification/notification_Detail/:notificationNum"><NotificationDetail isLogin={isLogin} /></Route>
                </Switch>
            </>
        </BrowserRouter>
    );
}

export default Routes;
