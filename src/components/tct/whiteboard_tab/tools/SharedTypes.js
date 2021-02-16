
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence, storeState } from 'y-indexeddb'
import { setLocalUserInfo } from "./activeUserInfo";

const websocketUrl = 'http://localhost:3000';
let lastSnapshot = null;

export let versionWebsocketProvider = null;
export let versionIndexeddbPersistence = null;
export let indexeddbPersistence = null;
export let webrtcProvider = null;
export let awareness = null;

const gcFilter = item => !Y.isParentOf(prosemirrorEditorContent, item) || (lastSnapshot && (lastSnapshot.sv.get(item.id.client) || 0) <= item.id.clock)

export let versionDoc = new Y.Doc();
export let doc = new Y.Doc({ gcFilter });
export let versionType = versionDoc.getArray('versions');
export const versionList = versionDoc.getArray('versionList');


/* connect to room by shared link */
export const connectToRoom = (suffix) => {

  //reset websocket and version db with suffix (tct num)
  versionWebsocketProvider = new WebsocketProvider(websocketUrl, 'tct-version-' + suffix, versionDoc, { connect: false });
  versionWebsocketProvider.connectBc();
  versionIndexeddbPersistence = new IndexeddbPersistence('tct-version-' + suffix, versionDoc);
  webrtcProvider = new WebrtcProvider('tct-website-' + suffix, doc);
  indexeddbPersistence = new IndexeddbPersistence('tct-website-' + suffix, doc);
  
  //detect active users
  awareness = webrtcProvider.awareness;
  
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
    console.log(versionWebsocketProvider.roomname);
    permanentUserData.setUserMapping(doc, doc.clientID, 'local', {});
    setLocalUserInfo();
    console.log("user info update!");
  })
}




/* manager versions */
//get existent version list
export const getVersionList = () => {
  return versionList;
}

//add new version to version db
export const addVersion = () => {
  versionList.push([{
    date: new Date().getTime(),
    drawingDocState: Y.encodeStateAsUpdate(doc),
    versionDocState : Y.encodeStateAsUpdate(versionDoc),
    clientID: versionDoc.clientID
  }]);
}

//render with specific version
export const renderVersion = (version) => {
  // console.log(version);
  // console.log(Y.encodeStateAsUpdate(doc));
  // console.log(Y.encodeStateAsUpdate(versionDoc));
  doc = new Y.Doc({ gcFilter });
  restoreVersion(version);
}

//restore existent versionDoc and drawing doc with specific version
const restoreVersion = (version) => {
  Y.applyUpdate(doc, version.drawingDocState); //drawing doc state update
  Y.applyUpdate(versionDoc, version.versionDocState) //version doc state update
  drawingContent.set(); //set new drawing doc
}

//clear all version db
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

export const permanentUserData = new LocalRemoteUserData(doc, versionDoc.getMap('users'));

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
window.versionWebsocketProvider = versionWebsocketProvider
// @ts-ignore
window.indexeddbPersistence = indexeddbPersistence
// @ts-ignore
window.prosemirrorEditorContent = prosemirrorEditorContent
