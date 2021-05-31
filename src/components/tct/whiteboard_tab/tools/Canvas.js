import React, { useEffect, useRef, useState, useCallback } from "react";
import * as shared from "./SharedTypes";
import * as Y from "yjs";
import { fabric } from "fabric";
import FabricProto from "../extension/FabricProto";
import zIndex from "@material-ui/core/styles/zIndex";

export let externalContextRef = null;
export let externalCanvas = null;

let initialState = true;
let prevCanvas = null;

export default function Canvas({ activeSlide }) {
    const [canvas, setCanvas] = useState("");
    const canvasRef = useRef(null);

    const initCanvas = useCallback(() => {
        const newCanvas = new fabric.Canvas("canvas", {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: "#F3F3F3"
        });
        if (!initialState) {
            const renderList = canvasRender();
            onCanvasUpdate(renderList, newCanvas);
        }
        newCanvas.on("mouse:wheel", function (opt) {
            var delta = opt.e.deltaY;
            var zoom = newCanvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
        newCanvas.toggleDragMode(false);
        canvasRef.current = newCanvas;
        externalCanvas = canvasRef.current;
        return newCanvas;
    }, []);

    useEffect(() => {
        setCanvas(initCanvas());
        /* handle for every changes : initial rendering and drawing element(retain, add, delete) */
    }, []);

    let needTodraw = true;
    shared.drawingContent.get().observe(function (event) {
        if (canvas) {
            if (needTodraw) {
                const newObject = event.changes.delta;
                newObject.forEach(drawElements => {
                    if (drawElements.insert) {
                        drawElements.insert.forEach(drawElement => {
                            const id = JSON.parse(drawElement.get("options")).id;
                            if (id) {
                                if (getObjectById(id, canvas) === false) {
                                    onCanvasUpdate(event.changes.delta, canvas);
                                }
                            }
                        });
                    } else if (drawElements.delete) {
                        onCanvasUpdate(event.changes.delta, canvas);
                    }
                });
            } else {
                needTodraw = true;
            }
            initialState = false;
        }
    });

    let needToAnimate = false;
    /* detect coordinate for moving object  */
    shared.coordinate.observe(function (event) {
        if (!needToAnimate) {
            needToAnimate = true;
        } else {
            if (canvas) {
                const yaEvent = event.changes.delta;
                if (yaEvent.length > 0) {
                    // if exist previous coordinate
                    if (yaEvent[0].retain) {
                        updateObject(yaEvent[1].insert[0], canvas);
                    }
                    // if not exist previous coordinate
                    else if (yaEvent[0].insert) {
                        updateObject(yaEvent[0].insert[0], canvas);
                    }
                }
            }
        }
    });

    const updateObject = (yaEvent, canvas) => {
        if (canvas) {
            const activeObj = getObjectById(yaEvent.id, canvas);
            if (activeObj) {
                if (activeObj.type === "textbox") {
                    activeObj.text = yaEvent.text;
                    canvas.renderAll();
                }
                activeObj.animate(
                    {
                        left: yaEvent.left,
                        top: yaEvent.top,
                        scaleX: yaEvent.scaleX,
                        scaleY: yaEvent.scaleY,
                        angle: yaEvent.angle,
                        width: yaEvent.width,
                        height: yaEvent.height,
                        zIndex: yaEvent.zIndex
                    },
                    {
                        duration: 500,
                        onChange: function () {
                            activeObj.setCoords();

                            canvas.moveTo(activeObj, yaEvent.zIndex);
                            canvas.renderAll();
                        }
                    }
                );
            }
        }
    };

    return <canvas ref={canvasRef} id="canvas" />;
}

export const getObjectById = (id, canvas) => {
    let result = false;
    for (let i = 0; i < canvas._objects.length; i++) {
        if (canvas._objects[i].id === id) {
            result = true;
            return canvas._objects[i];
        }
    }
    if (result === false) {
        return result;
    }
};

export const onCanvasUpdate = (newObject, canvas) => {
    newObject.forEach(drawElements => {
        if (drawElements.insert) {
            drawElements.insert.forEach(drawElement => {
                const options = drawElement.get("options");
                const parseFigure = JSON.parse(options);
                const type = parseFigure.type;
                if (getObjectById(parseFigure.id, canvas) === false) {
                    if (type === "circle" || type === "rect") {
                        if (type === "circle") {
                            const circle = new fabric.Circle(parseFigure);
                            circle.selectable = false;
                            circle.evented = false;
                            canvas.add(circle);
                            if (typeof circle.zIndex !== "undefined") {
                                canvas.moveTo(circle, circle.zIndex);
                            }
                        } else if (type === "rect") {
                            const rect = new fabric.Rect(parseFigure);
                            rect.selectable = false;
                            rect.evented = false;
                            canvas.add(rect);
                            if (typeof rect.zIndex !== "undefined") {
                                canvas.moveTo(rect, rect.zIndex);
                            }
                        }
                    } else if (type === "textbox") {
                        if (getObjectById(parseFigure.id, canvas) === false) {
                            const textbox = new fabric.Textbox("", parseFigure);
                            textbox.selectable = false;
                            textbox.evented = false;
                            canvas.add(textbox);
                            if (typeof textbox.zIndex !== "undefined") {
                                canvas.moveTo(textbox, textbox.zIndex);
                            }
                        }
                    } else if (type === "image") {
                        if (getObjectById(parseFigure.id, canvas) === false) {
                            let img = new Image();
                            img.src = parseFigure.src;
                            img.onload = function () {
                                let uploadedImg = new fabric.Image(img, {
                                    width: parseFigure.width,
                                    height: parseFigure.height,
                                    angle: parseFigure.angle,
                                    top: parseFigure.top,
                                    left: parseFigure.left,
                                    scaleX: parseFigure.scaleX,
                                    scaleY: parseFigure.scaleY,
                                    zIndex: parseFigure.zIndex
                                });
                                uploadedImg.id = parseFigure.id;
                                uploadedImg.selectable = false;
                                uploadedImg.evented = false;
                                if (!getObjectById(parseFigure.id, canvas)) {
                                    canvas.add(uploadedImg);
                                    if (typeof uploadedImg.zIndex !== "undefined") {
                                        canvas.moveTo(uploadedImg, uploadedImg.zIndex);
                                    }
                                }
                            };
                        }
                    } else if (type === "path") {
                        const parseOptions = JSON.parse(options);
                        if (getObjectById(parseOptions.id, canvas) === false) {
                            const paths = parseOptions.path;
                            const drawing = new fabric.Path(paths, parseOptions);
                            drawing.id = parseOptions.id;
                            drawing.selectable = false;
                            drawing.evented = false;
                            canvas.add(drawing);
                            if (typeof drawing.zIndex !== "undefined") {
                                canvas.moveTo(drawing, drawing.zIndex);
                            }
                        }
                    }
                }
            });
        } else if (drawElements.delete) {
            /* delete specific objects */
            const currentObjectIds = Array.from(shared.drawingContent.get()).map(drawElement => {
                const options = drawElement.get("options");
                const parseOptions = JSON.parse(options);
                return parseOptions.id;
            });

            const canvasObjects = canvas.getObjects();
            const deletedObject = canvasObjects.filter(obj => currentObjectIds.includes(obj.id) === false);
            canvas.remove(...deletedObject);
        }
    });
    canvas.renderAll();
};

export const canvasRender = () => {
    const renderList = [];
    const yDrawingContent = shared.drawingContent.get();
    yDrawingContent.forEach(drawElement => {
        renderList.push(drawElement);
    });
    return [{ insert: renderList }];
};

export const versionRender = externalContextRef => {
    console.log(externalContextRef);
    // onStateChange(externalContextRef);
};
