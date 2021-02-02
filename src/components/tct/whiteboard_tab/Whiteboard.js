import React, {useRef, useState, useEffect, useCallback} from "react";
import TctComponant from "../tct_componant/TctComponant";
import Canvas from "./tools/Canvas";
import {addVersion, renderVersion} from './tools/SharedTypes';
import {deleteAllDrawing, undoDrawing, redoDrawing} from "./tools/Tools";
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
    const historyArea = useRef(null);

    const onClickHistoy = () => {
        const displayState = historyArea.current.style.display;
        if (displayState === "block") {
            historyArea.current.style.display = "none";
        }
        else {
            historyArea.current.style.display = "block";
        }
    }

    return (
        <div className="whiteboard_area">
            <WhiteBoardHeader setType={setType} onClickHistoy={onClickHistoy}/>
            <WhiteBoardContents toolType={toolType} historyArea={historyArea} />
            <WhiteBoardSlides/>
        </div>
    )
}

function WhiteBoardHeader({ setType, onClickHistoy }) {
    
    return(
        <div className="whiteboard_header">
            <div className="tools">
                <ul>
                    <li id="select">select</li>
                    <li id="figure" onClick={() => setType("figure")}>figure</li>
                    <li id="text" onClick={() => setType("text")}>text</li>
                    <li id="image" onClick={() => setType("image")}>image</li>
                    <li id="drawing" onClick={() => setType("drawing")}>drawing</li>
                    <li id="undo" onClick={() => {
                        setType("undo");
                        undoDrawing();
                    }}>undo</li>
                    <li id="redo" onClick={() => {
                        setType("redo");
                        redoDrawing();
                    }}>redo</li>
                    <li id="trash" onClick={() => {
                        setType("trash");
                        deleteAllDrawing();
                    }}>trash</li>
                </ul>
            </div>
            <div className="history_btn">
                <button onClick={onClickHistoy}>history</button>
            </div>
        </div>
    )
}

function WhiteBoardContents({ toolType, historyArea }) {

    const [versions, setVersion] = useState([]);


    return(
        <div className="whiteboard_contents">
            <div className="current_whiteboard">
                <Canvas toolType={toolType} />
            </div>
            <div className="history_area" ref={historyArea}>
                <ul className="history_list">
                    <button onClick={() => addVersion("2")}>add</button>
                    <button onClick={() => renderVersion("1")}>render</button>
                    <li className="version_info"></li>
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