import React from "react";
import {MHeader} from "../Header";
import { UHeader } from "../Header";
import Header from "../../main/header/Header";
import "./MyPage.scss";

function MyPage({ children, user, header, isLogin }) {
    
    if(user === "manager"){
        return (
        <div>
            <Header isLogin={isLogin}/>
            <div className="mypage_wrapper">
                <MHeader/>
                <main>
                    <h2 className="mypage_header">{header}</h2>
                    <div className="mypage_contents">
                        {children}
                    </div>
                </main>
            </div>
        </div>
        )
    }
    else{
        return (
            <div>
                <Header isLogin={isLogin}/>
                <div className="mypage_wrapper">
                    <UHeader/>
                    <main>
                        <h2 className="mypage_header">{header}</h2>
                        <div className="mypage_contents">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}

export default MyPage;