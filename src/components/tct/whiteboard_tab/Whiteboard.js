import React, { useRef, useState, useEffect, useCallback } from "react";
import {useHistory} from 'react-router-dom';
import TctComponant from "../tct_componant/TctComponant";
import Canvas from "./tools/Canvas";
import { versionRender, externalContextRef } from "./tools/Canvas";
import {addVersion, renderVersion, clearVersionList} from './tools/SharedTypes';
import {deleteAllDrawing, undoDrawing, redoDrawing, getVersionList} from "./tools/Tools";
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
    const [toggleHistoryMenu, setToggle] = useState(false);
    const [versions, setVersion] = useState([]);

    const historyArea = useRef(null);

    useEffect(() => {
        const versionList = getVersionList();
        console.log(versionList);
        setVersion(versionList);
    }, []);

    const onClickHistoy = () => {
        setToggle(!toggleHistoryMenu);
    }

    return (
        <div className="whiteboard_area">
            <WhiteBoardHeader setType={setType} onClickHistoy={onClickHistoy}/>
            <WhiteBoardContents toggleHistoryMenu={toggleHistoryMenu} toolType={toolType} historyArea={historyArea} versions={versions} />
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
                <button onClick={() => onClickHistoy()}>history</button>
            </div>
        </div>
    )
}

function WhiteBoardContents({ toolType, historyArea, versions, toggleHistoryMenu }) {
    
    return(
        <div className="whiteboard_contents">
            <div className="current_whiteboard">
                <Canvas toolType={toolType} />
            </div>
            <div ref={historyArea} className={toggleHistoryMenu ? "history_area active" : "history_area"}>
                <ul className="history_list">
                    <button onClick={() => addVersion()}>add</button>
                    <button onClick={() => clearVersionList()}>clear</button>
                    {versions.map((version, index) => (
                        <section key={index} onClick={() => {
                            renderVersion(version);
                            versionRender(externalContextRef);
                        }}>{new Date(version.date).toLocaleString()}</section>
                    ))}
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