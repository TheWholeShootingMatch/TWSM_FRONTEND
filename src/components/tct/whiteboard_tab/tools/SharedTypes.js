import socketIOClient from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import {getActiveUserState, setActiveUserInfo} from "./activeUserInfo";

const SOCKET_SERVER_URL = ":3001";

const websocketUrl = 'http://localhost:3000'
let lastSnapshot = null

export let originSuffix = null;
export let versionWebsocketProvider = null;
export let versionIndexeddbPersistence = null;
export let indexeddbPersistence = null;
export let webrtcProvider = null;
const gcFilter = item => !Y.isParentOf(prosemirrorEditorContent, item) || (lastSnapshot && (lastSnapshot.sv.get(item.id.client) || 0) <= item.id.clock)

export let versionDoc = new Y.Doc();
export let doc = new Y.Doc({ gcFilter });
export let activeUserList = doc.getMap("activeUserList");
export let versionType = versionDoc.getArray('versions');
export const versionList = versionDoc.getArray('versionList');

/* connect to room by shared link */
export const connectToRoom = (suffix) => {
  originSuffix = suffix;
  //reset websocket and version db with suffix (tct num)
  versionWebsocketProvider = new WebsocketProvider(websocketUrl, 'tct-version-' + suffix, versionDoc, { connect: false });
  versionWebsocketProvider.connectBc();
  versionIndexeddbPersistence = new IndexeddbPersistence('tct-version-' + suffix, versionDoc);
  webrtcProvider = new WebrtcProvider('tct-website-' + suffix, doc);
  indexeddbPersistence = new IndexeddbPersistence('tct-website-' + suffix, doc);

  //detect active users
  let awareness = webrtcProvider.awareness;
  let localUserState = false;

  awareness.on('change', ({ added, updated, removed }) => {
    const currentUsers = getActiveUserState(awareness);
    if (!localUserState) {
      setActiveUserInfo(currentUsers, awareness);
      localUserState = true;
    }
    activeUserList.set('activeUserList', currentUsers);
  })

  // awareness.on('update', ({ added, updated, removed }) => {
  //   // if (removed.length !== 0) {
  //   //   const currentUsers = getActiveUserState(awareness);
  //   //   activeUserList.set('activeUserList', currentUsers);
  //   // }
  //   console.log("update", activeUserList.get('activeUserList'));
  // });

  //connect to version db
  versionIndexeddbPersistence.on('synced', () => {
    lastSnapshot = versionType.length > 0 ? Y.decodeSnapshot(versionType.get(0).snapshot) : Y.emptySnapshot;
    versionType.observe(() => {
      if (versionType.length > 0) {
        const nextSnapshot = Y.decodeSnapshot(versionType.get(0).snapshot)
        undoManager.clear()
        Y.tryGc(nextSnapshot.ds, doc.store, gcFilter)
        lastSnapshot = nextSnapshot
        storeState(indexeddbPersistence)
      }
    })
  })

  //when successfully connect to version db
  versionIndexeddbPersistence.whenSynced.then(() => {
    permanentUserData.setUserMapping(doc, doc.clientID, 'local', {});
  })
}

export const getVersionList = () => {
  return versionList;
}

export const addVersion = () => {
  versionList.push([{
    date: new Date().getTime(),
    drawingDocState: Y.encodeStateAsUpdate(doc),
    versionDocState : Y.encodeStateAsUpdate(versionDoc),
    clientID: versionDoc.clientID
  }]);
}

export const renderVersion = (version) => {
  doc = new Y.Doc({ gcFilter });
  restoreVersion(version);
}

const restoreVersion = (version) => {
  Y.applyUpdate(doc, version.drawingDocState); //doc state update
  Y.applyUpdate(versionDoc, version.versionDocState) //version doc state update
  drawingContent.set();
}

export const clearVersionList = () => {
  versionList.delete(0, versionList.length);
}

export let prosemirrorEditorContent = doc.getXmlFragment('prosemirror')

class LocalRemoteUserData extends Y.PermanentUserData {
  /**
   * @param {number} clientid
   * @return {string}
   */
  getUserByClientId (clientid) {
    return super.getUserByClientId(clientid) || 'remote'
  }
  /**
   * @param {Y.ID} id
   * @return {string}
   */
  getUserByDeletedId (id) {
    return super.getUserByDeletedId(id) || 'remote'
  }
}

export const permanentUserData = new LocalRemoteUserData(doc, versionDoc.getMap('userInfo'));

/**
 * An array of draw element.
 * A draw element is a Y.Map that has a type attribute. We will support only type "path", but you could also define type "text", or type "rectangle".
 *
 * @type {Y.Array<Y.Map<Y.Array|String|object>>}
 */

export const slideNum = {
  get() {
    return this.active;
  },
  set(value) {
    this.active = value;
    drawingContent.set(value);
  }
}

export const coordinate = doc.getArray("coordinate");

export const drawingContent = {
  drawingContent: doc.getArray(slideNum.get()),
  get() {
    return this.drawingContent;
  },
  set(value) {
    this.drawingContent = doc.getArray(value);
    console.log(this.drawingContent);
  },
  clear() {
    this.drawingContent.delete(0, this.drawingContent.length);
  }
}

// Emit Changes to server (using socket-io)
const emitYDoc = (data) => {
  socketClient.current.emit("canvasEvent", data);
};

// Client will get the update and apply those changes
const socketClient = socketIOClient("http://localhost:3001");

// tmp room id
const roomId = 303;

socketClient.current = socketIOClient(SOCKET_SERVER_URL, {
  query: { roomId },
});

socketClient.current.on("canvasEvent", req => {
  console.log(req);
});

emitYDoc("hello world");

export const whiteboardUndoManager = new Y.UndoManager(drawingContent.get());

let undoManager = null

export const setUndoManager = nextUndoManager => {
  if (undoManager) {
    undoManager.clear()
  }
  undoManager = nextUndoManager
}

// @ts-ignore
window.ydoc = doc
// @ts-ignore
window.versionDoc = versionDoc
// @ts-ignore
// window.awareness = awareness
// @ts-ignore
window.webrtcProvider = webrtcProvider
// @ts-ignore
// window.websocketProvider = websocketProvider
// @ts-ignore
window.indexeddbPersistence = indexeddbPersistence
// @ts-ignore
window.prosemirrorEditorContent = prosemirrorEditorContent
