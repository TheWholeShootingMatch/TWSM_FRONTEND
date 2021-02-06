import React, { useEffect } from "react";
import Header from "../common/Header";

function MainPage({ isLogin }) {
    console.log(isLogin);
    return(
        <div>
            <Header isLogin={isLogin}/>
            <p>main page</p>
        </div>
    )
}

export default MainPage;