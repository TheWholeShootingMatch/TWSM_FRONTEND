import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../common/header";
import mainImage from "./mainImage1.png";
import "./main.scss"

function MainPage({ isLogin }) {
    console.log(isLogin);
    return(
        <div id="wrapper">
            <Header isLogin={isLogin}/>
            <div className="main_contents">
              <div className="image">
              </div>
              <div className="text_content">
                <div className="title">
                  <h1>THE WHOLE <br/>SHOOTING MATCH</h1>
                </div>
                <div className="explain">
                  <p>Choose your model & photographer
                    <br/>and get your team on the same page inside online meeting rooms with
                    <br/>collaborative productivity tools!
                  </p>
                </div>
                <Link className="btn" to="/model/Model/0/L"> Get started </Link>
              </div>
            </div>
        </div>
    )
}

export default MainPage;
