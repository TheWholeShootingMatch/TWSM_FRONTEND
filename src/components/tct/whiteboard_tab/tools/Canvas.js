import React, {useEffect, useRef, useState} from "react";
import * as shared from './SharedTypes';
import * as Y from 'yjs'
import { fabric } from "fabric";

export let externalContextRef = null;

export default function Canvas({ toolType, activeSlide }) {
    
    console.log(toolType);
    const canvasRef = useRef(null);
    let sharedLine = null;

    useEffect(() => {
        initCanvas();
        onStateChange(externalContextRef);
    }, []);

    /* handle action for toolType */
    if (toolType === "drawing") {
        canvasRef.current.isDrawingMode = true;
        canvasRef.current.freeDrawingBrush.color = "#000";
        canvasRef.current.freeDrawingBrush.width = 4;
    }
     
    const initCanvas = () => {
        canvasRef.current = new fabric.Canvas("canvas", {
            height: 283 * 2,
            width: 566 * 2,            
            backgroundColor: "pink"
        });
        canvasRef.current.on("mouse:down", (options) => drawingStart(options));
        canvasRef.current.on("mouse:move", (options) => drawingLine(options));
        canvasRef.current.on("mouse:up", drawingFinish);
        externalContextRef = canvasRef.current.getContext("2d");
    };
    
    const drawingStart = (options) => {
        if (toolType !== "drawing") {
            return;
        }
        sharedLine = new Y.Array();
        const drawElement = new Y.Map();
        const coordinate = canvasRef.current.getPointer(options);
        drawElement.set('color','#000');
        drawElement.set('type', 'path');
        drawElement.set('coordinate', { x: coordinate.x, y: coordinate.y });
        console.log("drawing start", coordinate);
        drawElement.set('path', sharedLine);
        shared.drawingContent.get().push([drawElement]);
    };
    
    const drawingLine = (options) => {
        if (canvasRef.current.isDrawingMode) {
            if (sharedLine !== null && toolType === "drawing") {
                const coordinate = canvasRef.current.getPointer(options);
                console.log(sharedLine);
                console.log("drawing Line", coordinate);
                sharedLine.push([{ x: coordinate.x, y: coordinate.y }]);
            }
        }
    };
    
    const drawingFinish = () => {
        canvasRef.current.isDrawingMode = false;
        sharedLine = null;
    };

    shared.drawingContent.get().observe(function (event) {
        console.log("update")
        onStateChange(externalContextRef);
    })

    return(
        <canvas ref={canvasRef}
        id="canvas"/>
    )
}

export const onStateChange = (externalContextRef) => {
    
    externalContextRef.on('object:added', () => {
        console.log('here');
    })

    const yDrawingContent = shared.drawingContent.get();
    const requestAnimationFrame = window.requestAnimationFrame || setTimeout;
    const draw = () => {

        const width = externalContextRef.canvas.width;
        const height = externalContextRef.canvas.height;

        yDrawingContent.forEach(drawElement => {
            if (drawElement.get('type') === 'path') {
                const coordinate = drawElement.get('coordinate');
                const path = drawElement.get('path');
                
                if (path) {
                    console.log("state", path);
                    externalContextRef.beginPath();
                    externalContextRef.moveTo(coordinate.x * width, coordinate.y * height);
                    let lastPoint = coordinate;
                    path.forEach(c => {
                        const pointBetween = {
                            x: (c.x + lastPoint.x) / 2,
                            y: (c.y + lastPoint.y) /2
                        }
                        externalContextRef.quadraticCurveTo(lastPoint.x * width, lastPoint.y * height, pointBetween.x * width, pointBetween.y * height);
                        lastPoint = c;
                    })
                    externalContextRef.lineTo(lastPoint.x * width, lastPoint.y * height);
                    externalContextRef.stroke();
                }
            }
        })
    }
    
    const requestDrawAnimationFrame = () => {
        requestAnimationFrame(draw);
    }
    
    yDrawingContent.observeDeep(requestDrawAnimationFrame);
    requestDrawAnimationFrame();
}

export const versionRender = (externalContextRef) => {
    
    console.log(externalContextRef);
    onStateChange(externalContextRef);

}
