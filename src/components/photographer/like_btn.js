import React, { useState, useEffect } from "react";
import axios from "axios";

export function Like({id}){

  //세션 로그인 정보로 유저의 fav에 해당 모델이 있는지 컴색해보고 렌더링
  const [check, setCheck] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/users/fav_photographer",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id:id})
    });

    const json = await response.json();
    setCheck(json.check);
  }

  useEffect(() => {
    fetchUrl();
  }, []);

  const handlePush = () => {
    axios
    .post('/api/users/fav_photographers_push', {id:id})
    .catch(err => { console.error(err); });
    setCheck(true);
  };

  const handleDel = () => {
    axios
    .post('/api/users/fav_photographers_del', {id:id})
    .catch(err => { console.error(err); });
    setCheck(false);
  };

  if (check) {
    return <button className="like_btn" onClick={() => handleDel()}>♥</button>
  }
  else {
    return <button className="like_btn" onClick={() => handlePush()}>♡</button>
  }
}

export default Like;
