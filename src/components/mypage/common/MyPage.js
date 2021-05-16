import React from "react";
import { MHeader } from "../Header";
import { UHeader } from "../Header";
import Header from "../../common/header";
import "./MyPage.scss";

function MyPage({ children, isLogin, user }) {
    console.log(user);
    if (user === "manager") {
        return (
            <>
                <Header isLogin={isLogin} />
                <div className="mypage_wrapper">
                    <MHeader />
                    <main>
                        <div className="mypage_contents">{children}</div>
                    </main>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Header isLogin={isLogin} />
                <div className="mypage_wrapper">
                    <UHeader />
                    <main>
                        <div className="mypage_contents">{children}</div>
                    </main>
                </div>
            </>
        );
    }
}

export default MyPage;
