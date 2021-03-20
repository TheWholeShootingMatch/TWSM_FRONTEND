import React, { useEffect } from "react";
import Header from "../common/header";
import Search from "../common/search";

function MainPage({ isLogin }) {
    console.log(isLogin);
    return(
        <div>
            <Header isLogin={isLogin}/>
            <Search />
            <p>main page</p>
        </div>
    )
}

export default MainPage;
