import React, {
    useRef,
    useState,
    useEffect,
    useCallback,
    createContext,
    useContext,
} from 'react';
import { Redirect, useParams } from 'react-router-dom';
import TctComponant from '../tct_componant/TctComponant';
// import CropOriginalIcon from '@material-ui/icons/CropOriginal';
// import TextFieldsIcon from '@material-ui/icons/TextFields';
// import GestureIcon from '@material-ui/icons/Gesture';
// import PanToolIcon from '@material-ui/icons/PanTool';
// import DeleteIcon from '@material-ui/icons/Delete';
// import NearMeIcon from '@material-ui/icons/NearMe';
// import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
// import UndoIcon from '@material-ui/icons/Undo';
// import RedoIcon from '@material-ui/icons/Redo';
import Canvas from './tools/Canvas';
import {
    connectToRoom,
    originSuffix,
    doc,
    emitVersionDoc,
} from './tools/SharedTypes';
import * as Tools from './tools/Tools';
import { externalCanvas } from './tools/Canvas';
import * as Y from 'yjs';
import axios from 'axios';
import { fromUint8Array } from 'js-base64';

import './styles/Whiteboard.scss';
import './styles/WhiteBoardHeader.scss';
import { findAllByTestId } from '@testing-library/dom';

const whiteboardContext = createContext();

function WhiteBoard() {
    const { TcTnum } = useParams();
    let [isExist, setExist] = useState(true);
    let [isLoading, setLoading] = useState(false);
    let [title, setTitle] = useState('');

    useEffect(() => {
        setLoading(true);
        /* TcTnum 존재 여부를 db로부터 확인 */
        axios
            .post(
                '/api/tct',
                { TcTnum: TcTnum },
                {
                    withCredentials: true,
                }
            )
            .then((res) => {
                if (res.data === false) {
                    alert('권한이 없습니다!');
                    setExist(false);
                } else {
                    setTitle(res.data.title);
                    connectToRoom(TcTnum, res.data.base64Ydoc);
                }
                setLoading(false);
                setExist(true);
            });
    }, []);

    if (isExist === false) {
        return <Redirect to={{ pathname: '/' }} />;
    } else if (isLoading) {
        return (
            <TctComponant>
                <div>loading...</div>
            </TctComponant>
        );
    } else {
        return (
            <TctComponant TcTnum={TcTnum} title={title}>
                <WhiteBoardArea />
            </TctComponant>
        );
    }
}

function WhiteBoardArea() {
    const [toolType, setType] = useState('');
    const [toggleHistoryMenu, setToggle] = useState(false);
    const hiddenFileInput = useRef(null);

    const onClickImageInput = () => {
        hiddenFileInput.current.click();
    };

    const onChangeImageInput = (e) => {
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
    onChangeImageInput,
}) {
    return (
        <div className="whiteboard_header">
            <div className="tools">
                <ul>
                    <li
                        id="select"
                        onClick={() => {
                            Tools.setToolOption('select', externalCanvas);
                        }}
                    >
                        Select
                        {/* <NearMeIcon /> */}
                    </li>
                    <li
                        id="panning"
                        onClick={() => {
                            Tools.setToolOption('panning', externalCanvas);
                        }}
                    >
                        Panning
                        {/* <PanToolIcon /> */}
                    </li>
                    <li
                        id="figure"
                        onClick={() => {
                            Tools.setToolOption('figure', externalCanvas);
                        }}
                    >
                        Figure
                        {/* <RadioButtonUncheckedIcon /> */}
                    </li>
                    <li
                        id="text"
                        onClick={() => {
                            Tools.setToolOption('text', externalCanvas);
                        }}
                    >
                        Text
                        {/* <TextFieldsIcon /> */}
                    </li>
                    <li
                        id="image"
                        onClick={() => {
                            onClickImageInput();
                            Tools.setToolOption('image', externalCanvas);
                        }}
                    >
                        Image
                        {/* <CropOriginalIcon /> */}
                    </li>
                    <input
                        type="file"
                        accept="image/*"
                        ref={hiddenFileInput}
                        onChange={onChangeImageInput}
                        style={{ display: 'none' }}
                    />
                    <li
                        id="drawing"
                        onClick={() => {
                            Tools.setToolOption('drawing', externalCanvas);
                        }}
                    >
                        Drawing
                        {/* <GestureIcon /> */}
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
                            setType('delete');
                            Tools.deleteObject();
                        }}
                    >
                        Delete
                        {/* <DeleteIcon /> */}
                    </li>
                    {/* <li
                        id="trash"
                        onClick={() => {
                            setType('trash');
                            Tools.deleteAllDrawing();
                        }}
                    >
                        trash
                    </li> */}
                </ul>
            </div>
            <div className="history_btn">
                <button onClick={() => setToggle(!toggleHistoryMenu)}>
                    history
                </button>
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
                        '/api/tctversion/fetch',
                        {
                            tctNum: originSuffix,
                        },
                        {
                            withCredentials: true,
                        }
                    )
                    .then((res) => {
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
                    '/api/tctversion',
                    {
                        docName: docName,
                        encodePersistedYdoc: encodePersistedYdoc,
                        tctNum: tctNum,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then((res) => {
                    if (res.data) {
                        console.log('version add ', res.data);
                    }
                });
        };
        response();
    }, []);

    return (
        <div className={`history_area ${toggleHistoryMenu ? 'active' : ''}`}>
            <ul className="history_list">
                <button onClick={() => addVersion()}>add</button>
                <button>clear</button>
                {versionList.map((version, index) => {
                    return (
                        <li
                            className="version_info"
                            key={index}
                            onClick={() => emitVersionDoc(version.docName)}
                        >
                            {new Date(
                                parseInt(version._id.substring(0, 8), 16) * 1000
                            ).toLocaleString()}
                        </li>
                    );
                })}
            </ul>
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
