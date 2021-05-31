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
            uploadedImg.type = "image";
            uploadedImg.zIndex = 1;
            externalCanvas.centerObject(uploadedImg);
            externalCanvas.add(uploadedImg);
            const jsonObject = JSON.stringify(uploadedImg);
            const drawElement = new Y.Map();
            drawElement.set("options", jsonObject);
            shared.drawingContent.get().push([drawElement]);
            const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
            shared.emitYDoc(encodeDoc, "addObj");
            externalCanvas.renderAll();
        };
    };
};

let drawElement = null; //ymap
let isDown = false;
let origX;
let origYR;
let origXR;
let circle;
let rect;
let textbox;
let currentType;

export const mouseDown = (o, canvas) => {
    drawElement = new Y.Map();
    if (currentType === "drawing") {
        isDown = true;
        canvas.freeDrawingBrush.color = "#000";
        canvas.freeDrawingBrush.width = 4;
    } else if (currentType === "circle") {
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
        circle.zIndex = 1;
        canvas.add(circle);
    } else if (currentType === "rect") {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        let id = new Date().getTime().toString();
        origXR = pointer.x;
        origYR = pointer.y;
        rect = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            strokeWidth: 1,
            stroke: "black",
            fill: "transparent",
            selectable: false,
            evented: false,
            width: 0,
            height: 0
        });
        rect.id = id;
        rect.zIndex = 1;
        canvas.add(rect);
    } else if (currentType === "text") {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        textbox = new fabric.Textbox("type", {
            left: pointer.x,
            top: pointer.y,
            width: 10,
            fontSize: 14,
            backgroundColor: "transparent",
            fontFamily: "Inconsolata"
        });
        let id = new Date().getTime().toString();
        textbox.id = id;
        textbox.zIndex = 1;

        canvas.add(textbox);
        textbox.enterEditing();
        canvas.setActiveObject(textbox);
        canvas.renderAll();
    }
};

export const mouseMove = (o, canvas) => {
    if (!isDown) {
        return;
    } else {
        if (currentType === "circle") {
            let pointer = canvas.getPointer(o.e);
            circle.set({ radius: Math.abs(origX - pointer.x) });
            canvas.renderAll();
        } else if (currentType === "rect") {
            let pointer = canvas.getPointer(o.e);

            var w = Math.abs(pointer.x - origXR),
                h = Math.abs(pointer.y - origYR);

            if (!w || !h) {
                return;
            }
            rect.set("width", w).set("height", h);
            canvas.renderAll();
        } else if (currentType === "text") {
            let pointer = canvas.getPointer(o.e);
            textbox.set({ width: Math.abs(textbox.left - pointer.x) });
            canvas.renderAll();
        }
    }
};

const emitObject = drawElement => {
    shared.drawingContent.get().push([drawElement]);
    const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
    shared.emitYDoc(encodeDoc, "addObj");
};

//http://jsfiddle.net/softvar/Nt8f7/
const getObject = o => {
    if (currentType === "circle") {
        const jsonObject = JSON.stringify(circle);
        drawElement.set("options", jsonObject);
        emitObject(drawElement);
    } else if (currentType === "rect") {
        const jsonObject = JSON.stringify(rect);
        drawElement.set("options", jsonObject);
        emitObject(drawElement);
    } else if (currentType === "text") {
        const jsonObject = JSON.stringify(textbox);
        drawElement.set("options", jsonObject);
        emitObject(drawElement);
    } else if (currentType === "drawing") {
        let id = new Date().getTime().toString();
        const drawing = o.path;
        drawing.id = id;
        drawing.zIndex = 1;
        const jsonObject = JSON.stringify(drawing);
        drawElement.set("options", jsonObject);
        emitObject(drawElement);
    }
};

export const mouseUp = (o, canvas) => {
    if (o && isDown) {
        isDown = false;
        wait = null;
        if (currentType === "text" || currentType === "circle" || currentType === "rect") {
            getObject(o);
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

let wait = null;

export const objectModified = o => {
    if (o.target) {
        let actObj = o.target;
        externalCanvas.bringToFront(o.target);
        const modifiedInfo = {
            id: actObj.id,
            left: actObj.left,
            top: actObj.top,
            scaleX: actObj.scaleX,
            scaleY: actObj.scaleY,
            angle: actObj.angle,
            text: actObj.text,
            width: actObj.width,
            height: actObj.height,
            zIndex: externalCanvas.getObjects().indexOf(actObj)
        };
        shared.coordinate.push([modifiedInfo]);

        if (actObj.type === "textbox") {
            shared.emitObject(JSON.stringify(modifiedInfo));
        } else {
            if (!wait) {
                setTimeout(() => {
                    wait = null;
                    shared.emitObject(JSON.stringify(modifiedInfo));
                }, 200);
            }
            wait = o;
        }
    }
};

export const afterObjectModified = o => {
    let actObj = o.target;
    const klass = {};
    externalCanvas.getObjects().map((elem, index) => {
        elem.zIndex = externalCanvas.getObjects().indexOf(elem);
        klass[elem.id] = JSON.stringify(elem);
    });
    wait = null;
    const modifiedInfo = {
        id: actObj.id,
        left: actObj.left,
        top: actObj.top,
        scaleX: actObj.scaleX,
        scaleY: actObj.scaleY,
        angle: actObj.angle,
        text: actObj.text,
        width: actObj.width,
        height: actObj.height,
        zIndex: externalCanvas.getObjects().indexOf(actObj)
    };

    shared.emitObject(JSON.stringify(modifiedInfo));

    if (actObj) {
        shared.drawingContent.get().map(drawElement => {
            const id = JSON.parse(drawElement.get("options")).id;
            if (klass[id]) {
                if (klass[id] !== drawElement.get("options")) {
                    const jsonModifiedObject = klass[id];
                    drawElement.set("options", jsonModifiedObject);
                }
            }
        });
        const encodeDoc = Y.encodeStateAsUpdate(shared.doc);
        shared.emitYDoc(encodeDoc, "modifiedObj");
    }
};

export const deleteObject = () => {
    const actObj = externalCanvas.getActiveObject();
    if (actObj) {
        const actObjId =
            typeof actObj._objects === "undefined" ? [actObj.id] : actObj._objects.map(object => object.id);

        shared.doc.transact(() => {
            actObjId.map(id => {
                shared.drawingContent.get().forEach((drawElement, index) => {
                    const options = drawElement.get("options");
                    if (options) {
                        const parseObject = JSON.parse(options);
                        if (typeof parseObject !== "undefined") {
                            if (parseObject.id === id) {
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

export const setToolOption = (type, canvas) => {
    currentType = type;
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
    canvas.off("mouse:down");
    canvas.off("path:created");
    if (type === "panning") {
        externalCanvas.toggleDragMode(true);
    } else if (type !== "select") {
        canvas.toggleDragMode(false);
        canvas.discardActiveObject();
        canvas.selection = false;
        if (type === "drawing") {
            canvas.isDrawingMode = true;
        } else {
            canvas.isDrawingMode = false;
        }
        changeStatus(false, canvas);
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
        canvas.off("path:created");
    }
};
