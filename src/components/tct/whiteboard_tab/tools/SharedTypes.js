
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'

// const websocketUrl = 'wss://demos.yjs.dev'
const websocketUrl = 'http://localhost:3000'

let lastSnapshot = null

/**
 * @param {Y.Item} item
 * @return {boolean}
 */

const gcFilter = item => !Y.isParentOf(prosemirrorEditorContent, item) || (lastSnapshot && (lastSnapshot.sv.get(item.id.client) || 0) <= item.id.clock)

const suffix = '-v3'

export const versionDoc = new Y.Doc();
// this websocket provider doesn't connect
export const versionWebsocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website-version' + suffix, versionDoc, { connect: false })
versionWebsocketProvider.connectBc() // only connect via broadcastchannel
export const versionIndexeddbPersistence = new IndexeddbPersistence('yjs-website-version' + suffix, versionDoc)
export const versionType = versionDoc.getArray('versions');
export const versionList = versionDoc.getArray('versionList');


export const getListVersion = () => {
  const versions = versionDoc.getArray('versionList');
  return versions;
}

export const addVersion = () => {
  const prevVersion = versionType.length === 0 ? null : versionType.get(versionType.length - 1);
  const prevSnapshot = prevVersion === null ? Y.emptySnapshot : Y.decodeSnapshot(prevVersion.snapshot);
  const snapshot = Y.snapshot(versionDoc);
  if (prevVersion != null) {
    // account for the action of adding a version to ydoc
    prevSnapshot.sv.set(prevVersion.clientID, prevSnapshot.sv.get(prevVersion.clientID) + 1);
  }
  if (!Y.equalSnapshots(prevSnapshot, snapshot)) {
    versionList.push([{
      date: new Date().getTime(),
      snapshot: Y.encodeSnapshot(snapshot),
      clientID: versionDoc.clientID
    }])
  }
}

export let doc = new Y.Doc({ gcFilter })
// export const websocketProvider = new WebsocketProvider(websocketUrl, 'yjs-website' + suffix, doc)
export const webrtcProvider = new WebrtcProvider('yjs-website' + suffix, doc)
export const awareness = webrtcProvider.awareness // websocketProvider.awareness

export let indexeddbPersistence = new IndexeddbPersistence('yjs-website' + suffix, doc)

export const prosemirrorEditorContent = doc.getXmlFragment('prosemirror')

export const renderVersion = (version, prevVersion) => {
  const currentSnapshot = Y.decodeSnapshot(version.snapshot);
  lastSnapshot = prevVersion === null ? Y.emptySnapshot : Y.decodeSnapshot(prevVersion);
}

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

export const permanentUserData = new LocalRemoteUserData(doc, versionDoc.getMap('users'))
versionIndexeddbPersistence.whenSynced.then(() => {
  permanentUserData.setUserMapping(doc, doc.clientID, 'local', {})
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
