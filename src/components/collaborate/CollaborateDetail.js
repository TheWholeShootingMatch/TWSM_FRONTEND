import React, { useEffect, useState } from "react";
import Header from "../common/header";
import { useFetch } from "../common/useFetch";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

function Model({collaborate}) {
  if(collaborate.model) {
    let { gender, age_min, age_max, height_min, height_max, weight_min, weight_max, busto_min, busto_max, quadril_min, quadril_max, cintura_min, cintura_max, ethnicity, eye_color, hair_color, model_field, model_detail } = collaborate;
    return(
      <div>
            <p>gender : {gender}</p>
            <p>age : {age_min} - {age_max}</p>
            <p>height : {height_min} - {height_max}</p>
            <p>weight : {weight_min} - {weight_max}</p>
            <p>busto : {busto_min} - {busto_max}</p>
            <p>quadril : {quadril_min} - {quadril_max}</p>
            <p>cintura : {cintura_min} - {cintura_max}</p>
            <p>ethnicity : {ethnicity}</p>
            <p>eye color : {eye_color}</p>
            <p>field : {model_field}</p>
            <p>more : {model_detail}</p>
      </div>
    )
  }
  else {
    return(
      <></>
    )
  }
}

function Photographer({collaborate}) {
  if(collaborate.photographer) {
    let { photographer_field, retouch, photographer_detail } = collaborate;
    return(
      <div>
            <p>field : {photographer_field}</p>
            <p>retouch : {retouch}</p>
            <p>more : {photographer_detail}</p>
      </div>
    )
  }
  else {
    return(
      <></>
    )
  }
}

function Main({projectId}) {
  const [collaborate, setCollaborate] = useState(
    {
      id:"",
      Model : false,
      Photographer : false,
      title : "",
      corporation_name : "",
      about_project : "",
      location : "",
      date : "",
      model : "",
      photographer : "",
      gender: "",
      age_min: "",
      age_max: "",
      height_min: "",
      height_max: "",
      weight_min: "",
      weight_max: "",
      busto_min: "",
      busto_max: "",
      quadril_min: "",
      quadril_max: "",
      cintura_min: "",
      cintura_max: "",
      ethnicity: "",
      eye_color: "",
      hair_color: "",
      model_field: "",
      model_detail: "",
      photographer_field: "",
      retouch: "",
      photographer_detail: ""
    }
  )
  let history = useHistory();

  async function fetchUrl() {
    await axios.post('/api/collaboration/fetch', {_id:projectId})
    .then((res) => {
      setCollaborate(res.data);
    })
  }

  useEffect(() => {
    fetchUrl();
  }, []);

  const deleteProject = (e) => {
    // e.preventDefault();
    axios.post("/api/collaboration/delete", {_id: projectId})
    .then((res) => {history.push('/collaboration/project')})
  }

  let { id, title, corporation_name, about_project, location, Pdate } = collaborate;

  return (
    <>
      <h1>{title}</h1>
      <div>
            <p>corporation name : {corporation_name}</p>
            <p>about project : {about_project}</p>
            <p>location : {location}</p>
            <p>due date : {Pdate}</p>
      </div>
      <Model collaborate={collaborate}/>
      <Photographer collaborate={collaborate}/>
      <button type="button" onClick={() => deleteProject()}>Delete</button>
    </>
  )
}

function CollaborateDetail({isLogin}) {
  let {projectId} = useParams();

  if (typeof projectId == "undefined") {
    return <p> Warning : incorrect path </p>
  }

  return (
    <>
      <Header isLogin={isLogin}/>
      <Main projectId={projectId}/>
    </>
  )
}

export default CollaborateDetail;
