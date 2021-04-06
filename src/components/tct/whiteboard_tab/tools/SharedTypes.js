import socketIOClient from 'socket.io-client';
import * as Y from 'yjs';
import { LeveldbPersistence } from 'y-leveldb';
import { toUint8Array } from 'js-base64';

const SOCKET_SERVER_URL = ':3001';
const socketClient = socketIOClient('http://localhost:3001');

export const persistence = new LeveldbPersistence('./currentDoc');

export let originSuffix = null;
export let indexeddbPersistence = null;
export let versionDoc = new Y.Doc();
export let doc = new Y.Doc();
export let testDoc = new Y.Doc();
export let activeUserList = doc.getMap('activeUserList');
export const versionList = versionDoc.getArray('versionList');

/* connect to room by shared link */
export const connectToRoom = async (suffix, Ydoc) => {
    // tmp room id
    const roomId = 303;

    //enter the room
    socketClient.current = socketIOClient(SOCKET_SERVER_URL, {
        query: { roomId },
    });

    socketClient.current.on('canvasEvent', (req) => {
        const docUint8Array = new Uint8Array(req);
        console.log(docUint8Array);
        Y.applyUpdate(doc, docUint8Array);
    });

    socketClient.current.on('newPeer', (req) => {
        console.log(req);
    });

    socketClient.current.emit('newPeer');

    if (originSuffix === null) {
        originSuffix = suffix;
        const persistedYdoc = await persistence.getYDoc('doc');
        const binaryEncoded = toUint8Array(Ydoc);
        console.log(binaryEncoded);
        Y.applyUpdate(doc, binaryEncoded);
        // if (persistedYdoc.share.size) {
        //     // console.log(Y.encodeStateAsUpdate(persistedYdoc));
        //     // Y.applyUpdate(doc, Y.encodeStateAsUpdate(persistedYdoc));
        // }

        //reset websocket and version db with suffix (tct num)
        // const binaryEncoded = toUint8Array(Ydoc);
        // console.log(binaryEncoded);
        // Y.applyUpdate(doc, binaryEncoded);
    }
};

doc.on('update', (update) => {
    drawingContent.init(doc.getArray(''));
    console.log(drawingContent.get());
});

// Emit Changes to server (using socket-io)
export const emitYDoc = (data) => {
    socketClient.current.emit('canvasEvent', data);
};

export const getVersionList = () => {
    return versionList;
};

export const addVersion = () => {
    versionList.push([
        {
            date: new Date().getTime(),
            drawingDocState: Y.encodeStateAsUpdate(doc),
            versionDocState: Y.encodeStateAsUpdate(versionDoc),
            clientID: versionDoc.clientID,
        },
    ]);
};

export const renderVersion = (version) => {
    restoreVersion(version);
};

const restoreVersion = (version) => {
    Y.applyUpdate(doc, version.drawingDocState); //doc state update
    Y.applyUpdate(versionDoc, version.versionDocState); //version doc state update
};

export const clearVersionList = () => {
    versionList.delete(0, versionList.length);
};

export let prosemirrorEditorContent = doc.getXmlFragment('prosemirror');

class LocalRemoteUserData extends Y.PermanentUserData {
    /**
     * @param {number} clientid
     * @return {string}
     */
    getUserByClientId(clientid) {
        return super.getUserByClientId(clientid) || 'remote';
    }
    /**
     * @param {Y.ID} id
     * @return {string}
     */
    getUserByDeletedId(id) {
        return super.getUserByDeletedId(id) || 'remote';
    }
}

export const permanentUserData = new LocalRemoteUserData(
    doc,
    versionDoc.getMap('userInfo')
);

/**
 * An array of draw element.
 * A draw element is a Y.Map that has a type attribute. We will support only type "path", but you could also define type "text", or type "rectangle".
 *
 * @type {Y.Array<Y.Map<Y.Array|String|object>>}
 */

export const slideNum = {
    get() {
        console.log(this.active);
        return this.active;
    },
    set(value) {
        this.active = value;
        drawingContent.set(value);
    },
};

export const coordinate = doc.getArray('coordinate');

export const drawingContent = {
    drawingContent: doc.getArray(slideNum.get()),
    get() {
        return this.drawingContent;
    },
    init(data) {
        this.drawingContent = data;
    },
    set(value) {
        this.drawingContent = doc.getArray(value);
        console.log(this.drawingContent);
    },
    clear() {
        this.drawingContent.delete(0, this.drawingContent.length);
    },
};

// doc.on('update', (update) => {
//     console.log('update', update);

//     indexeddbPersistence = new IndexeddbPersistence(
//         'tct-website-' + originSuffix,
//         doc
//     );
// });

export const whiteboardUndoManager = new Y.UndoManager(drawingContent.get());

let undoManager = null;

export const setUndoManager = (nextUndoManager) => {
    if (undoManager) {
        undoManager.clear();
    }
    undoManager = nextUndoManager;
};

// @ts-ignore
window.ydoc = doc;
// @ts-ignore
window.versionDoc = versionDoc;
// @ts-ignore
window.indexeddbPersistence = indexeddbPersistence;
// @ts-ignore
window.prosemirrorEditorContent = prosemirrorEditorContent;
