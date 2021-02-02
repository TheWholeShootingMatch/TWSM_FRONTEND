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

export const addVersionDoc = () => {

}