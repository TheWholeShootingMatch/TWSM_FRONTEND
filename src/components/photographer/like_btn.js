import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function Like({id, isLogin}){

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

  if(isLogin) {
    if (check) {
      return (
        <div className="like_btn_div check">
          <button className="like_btn check" onClick={() => handleDel()}>like</button>
        </div>
      )
    }
    else {
      return (
        <div className="like_btn_div">
          <button className="like_btn" onClick={() => handlePush()}>like</button>
        </div>
      )
    }
  }
  else {
    return (
      <div className="like_btn_div">
        <Link className="like_btn" to="/login">like</Link>
      </div>
    )
  }
}

export default Like;
