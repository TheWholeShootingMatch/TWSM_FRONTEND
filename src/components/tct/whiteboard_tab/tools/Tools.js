import * as shared from './SharedTypes';

/* delete all (trash action) */
export const deleteAllDrawing = () => {
    shared.drawingContent.get().delete(0, shared.drawingContent.get().length);
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
