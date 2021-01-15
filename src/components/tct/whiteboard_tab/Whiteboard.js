import React, {useRef, useState, useEffect, useCallback} from "react";
import TctComponant from "../tct_componant/TctComponant";
import Canvas, {deleteAllDrawing} from "./tools/Canvas";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import "./styles/Whiteboard.scss";
import "./styles/WhiteBoardHeader.scss";

const ydoc = new Y.Doc();
const type = ydoc.getArray("drawing");

// const websocketProvider = new WebsocketProvider('localhost:3000', 'drawing', ydoc);

function WhiteBoard(){
    return(
        <TctComponant>
            <WhiteBoardArea/>
        </TctComponant>
    )
}

function WhiteBoardArea(){

    const [toolType, setType] = useState("");

    return (
        <div className="whiteboard_area">
            <WhiteBoardHeader setType={setType}/>
            <WhiteBoardContents toolType={toolType}/>
            <WhiteBoardSlides/>
        </div>
    )
}

function WhiteBoardHeader({setType}){
    return(
        <div className="whiteboard_header">
            <div className="tools">
                <ul>
                    <li id="figure" onClick={() => setType("figure")}>figure</li>
                    <li id="text" onClick={() => setType("text")}>text</li>
                    <li id="image" onClick={() => setType("image")}>image</li>
                    <li id="drawing" onClick={() => setType("drawing")}>drawing</li>
                    <li id="trash" onClick={() => {
                        setType("trash");
                        deleteAllDrawing();
                    }}>trash</li>
                </ul>
            </div>
            <div className="history_btn"><button>history</button></div>
        </div>
    )
}

function WhiteBoardContents({toolType}){

    return(
    <div className="whiteboard_contents">
        {/* <!-- 현재 화이트보드 슬라이드 --> */}
        <div className="current_whiteboard">
            <Canvas toolType={toolType}/>
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
    <div className="whiteboard_slides">
        <div className="slide" id="current_slide">
            슬라이드3 (현재 슬라이드)
        </div>
        <div className="slide">
            슬라이드2
        </div>
        <div className="slide">
            슬라이드3
        </div>
        <div className="slide add_slide_btn">
            슬라이드 더하기
        </div>
    </div>
    )
}

export default WhiteBoard;