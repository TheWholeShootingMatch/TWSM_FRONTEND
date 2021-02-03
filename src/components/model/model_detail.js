import React, { useState } from "react";
import { useFetch } from "../common/useFetch"
import {useHistory, useParams} from 'react-router-dom';
import axios from "axios";

import Header from "../common/header";
import Like from "./like_btn";

function Main() {
  let {modelId} = useParams();
  if (typeof modelId == "undefined") {
    modelId = "6018da5ed87b76316427267d";
  }

  const param = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id : modelId })
  }
  const [model, setModel] = useFetch('/api/model/fetch',param);

  return (
    <main>
      <div className="model_info">
        <div className="model_img">
          <img src={model.profile_img} alt={model.Name}/>
        </div>
        <div className="model_detail">
          <h2>{model.Name}</h2>
          <p>Age : {model.Age}</p>
          <p>Height : {model.height}</p>
          <p>Busto : {model.Busto}</p>
          <p>Quadril : {model.Quadril}</p>
          <p>Cintura : {model.Cintura}</p>
          <p>E-mail : {model.email}</p>
          <p>Instagram : {model.instagram}</p>
        </div>
        <div className="model_imgs">
          <img src="" alt="" />
          <img src="" alt="" />
        </div>
        <div className="model_career">
          <p>career</p>
          <p>{model.career}</p>
        </div>
        <div className="model_loc">
          <p>Valid Location : </p>
        </div>
      </div>
      <button className="back_btn"></button>
      <Like />
    </main>
  );
}

function Model_Detail() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

export default Model_Detail;
