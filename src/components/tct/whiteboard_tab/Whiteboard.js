import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import TctComponant from "../tct_componant/TctComponant";
import Canvas from "./tools/Canvas";
import { versionRender, externalContextRef } from "./tools/Canvas";
import {addVersion, renderVersion, clearVersionList, connectToRoom} from './tools/SharedTypes';
import { deleteAllDrawing, undoDrawing, redoDrawing, getVersionList } from "./tools/Tools";
import "./styles/Whiteboard.scss";
import "./styles/WhiteBoardHeader.scss";
import { isNonNullExpression } from "typescript";

function WhiteBoard() {
    
    const { TcTnum } = useParams();
    let [isExist, setExist] = useState(null);
    let [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.post('/api/tct', { TcTnum }, {
            withCredentials: true,
        }).then(res => {
            setExist(res.data);
        })
        setLoading(false);
    },[])

    if (isExist === false) {
        return (<p> 접근 권한이 없습니다. 이전 페이지로 이동하세요 </p>);
    }
    else if (isLoading) {
        return (<p>loading...</p>)
    }
    else {
        connectToRoom(TcTnum);
        return (
            <TctComponant>
                <WhiteBoardArea/>
            </TctComponant>
        )
    }
}

function WhiteBoardArea(){

    const [toolType, setType] = useState("");
    const [toggleHistoryMenu, setToggle] = useState(false);
    const [versions, setVersion] = useState([]);

    const historyArea = useRef(null);

    useEffect(() => {
        const versionList = getVersionList();
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