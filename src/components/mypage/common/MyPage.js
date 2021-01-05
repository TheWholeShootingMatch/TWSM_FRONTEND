import React from "react";
import {MHeader} from "../Header";
import {UHeader} from "../Header";

function MyPage({children, user, header}){

    if(user === "manager"){
        return(
            <div>
                <MHeader/>
                <main>
                    <h2 className="mypage_header">{header}</h2>
                    <div className="mypage_contents">
                        {children}
                    </div>
                </main>
            </div>
        )
    }
    else{
        return(
            <div>
                <UHeader/>
                <main>
                    <h2 className="mypage_header">{header}</h2>
                    <div className="mypage_contents">
                        {children}
                    </div>
                </main>
            </div>
        )
    }
}

export default MyPage;