import React from "react";
import TctComponant from "../tct_componant/TctComponant";
import "./Whiteboard.scss";

function WhiteBoard(){
    return(
        <TctComponant>
            <WhiteBoardArea/>
        </TctComponant>
    )
}


function WhiteBoardHeader(){
    return(
        <div className="whiteboard_header">
            <div className="tools">
                <ul>
                    <li id="figure">figure</li>
                    <li id="text">text</li>
                    <li id="image">image</li>
                    <li id="drawing">drawing</li>
                </ul>
            </div>
            <div className="history_btn"><button>history</button></div>
        </div>
    )
}

function WhiteBoardContents(){
    return(
    <div className="whiteboard_contents">
        {/* <!-- 현재 화이트보드 슬라이드 --> */}
        <div className="current_whiteboard">
        </div>
         {/* <!-- default style : display hidden --> */}
         <div className="hitory_area">
             <ul className="history_list">
                 <li className="version_info">
                     <section>date</section>
                     <section>
                        <ul>
                            <li>username</li>
                            <li>username</li>
                        </ul>
                    </section>
                </li>
            </ul>
        </div>
    </div>
    )
}

function WhiteBoardSlides(){
    return(
    <div class="whiteboard_slides">
        <div class="slide" id="current_slide">
            슬라이드3 (현재 슬라이드)
        </div>
        <div class="slide">
            슬라이드2
        </div>
        <div class="slide">
            슬라이드3
        </div>
        <div class="slide add_slide_btn">
            슬라이드 더하기
        </div>
    </div>
    )
}

function WhiteBoardArea(){

    return (
        <div className="whiteboard_area">
            <WhiteBoardHeader/>
            <WhiteBoardContents/>
            <WhiteBoardSlides/>
        </div>
    )
}

export default WhiteBoard;