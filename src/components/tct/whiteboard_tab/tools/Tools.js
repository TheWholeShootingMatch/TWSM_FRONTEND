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
let drawElement = null;
let isDown = false;
let origX;
let circle;
let currentType;

export const mouseDown = (o, canvas) => {
    sharedLine = new Y.Array();
    drawElement = new Y.Map();
    console.log("mouse down");
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
        let id = shared.drawingContent.get().length;
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
        circle.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: this.id
                });
            }
        })(circle.toObject);
        circle.id = id;
        canvas.add(circle);
        drawElement.set('type', 'figure');
    }
}

export const mouseMove = (o, canvas) => {
    console.log("mouse move");
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
    if (sharedLine !== null) {
        const jsonObject = JSON.stringify(circle);
        sharedLine.push([jsonObject]);
        drawElement.set("options", sharedLine);
        shared.drawingContent.get().push([drawElement]);
    }
    if (currentType === "drawing") {
        sharedLine.push([o.path.path]);
    }
}

export const mouseUp = (o, canvas) => {
    getObject(o);
    isDown = false;
}

export const changeStatus = (value, canvas) => {
    canvas.forEachObject(function (obj) {
        obj.selectable = value;
        obj.evented = value;
    })
    canvas.renderAll();
}

export const objectModified = (o, canvas) => {
    if (o.target) {
        console.log("modified", o);
    }
}



export const setToolOption = (type, canvas) => {
    
    currentType = type;
    if (type !== "select") {
        canvas.selection = false;
        canvas.isDrawingMode = false;
        changeStatus(false, canvas);
        canvas.off('mouse:down', function (o) { objectModified(o) });
        canvas.on('mouse:down', function (o) { mouseDown(o, canvas) });
        canvas.on('mouse:move', function (o) { mouseMove(o, canvas) })
        canvas.on('mouse:up', function (o) { mouseUp(o, canvas) });
        canvas.on('path:created', function (o) { getObject(o, canvas) });
    }
    else {
        canvas.selection = true;
        changeStatus(true, canvas);
        canvas.off('mouse:down', function (o) { mouseDown(o, canvas) });
        canvas.off('mouse:move', function (o) { mouseMove(o, canvas) });
        canvas.off('mouse:up', function (o) { mouseUp(o, canvas) });
        canvas.on('mouse:down', function (o) { objectModified(o, canvas) });
    }
};
