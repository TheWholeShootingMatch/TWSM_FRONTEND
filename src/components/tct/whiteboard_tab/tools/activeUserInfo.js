import { awareness, doc } from './SharedTypes';

const activeUserColor = [
  '#30bced',
  '#6eeb83',
  '#ffbc42',
  '#ecd444',
  '#ee6352',
]

export const setLocalUserInfo = () => {
    const myColor = activeUserColor[Math.floor(Math.random() * activeUserColor.length)];
    awareness.setLocalStateField("userInfo", {
        name: 'login id',
        color: myColor
    })
}

export const getActiveUserState = () => {

    const userList = [];
    awareness.getStates().forEach(state => {
        if (state.userInfo) {
            userList.push(state);
        }
    })

    return userList;
}