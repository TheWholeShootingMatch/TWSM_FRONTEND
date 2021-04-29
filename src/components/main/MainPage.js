import React, { useEffect } from "react";
import Header from "../common/header";
import Search from "../common/search";
import "./main.scss"

function MainPage({ isLogin }) {
    console.log(isLogin);
    return(
        <div>
            <Header isLogin={isLogin}/>
            <div className="main_contents">
              <img src="../common/mainImage.png" alt="main_image" />
              <button> Get started </button>
            </div>
        </div>
    )
}

export default MainPage;
