import { awareness, doc } from './SharedTypes';

const activeUserColor = [
  '#30bced',
  '#6eeb83',
  '#ffbc42',
  '#ecd444',
  '#ee6352',
]

export const setLocalUserInfo = () => {
    const activeUserList = getActiveUserState();
    const usedColors = activeUserList.map((user) => user.userInfo.color);
    const availableColor = activeUserColor.filter(color => !usedColors.includes(color));

    const myColor = availableColor[0];
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