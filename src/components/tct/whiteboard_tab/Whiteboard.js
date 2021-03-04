import React, { useRef, useState, useEffect, useCallback } from "react";
import {Redirect, useParams} from 'react-router-dom';
import TctComponant from "../tct_componant/TctComponant";
import Canvas from "./tools/Canvas";
import { versionRender, externalContextRef } from "./tools/Canvas";
import { connectToRoom, addVersion, renderVersion, clearVersionList } from './tools/SharedTypes';
import { deleteAllDrawing, undoDrawing, redoDrawing, getVersionList, uploadImage } from "./tools/Tools";
import * as Y from "yjs";
import axios from "axios";

import "./styles/Whiteboard.scss";
import "./styles/WhiteBoardHeader.scss";


function WhiteBoard() {

    const { TcTnum } = useParams();
    let [isExist, setExist] = useState(true);
    let [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        /* TcTnum 존재 여부를 db로부터 확인 */
        axios.post('/api/tct', { TcTnum: TcTnum }, {
            withCredentials: true,
        }).then(res => {
            if (!res.data) {
                alert("권한이 없습니다!");
            }
            setLoading(false);
            setExist(res.data);
        })
    },[])

    if (isExist === false) {
        return (<Redirect to={{ pathname: "/" }} />);
    }
    else if (isLoading) {
        return (<TctComponant>
                <div>loading...</div>
            </TctComponant>)
    }
    else {
        connectToRoom(TcTnum);
        return (
            <TctComponant TcTnum={TcTnum}>
                <WhiteBoardArea/>
            </TctComponant>
        )
    }
}

function WhiteBoardArea(){

    const [toolType, setType] = useState("");
    const [toggleHistoryMenu, setToggle] = useState(false);
    const [versions, setVersion] = useState([]);
    
    const hiddenFileInput = useRef(null);
    const historyArea = useRef(null);

    useEffect(() => {
        const versionList = getVersionList();
        console.log(versionList);
        setVersion(versionList);
    }, []);

    const onClickHistoy = () => {
        setToggle(!toggleHistoryMenu);
    }

    const onClickImageInput = () => {
        hiddenFileInput.current.click();
    }

    const onChangeImageInput = (e) => {
        if (e.target.files) {
            const fileUploaded = e.target.files[0];
            const canvas = externalContextRef.current.canvas;
            const context = canvas.getContext('2d');
            uploadImage(fileUploaded, context);
        }
    }
    
    return (
        <div className="whiteboard_area">
            <WhiteBoardHeader setType={setType} onClickHistoy={onClickHistoy} hiddenFileInput={hiddenFileInput} onClickImageInput={onClickImageInput} onChangeImageInput={onChangeImageInput}/>
            <WhiteBoardContents toggleHistoryMenu={toggleHistoryMenu} toolType={toolType} historyArea={historyArea} versions={versions} />
            <WhiteBoardSlides/>
        </div>
    )
}

function WhiteBoardHeader({ setType, onClickHistoy, hiddenFileInput, onClickImageInput, onChangeImageInput}) {

    return(
        <div className="whiteboard_header">
            <div className="tools">
                <ul>
                    <li id="select">select</li>
                    <li id="figure" onClick={() => setType("figure")}>figure</li>
                    <li id="text" onClick={() => setType("text")}>text</li>
                    <li id="image" onClick={() => {;
                        setType("image");
                        onClickImageInput();
                    }}>image</li>
                    <input
                        type="file"
                        accept="image/*" 
                        ref={hiddenFileInput}
                        onChange={onChangeImageInput}
                        style={{ display: 'none' }} />
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