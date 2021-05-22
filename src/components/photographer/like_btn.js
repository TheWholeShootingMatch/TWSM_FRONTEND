import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {FaHeart} from "react-icons/fa";
import {IconContext} from "react-icons";

export function Like({id, isLogin}){

  //세션 로그인 정보로 유저의 fav에 해당 모델이 있는지 컴색해보고 렌더링
  const [check, setCheck] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/users/fav_model",
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
    .post('/api/users/fav_models_push', {id:id})
    .catch(err => { console.error(err); });
    setCheck(true);
  };

  const handleDel = () => {
    axios
    .post('/api/users/fav_models_del', {id:id})
    .catch(err => { console.error(err); });
    setCheck(false);
  };

  if(isLogin) {
    if (check) {
      return (
          <button className="like_btn check" onClick={() => handleDel()}><FaHeart className="like_icon"/><span> Like</span></button>
      )
    }
    else {
      return (
          <button className="like_btn" onClick={() => handlePush()}><FaHeart className="like_icon"/><span> Like</span></button>
      )
    }
  }
  else {
    return (
        <button className="like_btn" onClick={() => handlePush()}><Link className="like_btn" to="/login"><FaHeart className="like_icon"/><span> Like</span></Link></button>
    )
  }


}

export default Like;
