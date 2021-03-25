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
                scaleX: 0.2,
                scaleY: 0.2
            })
            uploadedImg.toObject = (function (toObject) {
                return function () {
                    return fabric.util.object.extend(toObject.call(this), {
                        id: this.id
                    });
                }
            })(uploadedImg.toObject);

            uploadedImg.id = id;
            externalCanvas.centerObject(uploadedImg);
            const jsonObject = JSON.stringify(uploadedImg);
            const yArray = new Y.Array();
            const drawElement = new Y.Map();
            yArray.push([jsonObject]);
            drawElement.set('type', 'image');
            drawElement.set("options", yArray);
            shared.drawingContent.get().push([drawElement]);
            externalCanvas.renderAll();
        }
    }
}

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
        drawElement.set('type', 'drawing');
        drawElement.set('color', '#000');
        drawElement.set('width', 4);
    }
    else if (currentType === "figure") {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        let id = new Date().getTime().toString();
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
    else if (currentType === "text") {
      isDown = true;
      let pointer = canvas.getPointer(o.e);
      textbox = new fabric.Textbox('', {
        left: pointer.x,
        top: pointer.y,
        width : 100,
      });
      let id = new Date().getTime().toString();
      textbox.toObject = (function (toObject) {
          return function () {
              return fabric.util.object.extend(toObject.call(this), {
                  id: this.id
              });
          }
      })(textbox.toObject);
      textbox.id = id;

      canvas.add(textbox);
      drawElement.set('type', 'text');

      canvas.setActiveObject(textbox);
      textbox.enterEditing();
      // canvas.renderAll();
    }
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
    if (sharedLine !== null) {
        if (currentType === "figure") {
            const jsonObject = JSON.stringify(circle);
            sharedLine.push([jsonObject]);
            drawElement.set("options", sharedLine);
            shared.drawingContent.get().push([drawElement]);
        }
        else if (currentType === "text") {
          // currentType = "select";
          const jsonObject = JSON.stringify(textbox);
          sharedLine.push([jsonObject]);
          drawElement.set("options", sharedLine);
          shared.drawingContent.get().push([drawElement]);
        }
        else if (currentType === "drawing") {
            let id = new Date().getTime().toString();;
            const drawing = o.path;
            drawing.toObject = (function (toObject) {
                return function () {
                    return fabric.util.object.extend(toObject.call(this), {
                        id: this.id
                    });
                }
            })(drawing.toObject);
            drawing.id = id;
            const jsonObject = JSON.stringify(drawing);
            sharedLine.push([jsonObject]);
            drawElement.set("options", sharedLine);
            shared.drawingContent.get().push([drawElement]);
        }
    }
}

export const mouseUp = (o, canvas) => {
    if (o && isDown) {
        isDown = false;
        if (currentType === "text" || currentType === "figure") {
            getObject(o);
        }
        else if (currentType === "drawing") {
            let pointer = canvas.getPointer(o.e);
            sharedLine.push([{
                x: pointer.x,
                y: pointer.y,
                event: "up"
            }]);
        }
    }
}

export const changeStatus = (value, canvas) => {
    canvas.forEachObject(function (obj) {
        obj.selectable = value;
        obj.evented = value;
    })
    canvas.renderAll();
}

export const objectModified = (o) => {
    if (o.target) {
        let actObj = o.target;
        shared.coordinate.push([{
            id: actObj.id,
            left: actObj.left,
            top: actObj.top,
            scaleX: actObj.scaleX,
            scaleY: actObj.scaleY,
            angle: actObj.angle,
        }]);
    }
}

export const afterObjectModified = (o) => {
    let actObj = o.target;
    if (actObj) {
        shared.drawingContent.get().map((drawElement) =>
        {
            const options = drawElement.get('options').toArray()[0];
            if (options) {
                const parseObject = JSON.parse(options);
                if (parseObject.id === actObj.id) {
                    const newYarray = new Y.Array();
                    const jsonModifiedObject = JSON.stringify(actObj);
                    console.log(actObj.height, parseObject.height);
                    newYarray.push([jsonModifiedObject]);
                    drawElement.set('options', newYarray);
                }
            }
        })
    }
}

export const setToolOption = (type, canvas) => {

    currentType = type;
    console.log(currentType);
    if (type !== "select") {
        canvas.selection = false;
        canvas.isDrawingMode = false;
        changeStatus(false, canvas);
        canvas.off('object:moving', function (o) { objectModified(o) });
        canvas.off('object:scaling', function (o) { objectModified(o) });
        canvas.off('object:rotating', function (o) { objectModified(o) });
        canvas.off('object:modified', function (o) { afterObjectModified(o) });
        canvas.on('mouse:down', function (o) { mouseDown(o, canvas) });
        canvas.on('mouse:move', function (o) { mouseMove(o, canvas) })
        canvas.on('mouse:up', function (o) { mouseUp(o, canvas) });
        canvas.on('path:created', function (o) { getObject(o) });
    }
    else {
        canvas.selection = true;
        canvas.isDrawingMode = false;
        changeStatus(true, canvas);
        canvas.off('mouse:down', function (o) { mouseDown(o, canvas) });
        canvas.off('mouse:move', function (o) { mouseMove(o, canvas) });
        canvas.off('mouse:up', function (o) { mouseUp(o, canvas) });
        canvas.on('object:moving', function (o) { objectModified(o) });
        canvas.on('object:scaling', function (o) { objectModified(o) });
        canvas.on('object:rotating', function (o) { objectModified(o) });
        canvas.on('object:modified', function (o) { afterObjectModified(o) });
    }
};
