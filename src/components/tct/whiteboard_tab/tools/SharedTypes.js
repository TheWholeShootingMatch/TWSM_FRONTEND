
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import {setLocalUserInfo} from "./activeUserInfo";
const websocketUrl = 'http://localhost:3000'

let lastSnapshot = null

/**
 * @param {Y.Item} item
 * @return {boolean}
 */

const gcFilter = item => !Y.isParentOf(prosemirrorEditorContent, item) || (lastSnapshot && (lastSnapshot.sv.get(item.id.client) || 0) <= item.id.clock)

const suffix = '/602d0c1801cdf45b14462599'

export let versionDoc = new Y.Doc();
// this websocket provider doesn't connect
export const versionWebsocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website-version' + suffix, versionDoc, { connect: false })
versionWebsocketProvider.connectBc() // only connect via broadcastchannel
export let versionIndexeddbPersistence = new IndexeddbPersistence('yjs-website-version' + suffix, versionDoc)
export let versionType = versionDoc.getArray('versions');
export const versionList = versionDoc.getArray('versionList');

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
  // console.log(version);
  // console.log(Y.encodeStateAsUpdate(doc));
  // console.log(Y.encodeStateAsUpdate(versionDoc));
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

export let doc = new Y.Doc({ gcFilter });

doc.on('update', () => {
  console.log("update!");
})

// export const websocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website' + suffix, doc)
export const webrtcProvider = new WebrtcProvider('yjs-website' + suffix, doc)
export const awareness = webrtcProvider.awareness // websocketProvider.awareness
export let indexeddbPersistence = new IndexeddbPersistence('yjs-website' + suffix, doc)
export let prosemirrorEditorContent = doc.getXmlFragment('prosemirror')

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

/* indexed db 연결 성공 시 */
versionIndexeddbPersistence.whenSynced.then(() => {
  permanentUserData.setUserMapping(doc, doc.clientID, 'local', {})
  setLocalUserInfo(); //local user info update
  console.log("user info update!");
})

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
window.awareness = awareness
// @ts-ignore
window.webrtcProvider = webrtcProvider
// @ts-ignore
// window.websocketProvider = websocketProvider
// @ts-ignore
window.indexeddbPersistence = indexeddbPersistence
// @ts-ignore
window.prosemirrorEditorContent = prosemirrorEditorContent
