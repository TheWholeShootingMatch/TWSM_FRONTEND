import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch, Router} from "react-router-dom";

import MainPage from "../components/main/MainPage";
// import Header from "../components/main/header/Header";

/* explore - model pages */
import Model from "../components/model/model";
import Model_Detail from "../components/model/model_detail";
import New_Model from "../components/model/new_model";

import TctWorkflow from "../components/tct/workflow_tab/TctWorkflow";
import WhiteBoard from "../components/tct/whiteboard_tab/Whiteboard";
// import TctModel from "../components/tct/model_tab/Model";

import Overview from "../components/mypage/common/Overview";
import Notification from "../components/mypage/user/Notification";
import MyProject from "../components/mypage/user/MyProject";
import CreateProject from "../components/mypage/user/CreateProject";

import RequestedMessage from "../components/mypage/manager/RequestedMessage";
import Signup from "../components/signup/signup";
import RequestedProject from "../components/mypage/user/RequestedProject";
import {Logout, Login} from "../components/login/login";

/* Header 있는 페이지와 없는 페이지 구분 필요 */
/* 유저 형태(관리자/일반유저)에 따라서 mypage 경로 변경해야 함
   지금은 mypage와 manager-page로 구분됨 */

function Routes() {

    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const response = async () => {
            await axios({
                method: 'get',
                withCredentials : true,
                url : '/api/users/login'
            }).then((res) => {
                if(res.data === true ) {
                    setIsLogin(true);
                }
                else {
                    setIsLogin(false);
                }
            });
        };
        response();
    },[]);

    return (
        <BrowserRouter>
            <>
                <Switch>
                        <Route exact path="/"><MainPage isLogin={isLogin} /></Route>
                        <Route exact path="/mypage/user"><Overview type="user" isLogin={isLogin}/></Route>
                        <Route exact path="/mypage/manager"><Overview type="manager" isLogin={isLogin}/></Route>
                        <Route path="/mypage/notification"><Notification isLogin={isLogin} /></Route>
                        <Route path="/mypage/requested-project"><RequestedProject isLogin={isLogin}/></Route>
                        <Route path="/mypage/project"><MyProject isLogin={isLogin}/></Route>
                        <Route path="/mypage/create-project"><CreateProject isLogin={isLogin}/></Route>
                        <Route path="/mypage/requested-message"><RequestedMessage isLogin={isLogin} /></Route>
                        <Route path="/login"><Login setIsLogin={setIsLogin} isLogin={isLogin}/></Route>
                        <Route path="/logout"><Logout setIsLogin={setIsLogin}/></Route>
                        <Route path="/signup"><Signup /></Route>
                        <Route path="/whiteboard"><WhiteBoard /></Route>
                        <Route path="/TctWorkflow"><TctWorkflow /></Route>
                        <Route path="/model/Model"><Model /></Route>
                        <Route path="/model/Model_Detail"><Model_Detail /></Route>
                        <Route path="/model/New_Model"><New_Model /></Route>
                </Switch>
            </>
        </BrowserRouter>
    );
}

export default Routes;
