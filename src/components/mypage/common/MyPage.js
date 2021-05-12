import React from "react";
import { MHeader } from "../Header";
import { UHeader } from "../Header";
import Header from "../../common/header";
import "./MyPage.scss";

function MyPage({ children, header, isLogin, user }) {
    console.log(user);
    if (user === "manager") {
        return (
            <div>
                <Header isLogin={isLogin} />
                <div className="mypage_wrapper">
                    <MHeader />
                    <main>
                        {header!=="" ? <h2 className="mypage_header">{header}</h2> : null}
                        <div className="mypage_contents">{children}</div>
                    </main>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Header isLogin={isLogin} />
                <div className="mypage_wrapper">
                    <UHeader />
                    <main>
                        {header!=="" ? <h2 className="mypage_header">{header}</h2> : null}
                        <div className="mypage_contents">{children}</div>
                    </main>
                </div>
            </div>
        );
    }
}

export default MyPage;
