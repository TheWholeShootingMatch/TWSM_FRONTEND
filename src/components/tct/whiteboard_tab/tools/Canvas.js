import React, {useEffect, useRef, useState} from "react";
import * as shared from './SharedTypes';
import * as Y from 'yjs'
import { fabric } from "fabric";

export let externalContextRef = null;
export let externalCanvas = null;

let initialState = true;
let prevCanvas = null;

export default function Canvas({ activeSlide }) {
    
    const [canvas, setCanvas] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    const initCanvas = () => {
        const newCanvas = new fabric.Canvas("canvas", {
            height: 283 * 2,
            width: 566 * 2,
            backgroundColor: "pink"
        });
        if (!initialState) {
            const renderList = canvasRender();
            onCanvasUpdate(renderList, newCanvas)
        }
        canvasRef.current = newCanvas;
        externalCanvas = canvasRef.current;
        return newCanvas;
    };

    /* handle for every changes : initial rendering and canvas events*/
    shared.drawingContent.get().observe(function (event) {
        if (canvas) {
            onCanvasUpdate(event.changes.delta, canvas);
            initialState = false;
        }
    })

    const onCanvasUpdate = (newObject, canvas) => {
        console.log(newObject);
        newObject.forEach(drawElements => {
            if (drawElements.insert) {
                drawElements.insert.forEach(drawElement => {
                    const type = drawElement.get("type");
                    if (type === "figure") {
                        const options = drawElement.get('options').toArray()[0];
                        if (options) {
                            const parseFigure = JSON.parse(options);
                            console.log(parseFigure);
                            const circle = new fabric.Circle(parseFigure);
                            canvas.add(circle);
                            canvas.renderAll();  
                        }
                    }
                })
            }
        })
    }

    /* render canvas */
    const canvasRender = () => {
        const renderList = [];
        const yDrawingContent = shared.drawingContent.get();
        yDrawingContent.forEach(drawElement => {
            renderList.push(drawElement);
        })
        return [{ "insert": renderList }];
    }

    return(
        <canvas ref={canvasRef}
        id="canvas"/>
    )
}

/* ignore */
export const onStateChange = (canvasRef, setCanvas) => {

    const canvas = new fabric.Canvas("canvas", {
            height: 283 * 2,
            width: 566 * 2,
            backgroundColor: "pink"
    });
    const yDrawingContent = shared.drawingContent.get();
    const requestAnimationFrame = window.requestAnimationFrame || setTimeout;

    let needTodraw = true;
    const draw = () => {
        if (needTodraw) {
            console.log("draw");
            needTodraw = false;
            yDrawingContent.forEach(drawElement => {
                if (drawElement.get('type') === 'path') {
                    const options = drawElement.get('options');
                    options.forEach(option => {
                        if (option) {
                            const drawing = new fabric.Path(option, { stroke: "red", fill: false });
                            canvas.add(drawing);
                        }
                    });
                }
                if (drawElement.get('type') === 'figure') {
                    const options = drawElement.get('options');
                    options.forEach(option => {
                        if (option) {
                            const parseFigure = JSON.parse(option);
                            const circle = new fabric.Circle(parseFigure);
                            canvas.add(circle);
                        }
                    })
                }
            }) 
        }
        canvasRef.current = canvas;
        console.log(canvasRef.current, canvas);
        canvasRef.current.renderAll();
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
