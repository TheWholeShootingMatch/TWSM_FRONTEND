import * as shared from './SharedTypes';
import { fabric } from 'fabric';
import { externalCanvas } from './Canvas';
import * as Y from 'yjs'

/* delete all (trash action) */
export const deleteAllDrawing = () => {
    shared.drawingContent.clear();
} 

/* undo drawing (undo action) */
export const undoDrawing = () => {
    shared.whiteboardUndoManager.undo();
}

/* redo drawing (redo action) */
export const redoDrawing = () => {
    shared.whiteboardUndoManager.redo();
}

export const getVersionList = () => {
    const versions = shared.getVersionList();
    return versions;
}

export const uploadImage = (fileUploaded, context) => {
    let reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    reader.onload = function (e) {
        let img = new Image();
        img.src = e.target.result;
        console.log(img);
        img.onload = function () {
            context.drawImage(img, 0, 0);
        }
    }
}

let sharedLine = null;
let isDown = false;
let origX;
let circle;
let currentType;

export const mouseDown = (o, canvas) => {
    sharedLine = new Y.Array();
    const drawElement = new Y.Map();
    drawElement.set("options", sharedLine);
    
    if (currentType === "drawing") {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = "#000";
        canvas.freeDrawingBrush.width = 4;
        drawElement.set('type', 'path');
        canvas.freeDrawingBrush = new fabric.PencilBrush(externalCanvas.current); 
    }
    else if (currentType === "figure") {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        circle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 1,
            strokeWidth: 1,
            stroke: 'black',
            fill: 'white',
            selectable: false,
            originX: 'center',
            originY: 'center',
            evented: false
        });
        canvas.add(circle);
        drawElement.set('type', 'figure');
    }
    shared.drawingContent.get().push([drawElement]);
}

export const mouseMove = (o, canvas) => {
    if (currentType === "figure") {
        if (!isDown) {
            return;
        }
        let pointer = canvas.getPointer(o.e);
        circle.set({ radius: Math.abs(origX - pointer.x) });
        canvas.renderAll();
    }
}

//http://jsfiddle.net/softvar/Nt8f7/
const getObject = (o) => {
    if (sharedLine !== null && o.target !== null) {
        console.log(o.target.type);
        if (o.target.type === "circle") {
            const jsonObject = JSON.stringify(o);
            sharedLine.push([jsonObject]);
        }
    }
    if (currentType === "drawing") {
        sharedLine.push([o.path.path]);
    }
}

export const mouseUp = (o, canvas) => {
    getObject(o);
    isDown = false;
    sharedLine = null;
}

export const changeStatus = (value, canvas) => {
    canvas.forEachObject(function (obj) {
        obj.selectable = value;
        obj.evented = value;
    })
    canvas.renderAll();
}

export const setToolOption = (type, canvas) => {
    
    currentType = type;
    if (type !== "select") {
        canvas.selection = false;
        canvas.isDrawingMode = false;
        changeStatus(false, canvas);
        canvas.on('mouse:down', function (o) { mouseDown(o, canvas); });
        canvas.on('mouse:move', function (o) { mouseMove(o, canvas) })
        canvas.on('mouse:up', function (o) { mouseUp(o, canvas) });
        canvas.on('object:added', function (o) { getObject(o) });
        canvas.on('path:created', function (o) { getObject(o) });
    }
    else {
        canvas.selection = true;
        changeStatus(true, canvas);
        canvas.off('mouse:down', function (o) { mouseDown(o, canvas); });
        canvas.off('mouse:move', function (o) { mouseMove(o, canvas); });
        canvas.off('mouse:up', function (o) { mouseUp(o, canvas); });
    }
};
