import React, { useState, useEffect } from "react";
import axios from "axios";

export function Like({id}){

  //세션 로그인 정보로 유저의 fav에 해당 모델이 있는지 컴색해보고 렌더링
  const [check, setCheck] = useState([]);

  axios
  .post('/api/users/fav_model', {id:id})
  .then(res => setCheck(res.data))

  const handlePush = () => {
    axios
    .post('/api/users/fav_models_push', {id:id})
    .catch(err => { console.error(err); });
    setCheck("T");
  };

  const handleDel = () => {
    axios
    .post('/api/users/fav_models_del', {id:id})
    .catch(err => { console.error(err); });
    setCheck("F");
  };

  if (check === "T") {
    return <button className="like_btn" onClick={() => handleDel()}>♥</button>
  }
  else if (check === "F") {
    return <button className="like_btn" onClick={() => handlePush()}>♡</button>
  }
  else {
    return <button className="like_btn">♡</button>
  }
}

export default Like;
