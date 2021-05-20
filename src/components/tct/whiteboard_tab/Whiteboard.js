import React, { useRef, useState, useEffect, useCallback, createContext, useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import TctComponant from "../tct_componant/TctComponant";
import Canvas from "./tools/Canvas";
import { IconContext } from "react-icons";
import { BsArrowsMove } from "react-icons/bs";
import { BiShapeSquare, BiPencil, BiTrash, BiNavigation, BiImageAlt, BiText } from "react-icons/bi";
import { connectToRoom, originSuffix, doc, emitVersionDoc } from "./tools/SharedTypes";
import * as Tools from "./tools/Tools";
import { externalCanvas } from "./tools/Canvas";
import * as Y from "yjs";
import axios from "axios";
import { fromUint8Array } from "js-base64";
import "./styles/Whiteboard.scss";

const whiteboardContext = createContext();

function WhiteBoard() {
    const { TcTnum } = useParams();
    let [isExist, setExist] = useState(true);
    let [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        /* TcTnum 존재 여부를 db로부터 확인 */
        axios
            .post(
                "/api/tct",
                { TcTnum: TcTnum },
                {
                    withCredentials: true
                }
            )
            .then(res => {
                if (res.data === false) {
                    alert("권한이 없습니다!");
                    setExist(false);
                } else {
                    connectToRoom(TcTnum, res.data.base64Ydoc);
                }
                setLoading(false);
                setExist(true);
            });
    }, []);

    if (isExist === false) {
        return <Redirect to={{ pathname: "/" }} />;
    } else if (isLoading) {
        return (
            <TctComponant linkType={false}>
                <div>loading...</div>
            </TctComponant>
        );
    } else {
        return (
            <TctComponant TcTnum={TcTnum} linkType={false}>
                <WhiteBoardArea />
            </TctComponant>
        );
    }
}

function WhiteBoardArea() {
    const [toolType, setType] = useState("");
    const [toggleHistoryMenu, setToggle] = useState(false);
    const hiddenFileInput = useRef(null);

    const onClickImageInput = () => {
        hiddenFileInput.current.click();
    };

    const onChangeImageInput = e => {
        e.preventDefault();
        if (e.target.files) {
            const fileUploaded = e.target.files[0];
            Tools.uploadImage(fileUploaded, externalCanvas);
        }
    };

    return (
        <div className="whiteboard_area">
            <whiteboardContext.Provider value={toggleHistoryMenu}>
                <WhiteBoardHeader
                    setType={setType}
                    setToggle={setToggle}
                    toggleHistoryMenu={toggleHistoryMenu}
                    hiddenFileInput={hiddenFileInput}
                    onClickImageInput={onClickImageInput}
                    onChangeImageInput={onChangeImageInput}
                />
                <WhiteBoardContents toolType={toolType} />
                {/* <WhiteBoardSlides/> */}
            </whiteboardContext.Provider>
        </div>
    );
}

function WhiteBoardHeader({
    setType,
    setToggle,
    toggleHistoryMenu,
    hiddenFileInput,
    onClickImageInput,
    onChangeImageInput
}) {
    const [toolActive, setActive] = useState("");

    return (
        <div className="whiteboard_header">
            <IconContext.Provider value={{ className: "tool_icons" }}>
                <div className="tools">
                    <ul>
                        <li
                            id="select"
                            onClick={() => {
                                setActive("select");
                                Tools.setToolOption("select", externalCanvas);
                            }}
                            className={toolActive === "select" && "active"}
                        >
                            <BiNavigation />
                        </li>
                        <li
                            id="panning"
                            onClick={() => {
                                setActive("panning");
                                Tools.setToolOption("panning", externalCanvas);
                            }}
                            className={toolActive === "panning" && "active"}
                        >
                            <BsArrowsMove />
                        </li>
                        <li
                            id="figure"
                            onClick={() => {
                                setActive("figure");
                                Tools.setToolOption("figure", externalCanvas);
                            }}
                            className={toolActive === "figure" && "active"}
                        >
                            <BiShapeSquare />
                        </li>
                        <li
                            id="text"
                            onClick={() => {
                                setActive("text");
                                Tools.setToolOption("text", externalCanvas);
                            }}
                            className={toolActive === "text" && "active"}
                        >
                            <BiText />
                        </li>
                        <li
                            id="image"
                            onClick={() => {
                                setActive("image");
                                onClickImageInput();
                                Tools.setToolOption("image", externalCanvas);
                            }}
                        >
                            <BiImageAlt />
                        </li>
                        <input
                            type="file"
                            accept="image/*"
                            ref={hiddenFileInput}
                            onChange={onChangeImageInput}
                            style={{ display: "none" }}
                        />
                        <li
                            id="drawing"
                            onClick={() => {
                                setActive("drawing");
                                Tools.setToolOption("drawing", externalCanvas);
                            }}
                            className={toolActive === "drawing" && "active"}
                        >
                            <BiPencil />
                        </li>
                        {/* <li
                        id="undo"
                        onClick={() => {
                            setType('undo');
                            Tools.undoDrawing();
                        }}
                    >
                        <UndoIcon />
                    </li>
                    <li
                        id="redo"
                        onClick={() => {
                            setType('redo');
                            Tools.redoDrawing();
                        }}
                    >
                        <RedoIcon/>
                    </li> */}
                        <li
                            id="delete"
                            onClick={() => {
                                setActive("delete");
                                setType("delete");
                                Tools.deleteObject();
                            }}
                        >
                            <BiTrash value={{ className: "tool_icons" }} />
                        </li>
                    </ul>
                </div>
            </IconContext.Provider>
            <div className="history_btn">
                <button onClick={() => setToggle(!toggleHistoryMenu)}>history</button>
            </div>
        </div>
    );
}

function WhiteBoardContents({ toolType }) {
    return (
        <div className="whiteboard_contents">
            <div className="current_whiteboard">
                <Canvas toolType={toolType} />
            </div>
            <HistoryArea />
        </div>
    );
}

function HistoryArea() {
    const toggleHistoryMenu = useContext(whiteboardContext);
    const [versionList, setVersion] = useState([]);

    useEffect(() => {
        if (toggleHistoryMenu) {
            const getVersions = async () => {
                await axios
                    .post(
                        "/api/tctversion/fetch",
                        {
                            tctNum: originSuffix
                        },
                        {
                            withCredentials: true
                        }
                    )
                    .then(res => {
                        if (res.data) {
                            console.log(res.data);
                            setVersion(res.data);
                        }
                    });
            };
            getVersions();
        }
    }, [toggleHistoryMenu]);

    const addVersion = useCallback(async () => {
        const docName = new Date().getTime().toString() + originSuffix;
        const encodePersistedYdoc = fromUint8Array(Y.encodeStateAsUpdate(doc));
        const tctNum = originSuffix;
        const response = async () => {
            await axios
                .post(
                    "/api/tctversion",
                    {
                        docName: docName,
                        encodePersistedYdoc: encodePersistedYdoc,
                        tctNum: tctNum
                    },
                    {
                        withCredentials: true
                    }
                )
                .then(res => {
                    if (res.data) {
                        console.log("version add ", res.data);
                    }
                });
        };
        response();
    }, []);

    return (
        <div className={`history_area ${toggleHistoryMenu ? "active" : ""}`}>
            <ul className="history_list">
                {versionList.map((version, index) => {
                    return (
                        <li className="version_info" key={index} onClick={() => emitVersionDoc(version.docName)}>
                            {new Date(parseInt(version._id.substring(0, 8), 16) * 1000).toLocaleString()}
                        </li>
                    );
                })}
            </ul>
            <div className="history_action_btn">
                <button className="add_btn" onClick={() => addVersion()}>
                    add
                </button>
                <button className="clear_btn">clear</button>
            </div>
        </div>
    );
}

function WhiteBoardSlides() {
    return (
        <div className="whiteboard_slides">
            {/* <div className="slide" id="current_slide">
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
        </div> */}
        </div>
    );
}

export default WhiteBoard;
