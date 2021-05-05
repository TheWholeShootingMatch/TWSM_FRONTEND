import React, { useEffect } from "react";
import Header from "../common/header";
import mainImage from "./mainImage1.png";
import "./main.scss"

function MainPage({ isLogin }) {
    console.log(isLogin);
    return(
        <div>
            <Header isLogin={isLogin}/>
            <div className="main_contents">
              <img src={mainImage} alt="main_image" />
              <button className="btn"> Get started </button>
            </div>
        </div>
    )
}

export default MainPage;
