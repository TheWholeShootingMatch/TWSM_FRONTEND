import React, {useEffect, useRef, useState} from "react";
import * as shared from './SharedTypes';
import * as Y from 'yjs'
import { fabric } from "fabric";

export let externalContextRef = null;

export default function Canvas({ toolType, activeSlide }) {
    
    const [tool, setTool] = useState('');
    const [canvas, setCanvas] = useState('');
    const canvasRef = useRef(null);
    let sharedLine = null;

    useEffect(() => {
        setCanvas(initCanvas());
        onStateChange(externalContextRef);
    }, []);

    /* handle action for toolType */
    if (toolType === "drawing") {
        canvasRef.current.isDrawingMode = true;
        canvasRef.current.freeDrawingBrush.color = "#000";
        canvasRef.current.freeDrawingBrush.width = 4;
        canvasRef.current.freeDrawingBrush = new fabric.PencilBrush(canvasRef.current);
        setTool(toolType);
    }
    else {
        if (canvasRef.current) {
            canvasRef.current.isDrawingMode = false;
        }
    }

    const initCanvas = () => {
        canvasRef.current = new fabric.Canvas("canvas", {
            height: 283 * 2,
            width: 566 * 2,
            backgroundColor: "pink"
        });
        canvasRef.current.on("mouse:down", () => startDrawing());
        canvasRef.current.on("path:created", (options) => getObject(options));
        externalContextRef = canvasRef.current;
    };

    const startDrawing = () => {
        console.log(tool);
        console.log("start drawing");
        sharedLine = new Y.Array();
        const drawElement = new Y.Map();
        drawElement.set('type', 'path');
        drawElement.set("options", sharedLine);
        shared.drawingContent.get().push([drawElement]);
    }
    
    const getObject = (options) => {
        if (sharedLine !== null) {
            sharedLine.push([options.path.path]);
            finishDrawing();
        }
    }

    const finishDrawing = () => {
        sharedLine = null;
    }

    shared.drawingContent.get().observeDeep(function (event) {
        console.log("update state");
        onStateChange(canvasRef.current);
    })


    return(
        <canvas ref={canvasRef}
        id="canvas"/>
    )
}

export const onStateChange = (externalContextRef) => {

    const canvas = new fabric.Canvas("canvas", {
            height: 283 * 2,
            width: 566 * 2,
            backgroundColor: "pink"
    });
    const context = externalContextRef.getContext('2d');
    const yDrawingContent = shared.drawingContent.get();
    const requestAnimationFrame = window.requestAnimationFrame || setTimeout;

    let needTodraw = true;
    const draw = () => {
        if (needTodraw) {
            console.log("draw");
            needTodraw = false;
            context.clearRect(0, 0, context.width, context.height);
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
            }) 
        }
        externalContextRef.current = canvas;
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
