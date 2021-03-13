import React, {useRef, useState, useEffect, useCallback} from "react";
import TctComponant from "../tct_componant/TctComponant";
import Canvas from "./tools/Canvas";
import {renderVersion, slideList} from './tools/SharedTypes';
import {deleteAllDrawing, undoDrawing, redoDrawing, showVersionList} from "./tools/Tools";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import axios from "axios";

import "./styles/Whiteboard.scss";
import "./styles/WhiteBoardHeader.scss";

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
    const [activeSlide, setActiveSlide] = useState(0);

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
            <WhiteBoardSlides activeSlide={activeSlide} setActiveSlide={setActiveSlide}/>
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

function WhiteBoardSlides({activeSlide, setActiveSlide}){

  const [slides, setSlides] = useState([]);

  slideList.observe(function(event) {
    console.log("observe");
    const response = async() => {
      await axios.post('/api/whiteboard', {TcTnum:"000"}, {
        withCredentials: true,
      }).then((res) => {
        setSlides(res.data);
        setActiveSlide(0)
      })
    }
    response();
  })

  useEffect(() => {
    const response = async() => {
      await axios.post('/api/whiteboard', {TcTnum:"000"}, {
        withCredentials: true,
      }).then((res) => {
        setSlides(res.data);
        setActiveSlide(null)
      })
    }
    response();
  }, [setSlides])

  const clickSlide = (index) => {  //슬라이드 클릭 시 현재 슬라이드 번호를 바꿔줌
    setActiveSlide(index);
    console.log(activeSlide)
  }

  const addSlide = () => {  //새 슬라이드 추가
    const slide = {
      TcTnum: "000", //tct num 불러와야함
      Sname: "new tab"
    };
    const response = async() => {
      await axios.post('/api/whiteboard/add', slide, {
        withCredentials: true,
      }).then((res) => {
        setSlides([...slides, res.data]);
        const newDoc = new Y.Doc();
        slideList.push([newDoc]);
        setActiveSlide(slides.length-1);

      })
    }
    response();
  }

  const deliteSlide = (index, i) => {  //슬라이드 삭제
    // let id = slides[index]._id
    const slide = {
      TcTnum: "000",
      _id: i
    }
    const response = async() => {
      await axios.post('/api/whiteboard/delete', slide, {
        withCredentials: true,
      }).then((res) => {
        setSlides(res.data);
        setActiveSlide(0)
      })
    }
    response();
    slideList.delete(index, index);
  }

  const onChange = (e) => {  //슬라이드 이름 변경
    const slide = {
      TcTnum: "000", //tct num 불러와야함
      _id: e.target.name,
      Sname: e.target.value
    };
    axios.post('/api/whiteboard/rename', slide, {
      withCredentials: true,
    }).then((res) => {
      setSlides(res.data);
    })
  };

  return(
    <div className="whiteboard_slides">
      {slides.map((slide, index) => {
        var slideClass;
        if(slide === null) {
          return (
            <div className={slideClass} key={index}>
            </div>
          );
        } else {
          index === activeSlide
            ? (slideClass = 'current_slide slide')
            : (slideClass = 'slide');
          return (
            <div className={slideClass} key={index}>
                <div onClick={() => clickSlide(index)}>
                  <input placeholder={slide.Sname} name={slide._id} onChange={onChange}/>
                </div>
                <button onClick={() => deliteSlide(index, slide._id)}>X</button>
            </div>
          );
        }
      })}
      <div className="slide add_slide_btn" onClick={() => addSlide()}>
          슬라이드 더하기
      </div>
    </div>
  )
}


export default WhiteBoard;
