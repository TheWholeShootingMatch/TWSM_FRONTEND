import React, {useEffect, useRef, useState} from "react";
import * as shared from './SharedTypes';
import * as Y from 'yjs'

export const deleteAllDrawing = () => {
    shared.drawingContent.delete(0, shared.drawingContent.length);
} 

function Canvas({toolType}){

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(true);
    let sharedLine = null;

    useEffect(() => {
        console.log("here");
        const canvas = canvasRef.current;
        canvas.width = 566 * 2;
        canvas.height = 283 * 2;

        const context = canvas.getContext("2d");
        context.lineCap = context.lineJoin = "round";
        context.strokeStyle = "black";
        context.lineWidth = "1";
        contextRef.current = context;
    },[])

    // const clickToolEvent = (event) => {
    //     if(toolType === "drawing"){
    //         startDrawing(event);
    //     }
    //     else if(toolType === "trash"){
    //         deleteAllDrawing();
    //     }
    // }

    const calculateCoordinate = (event) => {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        return {
            x: (event.clientX - canvasRect.left) / canvasRect.width,
            y: (event.clientY - canvasRect.top) / canvasRect.height
        }
    }
      
    const startDrawing = (event) => {
        if(toolType !== "drawing"){
            // setIsDrawing(false);
            return;
        }
        const drawElement = new Y.Map();
        const coordinate = calculateCoordinate(event);
        drawElement.set('color','black');
        drawElement.set('type','path');
        drawElement.set('coordinate', coordinate);
        sharedLine = new Y.Array();
        drawElement.set('path', sharedLine);
        shared.drawingContent.push([drawElement]);
    }

    const moveDraw = (event) => {
        if(isDrawing && toolType === "drawing"){
            if(sharedLine !== null){
                const coordinate = calculateCoordinate(event);
                sharedLine.push([coordinate]);
            }
        }
    }

    const finishDrawing = () => {
        sharedLine= null;
    }
    
    shared.drawingContent.observe(function(event) {
        const canvas = contextRef.current.canvas;
        const context = canvas.getContext('2d');
        const yDrawingContent = shared.drawingContent;
        const requestAnimationFrame = window.requestAnimationFrame || setTimeout;

        const draw = () => {
            
            context.clearRect(0,0, context.canvas.width, context.canvas.height);
            const width = context.canvas.width;
            const height = context.canvas.height;

            yDrawingContent.forEach(drawElement => {
                if (drawElement.get('type') === 'path') {
                    const coordinate =drawElement.get('coordinate');
                    //   const color = drawElement.get('color');
                    const path = drawElement.get('path');
    
                    if(path){
                        context.beginPath();
                        context.moveTo(coordinate.x * width, coordinate.y * height);
                        let lastPoint = coordinate;
                        path.forEach(c => {
                            const pointBetween = {
                                x : (c.x + lastPoint.x)/2,
                                y : (c.y + lastPoint.y)/2
                            }
                            context.quadraticCurveTo(lastPoint.x * width, lastPoint.y * height, pointBetween.x * width, pointBetween.y * height);
                            lastPoint = c;
                        })
                        context.lineTo(lastPoint.x * width, lastPoint.y * height);
                        context.stroke();
                    }
                }
            });            
        }
        
        const requestDrawAnimationFrame = () => {
            requestAnimationFrame(draw);
        }

        yDrawingContent.observeDeep(requestDrawAnimationFrame);
        requestDrawAnimationFrame();
    });

    return(
        <canvas ref={canvasRef}
        className="current_canvas"
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={moveDraw}
        width="566px" height="283px"/>
    )
}

export default Canvas;