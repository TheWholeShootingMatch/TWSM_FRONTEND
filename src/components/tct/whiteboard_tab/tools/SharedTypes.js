import socketIOClient from 'socket.io-client';
import * as Y from 'yjs';
import { LeveldbPersistence } from 'y-leveldb';
import { toUint8Array } from 'js-base64';

const SOCKET_SERVER_URL = ':3001';
export const socketClient = socketIOClient();

export const persistence = new LeveldbPersistence('./currentDoc');

export let originSuffix = null;
export let indexeddbPersistence = null;
export let doc = new Y.Doc();
let userDoc = new Y.Doc();
export let activeUserList = userDoc.getMap('activeUserList');

/* connect to room by shared link */
export const connectToRoom = async (suffix, Ydoc) => {
    // tmp room id
    const roomId = suffix;
    console.log(roomId);

    console.log(Ydoc);
    //enter the room
    socketClient.current = socketIOClient(SOCKET_SERVER_URL, {
        query: { roomId },
    });

    socketClient.current.on('canvasEvent', (req) => {
        const docUint8Array = new Uint8Array(req);
        // console.log('canvasEvent', docUint8Array);
        Y.applyUpdate(doc, docUint8Array);
    });

    socketClient.current.on('versionEvent', (req) => {
        const docUint8Array = new Uint8Array(req);
        doc = new Y.Doc();
        doc.gc = true;
        restoreVersion(docUint8Array);
        // console.log('versionEvent', docUint8Array);
    });

    const restoreVersion = (docUint8Array) => {
        Y.applyUpdate(doc, docUint8Array);
        console.log(doc.getArray('').toJSON());
        drawingContent.init(doc.getArray(''));
    };

    socketClient.current.emit('peerConnectEvent', {
        id: window.localStorage.getItem('id'),
    });

    socketClient.current.on('peerConnectEvent', (client) => {
        client.forEach((client) => {
            if (!activeUserList.has(client.socketId)) {
                activeUserList.set(client.socketId, [client]);
            }
        });
    });

    socketClient.current.on('peerDisconnectEvent', (client) => {
        console.log(client);
        activeUserList.delete(client);
    });

    if (originSuffix === null) {
        originSuffix = suffix;
        const persistedYdoc = await persistence.getYDoc('doc');
        const ecodedUint8Arr = toUint8Array(Ydoc);
        console.log(ecodedUint8Arr);
        Y.applyUpdate(doc, ecodedUint8Arr);
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
});

// Emit Changes to server (using socket-io)
export const emitYDoc = (data, type) => {
    socketClient.current.emit('canvasEvent', {
        data: data,
        type: type,
    });
};

export const emitVersionDoc = (docName) => {
    socketClient.current.emit('emitVersionDoc', docName);
};

export const emitLastYDoc = (data) => {
    socketClient.current.emit('emitLastYDoc', data);
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

export const permanentUserData = new LocalRemoteUserData(doc);

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
        console.log(this.drawingContent.length);
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
window.indexeddbPersistence = indexeddbPersistence;
// @ts-ignore
window.prosemirrorEditorContent = prosemirrorEditorContent;
