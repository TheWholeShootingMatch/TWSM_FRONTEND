import React, {useEffect, useRef, useState} from "react";
import * as shared from './SharedTypes';
import * as Y from 'yjs'
import { fabric } from "fabric";

export let externalContextRef = null;
export let externalCanvas = null;

export default function Canvas({ activeSlide }) {
    
    const [canvas, setCanvas] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        setCanvas(initCanvas());
        onStateChange(externalCanvas, setCanvas);
    }, []);

    const initCanvas = () => {
        const newCanvas = new fabric.Canvas("canvas", {
            height: 283 * 2,
            width: 566 * 2,
            backgroundColor: "pink"
        });
        canvasRef.current = newCanvas;
        externalCanvas = canvasRef.current;
        return newCanvas;
    };

    shared.drawingContent.get().observeDeep(function (event) {
        console.log("update state");
        onStateChange(canvasRef, setCanvas);
    })

    return(
        <canvas ref={canvasRef}
        id="canvas"/>
    )
}

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
