import React, { useState, useEffect } from "react";
import { useFetch } from "../common/useFetch"
import { useParams } from 'react-router-dom';

import Like from "./like_btn";

function Main({modelId}) {
  // get model
  const param = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id : modelId })
  }
  const [model, setModel] = useFetch('/api/model/fetch',param);

  //get cities
  const cityparam = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Uid : model.Uid })
  }

  const [citiesDB, setCitiesDB] = useState([]);

  async function fetchcitiesDB() {
    const response = await fetch('/api/photographicAreaM/searchMid',cityparam);
    const json = await response.json();
    setCitiesDB(json);
  }

  useEffect(() => {
    fetchcitiesDB();
  }, [model]);

  return (
    <main>
      <div className="model_info">
        <div className="model_img">
          <img src={model.profile_img} alt={model.Name}/>
        </div>
        <h2>{model.Name}</h2>
        <p>Age : {model.Age}</p>
        <p>Height : {model.height}</p>
        <p>Busto : {model.Busto}</p>
        <p>Quadril : {model.Quadril}</p>
        <p>Cintura : {model.Cintura}</p>
        <p>E-mail : {model.email}</p>
        <p>Instagram : {model.instagram}</p>
        <h3>self introduction</h3>
        <p>{model.self_introduction}</p>
        <h3>career</h3>
        <p>{model.career}</p>
        <h3>language</h3>
        <p>{model.language}</p>
        <div className="model_loc">
          <h3>Valid Location</h3>
          {citiesDB.map((elem,index) =>
            <p>{elem.name}</p>
          )}
        </div>
      </div>
      <Like />
    </main>
  );
}

function Model_Detail(props) {
  // get model id in query
  let {modelId} = useParams();
  if (typeof modelId == "undefined") {
    return <p> Warning : incorrect path </p>
  }

  return (
    <>
      {props.children}
      <Main modelId = {modelId}/>
    </>
  );
}

export default Model_Detail;
