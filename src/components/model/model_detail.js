import React, { useState, useEffect } from "react";
import { useFetch } from "../common/useFetch"
import { useParams } from 'react-router-dom';

import Like from "./like_btn";

function Portfolio({Uid}) {
  const [portfolio, setPortfolio] = useState({
    _id: "",
    id: Uid,
    link: "",
  });

  async function fetchUrl() {
    const response = await fetch('/api/model/portfolio',
    {
      method: "POST",
      headers: {
              'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id : Uid })
    });

    const json = await response.json();
    if (json !== null) {
      setPortfolio(json);
    }
  }

  useEffect(() => {
    fetchUrl();
  }, [Uid]);

  return (portfolio.link !== "")?
  <a href={portfolio.link}>download</a>:null;
}

function Main({modelId}) {
  // get model
  const [model, setModel] = useState({
    _id : "",
    Name : "",
    Age : "",
    Gender : "",
    height : "",
    Busto : "",
    Quadril : "",
    Cintura : "",
    instagram : "",
    email : "",
    self_introduction : "",
    career : "",
    country : "",
    locations : ""
  });

  async function fetchUrl() {
    const response = await fetch('/api/model/fetch',
    {
      method: "POST",
      headers: {
              'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id : modelId })
    });

    const json = await response.json();
    setModel(json);
  }

  useEffect(() => {
    fetchUrl();
  }, []);

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
        <div className="model_loc">
          <h3>Valid Location</h3>
          <p>{model.country}</p>
          <p>{model.locations}</p>
        </div>
      </div>
      <Like id={modelId}/>
      <h3>Portfolio</h3>
      <Portfolio Uid={model.Uid}/>
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
