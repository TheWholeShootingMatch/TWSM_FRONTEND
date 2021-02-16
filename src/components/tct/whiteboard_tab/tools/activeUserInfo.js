import { awareness, doc } from './SharedTypes';

const activeUserColor = [
  '#30bced',
  '#6eeb83',
  '#ffbc42',
  '#ecd444',
  '#ee6352',
]

export const getNumberOfActiveUsers = () => {
    const numberOfUsers = Array.from(awareness.getStates().values()).length;
    console.log(awareness.getStates());
    console.log(numberOfUsers);
    return numberOfUsers;
}

export const setLocalUserInfo = () => {
   
    const numberOfUsers = getNumberOfActiveUsers();
    const myColor = activeUserColor[numberOfUsers-1];
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