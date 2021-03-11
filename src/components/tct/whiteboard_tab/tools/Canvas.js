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

    let needToAnimate = false;
    /* detect coordinate for moving object  */
    shared.coordinate.observe(function (event) {
        if (!needToAnimate) { needToAnimate = true }
        else {
            if (canvas) {
                const yaEvent = event.changes.delta;
                if (yaEvent.length > 0) {
                    // if exist previous coordinate
                    if (yaEvent[0].retain) {
                        movingObject(yaEvent[1].insert[0], canvas);
                    }
                    // if not exist previous coordinate 
                    else if (yaEvent[0].insert) {
                        movingObject(yaEvent[0].insert[0], canvas);
                    }
                }
            }
        }
    })
    
    let needTodraw = true;
    /* handle for every changes : initial rendering and drawing element(retain, add, delete) */
    shared.drawingContent.get().observe(function (event) {
        if (canvas) {
            if (needTodraw) {
                onCanvasUpdate(event.changes.delta, canvas);
            }
            else {
                needTodraw = true;
            }
            initialState = false;
        }
    })


    const getObjectById = (id, canvas) => {
        for (let i = 0; i < canvas._objects.length; i++){
            if (canvas._objects[i].id === id) {
                return canvas._objects[i];
            }
        }
    }
    
    const movingObject = (yaEvent, canvas) => {
        if (canvas) {
            const activeObj = getObjectById(yaEvent.id, canvas);
            activeObj.animate({
                left: yaEvent.left,
                top: yaEvent.top,
                scaleX: yaEvent.scaleX,
                scaleY: yaEvent.scaleY,
                angle: yaEvent.angle
            }, {
                duration: 500,
                onChange: function () {
                    activeObj.setCoords();
                    canvas.renderAll();
                }
            });
        }
    }

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
                            if (!getObjectById(parseFigure.id, canvas)) {
                                const circle = new fabric.Circle(parseFigure);
                                canvas.add(circle);
                            }
                        }
                    }
                    else if (type === "image") {
                        const options = drawElement.get('options').toArray()[0];
                        if (options) {
                            const parseImage = JSON.parse(options);
                            if (!getObjectById(parseImage.id, canvas)) {
                                let img = new Image();
                                img.src = parseImage.src;
                                img.onload = function () {
                                    let uploadedImg = new fabric.Image(img, {
                                        width: parseImage.width,
                                        height: parseImage.height,
                                        angle: parseImage.angle,
                                        top: parseImage.top,
                                        left: parseImage.left,
                                        scaleX: parseImage.scaleX,
                                        scaleY: parseImage.scaleY,
                                    })
                                    uploadedImg.toObject = (function (toObject) {
                                        return function () {
                                            return fabric.util.object.extend(toObject.call(this), {
                                                id: this.id
                                            });
                                        }
                                    })(uploadedImg.toObject);
                                    uploadedImg.id = parseImage.id;
                                    canvas.add(uploadedImg);
                                }
                            }
                        }
                    }
                })
            }
            /* delete all objects */
            else if (drawElements.delete) {
                canvas.remove(...canvas._objects);
                shared.coordinate.delete(0, shared.coordinate.length);
                needTodraw = false;
            }
        })
        canvas.renderAll();
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
