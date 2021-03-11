import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

const NEW_SELECT_EVENT = "newSelect";
const SOCKET_SERVER_URL = ":3001";

const useSocket = (roomId) => {
  const [selectedList, setSelectedList] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_SELECT_EVENT, (selectedList) => {
      const incoming = {
        ...selectedList
      };

      const exist = (arr) => {
        let bool = false;

        arr.map((elem) => {
          if (elem.body === incoming.body) {
            bool = true;
        }});

        return bool;
      }

      if (incoming.func === "P") {
        setSelectedList((selectedList) => exist(selectedList) ? [...selectedList] : [...selectedList, incoming]);
      }
      else {
        setSelectedList((selectedList) => selectedList.filter(elem => elem.body !== incoming.body));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendSelectedList = (input) => {
    socketRef.current.emit(NEW_SELECT_EVENT, {
      body: input.id,
      func: input.func,
      type: input.type
    });
  };

  return { selectedList, sendSelectedList };
};

export default useSocket;
