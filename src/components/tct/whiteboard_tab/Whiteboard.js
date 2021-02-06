import React, {useRef, useState, useEffect, useCallback} from "react";
import TctComponant from "../tct_componant/TctComponant";
import Canvas from "./tools/Canvas";
import {renderVersion, slideNum} from './tools/SharedTypes';
import {deleteAllDrawing, undoDrawing, redoDrawing, showVersionList} from "./tools/Tools";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import axios from "axios";

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
    const [slides, setSlides] = useState([]);
    const [activeSlide, setActiveSlide] = useState("1");
    const nextSlide = useRef(1);

    useEffect(() => {
      axios({
        method: "get",
        withCredentials : true,
        url: '/api/whiteboard',
        data: {
          TcTnum: "000"
        }
      }).then((res) => {
        setSlides(res.data);
        nextSlide.current = res.data.length + 1;
      });
    },[]);

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
            <WhiteBoardSlides slides={slides} setSlides={setSlides} activeSlide={activeSlide} setActiveSlide={setActiveSlide} nextSlide={nextSlide}/>
            <WhiteBoardHeader setType={setType} onClickHistoy={onClickHistoy}/>
            <WhiteBoardContents toolType={toolType} historyArea={historyArea} activeSlide={activeSlide}/>
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

function WhiteBoardContents({ toolType, historyArea, activeSlide }) {

    const [versions, setVersion] = useState([]);

    useEffect(() => {
        setVersion(showVersionList());
    }, []);

    // versions.forEach((version, index) => {
    //  console.log(new Date(version.date).toLocaleString());
    // })

    return(
    <div className="whiteboard_contents">
        {/* <!-- 현재 화이트보드 슬라이드 --> */}
        <div className="current_whiteboard">
            <Canvas toolType={toolType} activeSlide={activeSlide}/>
        </div>
         {/* <!-- default style : display hidden --> */}
         <div className="history_area" ref={historyArea}>
             <ul className="history_list">
                    <li className="version_info">
                        {versions.map((version, index) => (
                            <section onClick={() => renderVersion(version, index > 0 ? versions.get(index-1).snapshot : null)}>{new Date(version.date).toLocaleString()}</section>
                        ))}
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

function WhiteBoardSlides({slides, setSlides, activeSlide, setActiveSlide, nextSlide}){
  const clickSlide = (id) => {  //슬라이드 클릭 시 현재 슬라이드 번호를 바꿔줌
    setActiveSlide(id);
  }

  const addSlide = () => {  //새 슬라이드 추가
    const slide = {
      TcTnum: "000", //tct num 불러와야함
      id: nextSlide.current.toString(),
      name: "new tab"
    };
    axios.post('/api/whiteboard/add', slide, {
      withCredentials: true,
    }).then(res => {
      setSlides([res.body]);
    })
    nextSlide.current += 1;
  }

  const deliteSlide = (id) => {  //슬라이드 삭제
    const slide = {
      TcTnum: "000",
      id: id
    }
    axios.post('/api/whiteboard/delete', slide, {
      withCredentials: true,
    }).then(res => {
      setSlides([res.body]);
    })
  }

  const onChange = (e) => {  //슬라이드 이름 변경
    const slide = {
      TcTnum: "000", //tct num 불러와야함
      id: e.target.name,
      name: e.target.value
    };
    axios.post('/api/whiteboard/update', slide, {
      withCredentials: true,
    }).then(res => {
      setSlides([res]);
    });
  };

  return(
  <div className="whiteboard_slides">
      {slides.map((slide, index) => {
        var slideClass;
        slide.id === activeSlide
          ? (slideClass = 'current_slide slide')
          : (slideClass = 'slide');
        return (
          <div className={slideClass} key={index}>
              <div onClick={() => clickSlide(slide.id)}> <input placeholder={slide.name} name={slide.id} onChange={onChange}/></div>
              <button onClick={() => deliteSlide(slide.id)}>X</button>
          </div>
        );
      })}
      <div className="slide add_slide_btn" onClick={() => addSlide()}>
          슬라이드 더하기
      </div>
  </div>
  )
}

export default WhiteBoard;
