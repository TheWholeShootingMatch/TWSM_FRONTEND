import React, {useEffect, useRef, useState} from "react";
import * as shared from './SharedTypes';
import * as Y from 'yjs'
import { fabric } from 'fabric'; 

export let externalContextRef = null;

export default function Canvas({ toolType, activeSlide }) {
    
    const [canvas, setCanvas] = useState('');
    
    useEffect(() => {
        setCanvas(initCanvas());
    }, []);
    
    const initCanvas = () => (
        new fabric.Canvas('canvas', {
            height: 283 * 2,
            width: 566 *2,
            backgroundColor: 'pink'
        })
    )

    if (toolType === "drawing") {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.BaseBrush(canvas, {
            width: 70,
            color: "black"
        });  
    }

    if(too)

    return(
        <canvas
        className="current_canvas"
        width="566px" height="283px"
        id="canvas"/>
    )
}