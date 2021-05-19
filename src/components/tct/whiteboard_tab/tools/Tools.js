import * as shared from "./SharedTypes";
import { fabric } from "fabric";
import { externalCanvas } from "./Canvas";
import * as Y from "yjs";
import FabricProto from "../extension/FabricProto";

/* delete all (trash action) */
export const deleteAllDrawing = () => {
    shared.drawingContent.clear();
    const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
    shared.emitYDoc(encodeDoc, "clearDoc");
};

/* undo drawing (undo action) */
export const undoDrawing = () => {
    shared.whiteboardUndoManager.undo();
};

/* redo drawing (redo action) */
export const redoDrawing = () => {
    shared.whiteboardUndoManager.redo();
};

export const uploadImage = (fileUploaded, externalCanvas) => {
    let reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    reader.onload = function (e) {
        let img = new Image();
        img.src = e.target.result;
        let id = new Date().getTime().toString();
        img.onload = function () {
            let uploadedImg = new fabric.Image(img);
            uploadedImg.set({
                angle: 0,
                scaleX: 0.1,
                scaleY: 0.1
            });
            uploadedImg.id = id;
            externalCanvas.centerObject(uploadedImg);
            const jsonObject = JSON.stringify(uploadedImg);
            const yArray = new Y.Array();
            const drawElement = new Y.Map();
            yArray.push([jsonObject]);
            drawElement.set("type", "image");
            drawElement.set("options", yArray);
            shared.drawingContent.get().push([drawElement]);
            const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
            shared.emitYDoc(encodeDoc, "addObj");
            externalCanvas.renderAll();
        };
    };
};

let sharedLine = null; //yarray
let drawElement = null; //ymap
let isDown = false;
let origX;
let circle;
let textbox;
let currentType;

export const mouseDown = (o, canvas) => {
    sharedLine = new Y.Array();
    drawElement = new Y.Map();
    if (currentType === "drawing") {
        isDown = true;
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = "#000";
        canvas.freeDrawingBrush.width = 4;
        drawElement.set("type", "drawing");
        drawElement.set("color", "#000");
        drawElement.set("width", 4);
    } else if (currentType === "figure") {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        let id = new Date().getTime().toString();
        origX = pointer.x;
        circle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 1,
            strokeWidth: 1,
            stroke: "black",
            fill: "transparent",
            selectable: false,
            originX: "center",
            originY: "center",
            evented: false
        });
        circle.id = id;
        canvas.add(circle);
        drawElement.set("type", "figure");
    } else if (currentType === "text") {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        textbox = new fabric.Textbox("type", {
            left: pointer.x,
            top: pointer.y,
            width: 10,
            backgroundColor: "white",
            fontFamily: "Inconsolata"
        });
        let id = new Date().getTime().toString();
        textbox.id = id;
        console.log("add text", textbox);
        canvas.add(textbox);
        drawElement.set("type", "text");

        canvas.setActiveObject(textbox);
        textbox.enterEditing();
        canvas.renderAll();
    }
};

export const mouseMove = (o, canvas) => {
    if (currentType === "figure") {
        if (!isDown) {
            return;
        }
        let pointer = canvas.getPointer(o.e);
        circle.set({ radius: Math.abs(origX - pointer.x) });
        canvas.renderAll();
    } else if (currentType === "text") {
        if (!isDown) {
            return;
        }
        let pointer = canvas.getPointer(o.e);
        textbox.set({ width: Math.abs(textbox.left - pointer.x) });
        canvas.renderAll();
    }
};

const emitObject = drawElement => {
    shared.drawingContent.get().push([drawElement]);
    const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
    shared.emitYDoc(encodeDoc, "addObj");
};

//http://jsfiddle.net/softvar/Nt8f7/
const getObject = o => {
    if (sharedLine !== null) {
        if (currentType === "figure") {
            const jsonObject = JSON.stringify(circle);
            sharedLine.push([jsonObject]);
            drawElement.set("options", sharedLine);
            emitObject(drawElement);
        } else if (currentType === "text") {
            const jsonObject = JSON.stringify(textbox);
            sharedLine.push([jsonObject]);
            drawElement.set("options", sharedLine);
            emitObject(drawElement);
        } else if (currentType === "drawing") {
            let id = new Date().getTime().toString();
            const drawing = o.path;
            drawing.id = id;
            const jsonObject = JSON.stringify(drawing);
            sharedLine.push([jsonObject]);
            drawElement.set("options", sharedLine);
            emitObject(drawElement);
        }
    }
};

export const mouseUp = (o, canvas) => {
    if (o && isDown) {
        isDown = false;
        if (currentType === "text" || currentType === "figure") {
            getObject(o);
        } else if (currentType === "drawing") {
            let pointer = canvas.getPointer(o.e);
            sharedLine.push([
                {
                    x: pointer.x,
                    y: pointer.y,
                    event: "up"
                }
            ]);
        }
    }
};

export const changeStatus = (value, canvas) => {
    canvas.forEachObject(function (obj) {
        obj.selectable = value;
        obj.evented = value;
    });
    canvas.renderAll();
};

export const objectModified = o => {
    if (o.target) {
        let actObj = o.target;
        console.log("object modified", actObj.text);
        shared.coordinate.push([
            {
                id: actObj.id,
                left: actObj.left,
                top: actObj.top,
                scaleX: actObj.scaleX,
                scaleY: actObj.scaleY,
                angle: actObj.angle,
                text: actObj.text
            }
        ]);
        const modifiedInfo = [
            {
                id: actObj.id,
                left: actObj.left,
                top: actObj.top,
                scaleX: actObj.scaleX,
                scaleY: actObj.scaleY,
                angle: actObj.angle,
                text: actObj.text
            }
        ];
        shared.emitObject(modifiedInfo);
    }
};

export const afterObjectModified = o => {
    let actObj = o.target;
    externalCanvas.bringToFront(o.target);
    const klass = {};
    externalCanvas.getObjects().map((elem, index) => {
        elem.zIndex = externalCanvas.getObjects().indexOf(elem);
        klass[elem.id] = JSON.stringify(elem);
    });
    if (actObj) {
        shared.drawingContent.get().map(drawElement => {
            const options = drawElement.get("options").toArray()[0];
            if (options) {
                const parseObject = JSON.parse(options);
                if (klass[parseObject.id]) {
                    const newYarray = new Y.Array();
                    const jsonModifiedObject = klass[parseObject.id];
                    newYarray.push([jsonModifiedObject]);
                    drawElement.set("options", newYarray);
                }
            }
        });
        console.log("emitlastDoc");
        const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
        shared.emitYDoc(encodeDoc, "modifiedObj");
    }
};

export const deleteObject = () => {
    const actObj = externalCanvas.getActiveObject();
    if (actObj) {
        const actObjId =
            typeof actObj._objects === "undefined" ? [actObj.id] : actObj._objects.map(object => object.id);

        console.log(actObjId);

        shared.doc.transact(() => {
            actObjId.map(id => {
                shared.drawingContent.get().forEach((drawElement, index) => {
                    const options = drawElement.get("options").toArray()[0];
                    if (options) {
                        const parseObject = JSON.parse(options);
                        if (typeof parseObject !== "undefined") {
                            if (parseObject.id === id) {
                                console.log(
                                    index,
                                    drawElement,
                                    shared.drawingContent.get()._length,
                                    shared.drawingContent.get().toArray()
                                );
                                shared.drawingContent.get().delete(index, 1);
                            }
                        }
                    }
                });
            });
        });
        const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
        shared.emitYDoc(encodeDoc, "clearDoc");
        externalCanvas.remove(actObj);
    }
};

let initType = true;

export const setToolOption = (type, canvas) => {
    currentType = type;
    if (type === "panning") {
        externalCanvas.toggleDragMode(true);
    } else if (type !== "select") {
        canvas.toggleDragMode(false);
        canvas.discardActiveObject();
        canvas.selection = false;
        canvas.isDrawingMode = false;
        changeStatus(false, canvas);
        canvas.off("object:moving");
        canvas.off("object:scaling");
        canvas.off("object:rotating");
        canvas.off("object:modified");
        canvas.off("text: changed");
        canvas.on("mouse:down", function (o) {
            mouseDown(o, canvas);
        });
        canvas.on("mouse:move", function (o) {
            mouseMove(o, canvas);
        });
        canvas.on("mouse:up", function (o) {
            mouseUp(o, canvas);
        });
        canvas.on("path:created", function (o) {
            getObject(o);
        });
    } else {
        canvas.toggleDragMode(false);
        canvas.selection = true;
        canvas.isDrawingMode = false;
        changeStatus(true, canvas);
        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");
        canvas.on("object:moving", function (o) {
            objectModified(o);
        });
        canvas.on("object:scaling", function (o) {
            objectModified(o);
        });
        canvas.on("object:rotating", function (o) {
            objectModified(o);
        });
        canvas.on("object:modified", function (o) {
            objectModified(o);
        });
        canvas.on("object:modified", function (o) {
            afterObjectModified(o);
        });
        canvas.on("text:changed", function (o) {
            objectModified(o);
        });
    }
};
