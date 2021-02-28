import * as shared from './SharedTypes';

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