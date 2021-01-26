import * as shared from './SharedTypes';

/* delete all (trash action) */
export const deleteAllDrawing = () => {
    shared.drawingContent.delete(0, shared.drawingContent.length);
} 

/* undo drawing (undo action) */
export const undoDrawing = () => {
    shared.whiteboardUndoManager.undo();
}

/* redo drawing (redo action) */
export const redoDrawing = () => {
    shared.whiteboardUndoManager.redo();
}

export const showVersionList = () => {
    const versions = shared.versionList;
    console.log(versions);
    return versions;
}