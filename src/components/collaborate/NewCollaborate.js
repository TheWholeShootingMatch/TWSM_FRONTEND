import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Header from "../common/header";
import "./NewCollaboration.scss";

function CollaborationForm() {

  const [isModel, setModel] = useState(false);
  const [isPhotographer, setPhotographer] = useState(false);

  const onClickArea = (type) => {
    if (type === "model") {
      setModel(!isModel);
      console.log("model button", isModel);
      if(isModel) {

      }
    }
    else if(type==="photographer"){
      setPhotographer(!isPhotographer);
      console.log("photographer button", isPhotographer)
    }

  }

  const [collaborate, setCollaborate] = useState({
    Model : false,
    Photographer : false,
    title : "",
    corporation_name : "",
    about_project : "",
    location : "",
    date : "",
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
  });

  let history = useHistory();

  useEffect(() => {
    setCollaborate({
      ...collaborate,
      Model: isModel
    })
  }, [isModel])

  useEffect(() => {
    setCollaborate({
      ...collaborate,
      Photographer: isPhotographer
    })
  }, [isPhotographer])

  const handleChange = (e) => {
    const {value, name}  = e.target;
    setCollaborate({
      ...collaborate,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(collaborate)
    axios.post("/api/collaboration/new", collaborate)
    .then((res) => {history.push('/collaboration/project/1/L')});
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="overview">
        <div className="title_area">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" onChange={handleChange}/>
        </div>
        <div className="corporation_name_area">
          <label htmlFor="corporation_name">Corporation name</label>
          <input type="text" name="corporation_name" onChange={handleChange}/>
        </div>
        <div className="about_project_area">
          <label htmlFor="about_project"></label>
          <input type="text" name="about_project" onChange={handleChange}/>
        </div>
        <div className="location_area">
          <label htmlFor="location">Shooting Location</label>
          <input type="text" name="location" onChange={handleChange}/>
        </div>
        <div className="date_area">
          <label htmlFor="date"></label>
          <input type="date" name="date" onChange={handleChange}/>
        </div>
      </div>

      <div className="model">
        <div className="model_button">
          <button type="button" onClick={()=>onClickArea('model')}>Model</button>
        </div>
        <div className={isModel ? "model_form active" : "model_form"}>
          <div className="gender_area">
            <label htmlFor="gender">Gender</label>
            <input type="radio" name="gender" value="A" onChange={handleChange}/>All
            <input type="radio" name="gender" value="M" onChange={handleChange}/>Male
            <input type="radio" name="gender" value="F" onChange={handleChange}/>Female
          </div>
          <div className="model_age_area">
            <label htmlFor='age'>Age</label>
            <input type="number" name="age_min" min="0" onChange={handleChange}/> - <input type="number" name="age_max"  onChange={handleChange}/>years
          </div>
          <div className="model_height_area">
            <label htmlFor="height">Height</label>
            <input type="number" name="height_min" min="0" onChange={handleChange}/> - <input type="number" name="height_max" onChange={handleChange}/>cm
          </div>
          <div className="model_weight_area">
            <label htmlFor='weight'>Weight</label>
            <input type="number" name="weight_min" min="0" onChange={handleChange}/> - <input type="number" name="weight_max" onChange={handleChange}/>kg
          </div>
          <div className="model_busto_area">
            <label htmlFor='busto'>Busto</label>
            <input type="number" name="busto_min" min="0" onChange={handleChange}/> - <input type="number" name="busto_max" onChange={handleChange}/>
          </div>
          <div className="model_quadril_area">
            <label htmlFor='quadril'>Quadril</label>
            <input type="number" name="quadril_min" min="0" onChange={handleChange}/> - <input type="number" name="quadril_max" onChange={handleChange}/>
          </div>
          <div className="model_cintura_area">
            <label htmlFor='cintura'>Cintura</label>
            <input type="number" name="cintura_min" min="0" onChange={handleChange}/> - <input type="number" name="cintura_max" onChange={handleChange}/>
          </div>
          <div className="ethnicity_area">
            <label htmlFor='ethnicity'>Ethnicity</label>
            <input type="checkbox" name="ethnicity" value="All" onChange={handleChange}/>All
            <input type="checkbox" name="ethnicity" value="American" onChange={handleChange}/>American
            <input type="checkbox" name="ethnicity" value="European" onChange={handleChange}/>European
            <input type="checkbox" name="ethnicity" value="Asian" onChange={handleChange}/>Asian
            <input type="checkbox" name="ethnicity" value="African" onChange={handleChange}/>African
            <input type="checkbox" name="ethnicity" value="Others" onChange={handleChange}/>Others
          </div>
          <div className="eye_color_area">
            <label htmlFor='eye_color'>Eye Color</label>
            <input type="checkbox" name="eye_color" value="All" onChange={handleChange}/>All
            <input type="checkbox" name="eye_color" value="Black" onChange={handleChange}/>Black
            <input type="checkbox" name="eye_color" value="Blue" onChange={handleChange}/>Blue
            <input type="checkbox" name="eye_color" value="Brown" onChange={handleChange}/>Brown
            <input type="checkbox" name="eye_color" value="Green" onChange={handleChange}/>Green
            <input type="checkbox" name="eye_color" value="Others" onChange={handleChange}/>Others
          </div>
          <div className="hair_color_area">
            <label htmlFor='hair_color'>Hair Color</label>
            <input type="checkbox" name="hair_color" value="All" onChange={handleChange}/>All
            <input type="checkbox" name="hair_color" value="Black" onChange={handleChange}/>Black
            <input type="checkbox" name="hair_color" value="Blonde" onChange={handleChange}/>Blonde
            <input type="checkbox" name="hair_color" value="Brown" onChange={handleChange}/>Brown
            <input type="checkbox" name="hair_color" value="Grey" onChange={handleChange}/>Grey
            <input type="checkbox" name="hair_color" value="Others" onChange={handleChange}/>Others
          </div>
          <div className="model_field_area">
            <label htmlFor='model_field'>Field</label>
            <input type="checkbox" name="model_field" value="Fashion" onChange={handleChange}/>Fashion
            <input type="checkbox" name="model_field" value="Hair/Makeup" onChange={handleChange}/>Hair/Mackup
            <input type="checkbox" name="model_field" value="Shoe" onChange={handleChange}/>Shoe
            <input type="checkbox" name="model_field" value="Sport" onChange={handleChange}/>Sport
            <input type="checkbox" name="model_field" value="Runway" onChange={handleChange}/>Runway
            <input type="checkbox" name="model_field" value="Others" onChange={handleChange}/>Others
          </div>
          <div className="model_detail">
            <input type="text" name="model_detail" onChange={handleChange}/>
          </div>
        </div>
      </div>

      <div className="photographer">
        <div className="photographer_button">
          <button type="button" onClick={()=>onClickArea('photographer')}>photographer</button>
        </div>
        <div className={isPhotographer ? "photographer_form active" : "photographer_form"}>
          <div className="field_area">
            <label htmlFor="photographer_field">Field</label>
            <input type="checkbox" name="photographer_field" value="Fashion" onChange={handleChange}/>Fashion
            <input type="checkbox" name="photographer_field" value="Hair/Makeup" onChange={handleChange}/>Hair/Mackup
            <input type="checkbox" name="photographer_field" value="Shoe" onChange={handleChange}/>Shoe
            <input type="checkbox" name="photographer_field" value="Sport" onChange={handleChange}/>Sport
            <input type="checkbox" name="photographer_field" value="Object" onChange={handleChange}/>Object
            <input type="checkbox" name="photographer_field" value="Others" onChange={handleChange}/>Others
          </div>
          <div className="retouch">
            <label htmlFor="retouch">Retouch</label>
            <input type="radio" name="retouch" value="Y" onChange={handleChange}/>Yes
            <input type="radio" name="retouch" value="N" onChange={handleChange}/>No
          </div>
          <div className="photographer_detail">
            <input type="text" name="photographer_detail" onChange={handleChange}/>
          </div>
        </div>
      </div>

      <button type="submit">save</button>
    </form>
  )
}

function NewCollaborate(props) {

  return (
    <>
      <CollaborationForm/>
    </>
  )
}

export default NewCollaborate;
