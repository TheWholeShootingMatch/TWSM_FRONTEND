import React, { useEffect, useRef, useState, useCallback } from "react";
import * as shared from "./SharedTypes";
import * as Y from "yjs";
import { fabric } from "fabric";
import FabricProto from "../extension/FabricProto";

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
                console.log(event);
                onCanvasUpdate(event.changes.delta, canvas);
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
            console.log("update object", activeObj);
            if (typeof activeObj !== "undefined") {
                if (activeObj.type === "textbox") {
                    activeObj.text = yaEvent.text;
                }
                activeObj.animate(
                    {
                        left: yaEvent.left,
                        top: yaEvent.top,
                        scaleX: yaEvent.scaleX,
                        scaleY: yaEvent.scaleY,
                        angle: yaEvent.angle
                    },
                    {
                        duration: 500,
                        onChange: function () {
                            activeObj.setCoords();
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
    for (let i = 0; i < canvas._objects.length; i++) {
        if (canvas._objects[i].id === id) {
            return canvas._objects[i];
        }
    }
};

export const onCanvasUpdate = (newObject, canvas) => {
    console.log(newObject);
    newObject.forEach(drawElements => {
        if (drawElements.insert) {
            drawElements.insert.forEach(drawElement => {
                const type = drawElement.get("type");
                if (type === "figure") {
                    const options = drawElement.get("options").toArray()[0];
                    if (options) {
                        const parseFigure = JSON.parse(options);
                        if (!getObjectById(parseFigure.id, canvas)) {
                            const circle = new fabric.Circle(parseFigure);
                            circle.selectable = false;
                            circle.evented = false;
                            canvas.add(circle);
                        }
                    }
                } else if (type === "text") {
                    const options = drawElement.get("options").toArray()[0];
                    if (options) {
                        const parseFigure = JSON.parse(options);
                        console.log(parseFigure.id);
                        if (!getObjectById(parseFigure.id, canvas)) {
                            const textbox = new fabric.Textbox("", parseFigure);
                            textbox.selectable = false;
                            textbox.evented = false;
                            canvas.add(textbox);
                        }
                    }
                } else if (type === "image") {
                    const options = drawElement.get("options").toArray()[0];
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
                                    scaleY: parseImage.scaleY
                                });
                                uploadedImg.id = parseImage.id;
                                uploadedImg.selectable = false;
                                uploadedImg.evented = false;
                                canvas.add(uploadedImg);
                            };
                        }
                    }
                } else if (type === "drawing") {
                    const options = drawElement.get("options").toArray()[0];
                    if (options) {
                        const parseOptions = JSON.parse(options);
                        if (!getObjectById(parseOptions.id, canvas)) {
                            const paths = parseOptions.path;
                            const drawing = new fabric.Path(
                                paths,
                                parseOptions
                            );
                            drawing.id = parseOptions.id;
                            drawing.selectable = false;
                            drawing.evented = false;
                            canvas.add(drawing);
                        }
                    }
                }
            });
        } else if (drawElements.delete) {
            /* delete specific objects */
            const currentObjectIds = Array.from(
                shared.drawingContent.get()
            ).map(drawElement => {
                const options = drawElement.get("options").toArray()[0];
                const parseOptions = JSON.parse(options);
                return parseOptions.id;
            });

            const canvasObjects = canvas.getObjects();
            const deletedObject = canvasObjects.filter(
                obj => currentObjectIds.includes(obj.id) === false
            );
            console.log(currentObjectIds, deletedObject);
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
