import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainPage from "../components/main/MainPage";

/* explore - model pages */
import Model from "../components/model/model";
import ModelDetail from "../components/model/model_detail";
import NewModel from "../components/model/new_model";
import Mportfolio from "../components/model/model_portfolio";

/* explore - Photographer pages */
import Photographer from "../components/photographer/photographer";
import PhotographerDetail from "../components/photographer/photographer_detail";
import NewPhotographer from "../components/photographer/new_photographer";
import Pportfolio from "../components/photographer/photographer_portfolio";

/* TCT pages */
// import TctWorkflow from "../components/tct/workflow_tab/TctWorkflow";
// import WhiteBoard from "../components/tct/whiteboard_tab/Whiteboard";
// import TctModel from "../components/tct/model_tab/tct_model";
// import TctPhotographer from "../components/tct/photographer_tab/tct_photographer";

/* my page (common) */
import Overview from "../components/mypage/common/Overview";
import MyProject from "../components/mypage/user/MyProject";

/* my page (general user) */
import CreateProject from "../components/mypage/user/CreateProject";
import RequestedProject from "../components/mypage/user/RequestedProject";
import NotificationDetail from "../components/mypage/user/NotificationDetail";
import Notification from "../components/mypage/user/Notification";
import BookMark from "../components/mypage/user/BookMark";

/* my page (manager) */
import RequestedMessage from "../components/mypage/manager/RequestedMessage";
import BlockedUser from "../components/mypage/manager/BlockedUser";

/* signup, login, logout */
import Signup from "../components/signup/signup";
import { Logout, Login } from "../components/login/login";

/* collaboration page */
import Collaboration from "../components/collaborate/CollaborateProject";
import NewCollaborate from "../components/collaborate/NewCollaborate";
import CollaborateDetail from "../components/collaborate/CollaborateDetail";

function Routes() {
    const [isLogin, setIsLogin] = useState(false);
    const [userType, setUserType] = useState();

    useEffect(() => {
        const response = async () => {
            await axios({
                method: "get",
                withCredentials: true,
                url: "/api/users/login"
            }).then(res => {
                if (res.data) {
                    //login 기록이 있을 시 redirect("/")
                    window.localStorage.setItem("name", res.data.name);
                    if (res.data.isManager) {
                        setUserType("manager");
                    } else {
                        setUserType("general");
                    }
                    setIsLogin(true);
                } else {
                    setIsLogin(false);
                }
            });
        };
        response();
    }, []);

    return (
        <BrowserRouter>
            <>
                {/* <Header isLogin={isLogin}/> */}
                <Switch>
                    <Route exact path="/">
                        <MainPage isLogin={isLogin} />
                    </Route>
                    <Route exact path="/mypage">
                        <Overview isLogin={isLogin} userType={userType} />
                    </Route>
                    <Route path="/mypage/notification">
                        <Notification isLogin={isLogin} />
                    </Route>
                    <Route path="/mypage/requested-project">
                        <RequestedProject isLogin={isLogin} />
                    </Route>
                    <Route path="/mypage/project">
                        <MyProject isLogin={isLogin} />
                    </Route>
                    <Route path="/mypage/create-project">
                        <CreateProject isLogin={isLogin} />
                    </Route>
                    <Route path="/mypage/requested-message">
                        <RequestedMessage isLogin={isLogin} userType={userType} />
                    </Route>
                    <Route path="/mypage/blocked-user">
                        <BlockedUser isLogin={isLogin} userType={userType} />
                    </Route>
                    <Route path="/mypage/bookmark">
                        <BookMark isLogin={isLogin} userType={userType} />
                    </Route>

                    <Route path="/login">
                        <Login setIsLogin={setIsLogin} isLogin={isLogin} setUserType={setUserType} />
                    </Route>
                    <Route path="/logout">
                        <Logout setIsLogin={setIsLogin} setUserType={setUserType} />
                    </Route>
                    <Route path="/signup">
                        <Signup />
                    </Route>

                    {/* <Route path="/whiteboard/:TcTnum">
                        <WhiteBoard />
                    </Route>
                    <Route path="/TctWorkflow/:TcTnum">
                        <TctWorkflow />
                    </Route>
                    <Route path="/TctModel/:skip/:TcTnum">
                        <TctModel />
                    </Route>
                    <Route path="/TctPhotographer/:skip/:TcTnum">
                        <TctPhotographer />
                    </Route> */}

                    <Route path="/model/Model/:skip/:sort">
                        <Model isLogin={isLogin} />
                    </Route>
                    <Route path="/model/Model_Detail/:modelId">
                        <ModelDetail isLogin={isLogin} />
                    </Route>
                    <Route path="/model/New_Model">
                        <NewModel isLogin={isLogin} />
                    </Route>
                    <Route path="/model/M_portfolio">
                        <Mportfolio isLogin={isLogin} />
                    </Route>

                    <Route path="/Photographer/Photographer/:skip/:sort">
                        <Photographer isLogin={isLogin} />
                    </Route>
                    <Route path="/Photographer/Photographer_Detail/:photographerId">
                        <PhotographerDetail isLogin={isLogin} />
                    </Route>
                    <Route path="/Photographer/New_Photographer">
                        <NewPhotographer isLogin={isLogin} />
                    </Route>
                    <Route path="/Photographer/P_portfolio">
                        <Pportfolio isLogin={isLogin} />
                    </Route>

                    <Route path="/notification/notification_Detail/:notificationNum">
                        <NotificationDetail isLogin={isLogin} />
                    </Route>

                    <Route path="/collaboration/project/:currentPage/:sort">
                        <Collaboration isLogin={isLogin} />
                    </Route>
                    <Route path="/collaboration/Create_Project">
                        <NewCollaborate isLogin={isLogin} />
                    </Route>
                    <Route path="/collaboration/CollaborateDetail/:projectId">
                        <CollaborateDetail isLogin={isLogin} />
                    </Route>
                </Switch>
            </>
        </BrowserRouter>
    );
}

export default Routes;
