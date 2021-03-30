import React, {useEffect, useRef, useState, useCallback} from "react";
import * as shared from './SharedTypes';
import * as Y from 'yjs'
import { fabric } from "fabric";
import { deleteObject } from "./Tools";

export let externalContextRef = null;
export let externalCanvas = null;

let initialState = true;
let prevCanvas = null;

export default function Canvas({ activeSlide }) {

    const [canvas, setCanvas] = useState('');
    const canvasRef = useRef(null);

    const handleUserKeyPress = useCallback(event => {
        const { keyCode } = event;
        if (keyCode === 8) {
            deleteObject();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    }, [handleUserKeyPress]);
    
    const initCanvas = useCallback(() => {
        const newCanvas = new fabric.Canvas("canvas", {
            height: 283 * 2,
            width: 566 * 2,
            backgroundColor: "#F3F3F3"
        });
        if (!initialState) {
            const renderList = canvasRender();
            onCanvasUpdate(renderList, newCanvas)
        }
        newCanvas.on('mouse:wheel', function (opt) {
            var delta = opt.e.deltaY;
            var zoom = newCanvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
        canvasRef.current = newCanvas;
        externalCanvas = canvasRef.current;
        return newCanvas;
    },[]);


    useEffect(() => {
        setCanvas(initCanvas());
    }, []);
    
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
                console.log(event);
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
            if (activeObj.type === "textbox") {
              activeObj.text = yaEvent.text;
            }
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
                    else if (type === "text") {
                        const options = drawElement.get('options').toArray()[0];
                        if (options) {
                            const parseFigure = JSON.parse(options);
                            if (!getObjectById(parseFigure.id, canvas)) {
                                const textbox = new fabric.Textbox("", parseFigure);
                                canvas.add(textbox);
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
                    else if (type === "drawing") {
                        const options = drawElement.get('options').toArray()[0];
                        if (options) {
                            const parseOptions = JSON.parse(options);
                            if (!getObjectById(parseOptions.id, canvas)) {
                                const paths = parseOptions.path;
                                const drawing = new fabric.Path(paths, parseOptions);
                                drawing.toObject = (function (toObject) {
                                    return function () {
                                        return fabric.util.object.extend(toObject.call(this), {
                                            id: this.id
                                        });
                                    }
                                })(drawing.toObject);
                                drawing.id = parseOptions.id;
                                canvas.add(drawing);
                            }
                        }


                        // const options = drawElement.get('options').toArray()[0];
                        // const path = drawElement.get('path').toJSON();
                        // console.log(path);
                        // console.log(options);
                        // if (options) {
                        //     const parseDrawing = JSON.parse(options);
                        //     if (!getObjectById(parseDrawing.id, canvas)) {
                        //         console.log(parseDrawing);
                        //     }

                        // }
                        // canvas.isDrawingMode = true;
                        // canvas.freeDrawingBrush.width = 4;
                        // canvas.freeDrawingBrush.color = 'black';
                        // let path = drawElement.get('path');
                        // if (path) {
                        //     path.forEach((c, index) => {
                        //         let o = { c, e: {} };
                        //         if (c.event === "start") {
                        //             canvas.freeDrawingBrush.onMouseDown({x: c.x, y:c.y}, o);
                        //         }
                        //         else if (index === (path.length - 1)) {
                        //             canvas.freeDrawingBrush.onMouseUp(o);
                        //         }
                        //         else {
                        //             canvas.freeDrawingBrush.onMouseMove({x: c.x, y:c.y}, o);
                        //         }
                        //     })
                        // }
                    }
                })
            }
            /* delete specific objects */
            else if (drawElements.delete) {
                const currentObjectIds = Array.from(shared.drawingContent.get()).map((drawElement) => {
                    const options = drawElement.get('options').toArray()[0];
                    const parseOptions = JSON.parse(options);
                    return parseOptions.id
                })
                
                for (let i = 0; i < canvas._objects.length; i++){
                    if (!currentObjectIds.includes(canvas._objects[i].id)) {
                        console.log(canvas._objects[i]);
                        canvas.remove(canvas._objects[i]);
                    }
                }                
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

export const versionRender = (externalContextRef) => {

    console.log(externalContextRef);
    // onStateChange(externalContextRef);

}
