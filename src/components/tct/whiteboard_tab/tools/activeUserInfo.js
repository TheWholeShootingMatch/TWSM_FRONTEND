import { activeUserList, doc, } from './SharedTypes';

const activeUserColor = [
  '#6eeb83',
  '#ffbc42',
  '#ecd444',
  '#ee6352',
]

export const setActiveUserInfo = (currentUsers, awareness) => {

    if (currentUsers.length === 0) {
        awareness.setLocalStateField("userInfo", {
            name: doc.clientID,
            color: '#30bced'
        })
    }
    else {
        const usedColors = [];
        currentUsers.forEach((state) => {
            usedColors.push(state.userInfo.color);
        })
        const availableColor = activeUserColor.filter(color => !usedColors.includes(color));
        awareness.setLocalStateField("userInfo", {
            name: doc.clientID,
            color: availableColor[0]
        })  
    }

    const localInfo = awareness.getLocalState();
    currentUsers.push(localInfo);
    activeUserList.set("activeUserList", currentUsers);
}

export const getActiveUserState = (awareness) => {
    const userList = [];
    awareness.getStates().forEach(state => {
        if (state.userInfo) {
            userList.push(state);
        }
    })
    return userList;
}
