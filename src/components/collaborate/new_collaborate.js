import React, { useState } from "react";
import axios from "axios";

function CollaborateForm() {



  return (
    <form onSubmit={handleSubmit}>
      <div className="overview">
        <div className="title_area">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" onChange={handleCollaborate}/>
        </div>
        <div className="corporation_name_area">
          <label htmlFor="corporation_name">Corporation name</label>
          <input type="text" name="corporation_name" onChange={handleCollaborate}/>
        </div>
        <div className="about_project_area">
          <label htmlFor="corporation_name"></label>
          <input type="text" name="about_project" onChange={handleCollaborate}/>
        </div>
        <div className="shooting_location_area">  //수정필요
          <label htmlFor="shooting_location">Shooting Location</label>
          <input type="text" name="shooting_location" onChange={handleCollaborate}/>
        </div>
        <div className="language_area">
          <label htmlFor="language"></label>
          <input type="text" name="language" onChange={handleCollaborate}/>
        </div>
        <div className="shooting_date_area">
          <label htmlFor="shooting_date"></label>
          <input type="date" name="shootingdate" onChange={handleCollaborate}/>
        </div>
      </div>

      <div className="model">
        <div className="model_title">
          <button onClick={() => onClickModel()}>Model</button>
        </div>
        <div className={isModel ? "model_area active" : "model_area"}>
          <div className="gender_area">
            <label htmlFor="gender">Gender</label>
            <radio name="gender" value="A" onChange={handleModel}/>All
            <radio name="gender" value="M" onChange={handleModel}/>Male
            <radio name="gender" value="F" onChange={handleModel}/>Female
          </div>
          <div className="model_age_area">
            <label >Age</label>
            <input type="number" name="age_min" min="0" onChange={handleModel}/> - <input type="number" name="age_max" min={model.age_min} onChange={handleModel}/>years
          </div>
          <div className="model_height_area">
            <label >Height</label>
            <input type="number" name="height_min" min="0" onChange={handleModel}/> - <input type="number" name="height_max" min={model.height_min} onChange={handleModel}/>cm
          </div>
          <div className="model_weight_area">
            <label >Weight</label>
            <input type="number" name="weight_min" min="0" onChange={handleModel}/> - <input type="number" name="weight_max" min={model.weight_min} onChange={handleModel}/>kg
          </div>
          <div className="model_top_size_area">
            <label >Top size</label>
            <input type="number" name="top_size_min" min="0" onChange={handleModel}/> - <input type="number" name="top_size_max" min={model.top_size_min} onChange={handleModel}/>
          </div>
          <div className="model_height_area">
            <label >Buttom size</label>
            <input type="number" name="bottom_size_min" min="0" onChange={handleModel}/> - <input type="number" name="bottom_size_max" min={model.bottom_size_min} onChange={handleModel}/>
          </div>
          <div className="model_height_area">
            <label >Shoe size</label>
            <input type="number" name="model_height" min="0" onChange={handleModel}/> - <input type="number" name="shoe_size_max" min={model.shoe_size_min} onChange={handleModel}/>mm
          </div>
          <div className="ethnicity_area">
            <label htmlFor="ethnicity">Ethnicity</label>
            <checkbox name="ethnicity" value="All" onChange={handleModel}/>All
            <checkbox name="ethnicity" value="American" onChange={handleModel}/>American
            <checkbox name="ethnicity" value="European" onChange={handleModel}/>European
            <checkbox name="ethnicity" value="Asian" onChange={handleModel}/>Asian
            <checkbox name="ethnicity" value="African" onChange={handleModel}/>African
            <checkbox name="ethnicity" value="Others" onChange={handleModel}/>Others
          </div>
          <div className="eye_color_area">
            <label htmlFor="eye_color">Eye Color</label>
            <checkbox name="eye_color" value="All" onChange={handleModel}/>All
            <checkbox name="eye_color" value="Black" onChange={handleModel}/>Black
            <checkbox name="eye_color" value="Blue" onChange={handleModel}/>Blue
            <checkbox name="eye_color" value="Brown" onChange={handleModel}/>Brown
            <checkbox name="eye_color" value="Green" onChange={handleModel}/>Green
            <checkbox name="eye_color" value="Others" onChange={handleModel}/>Others
          </div>
          <div className="hair_color_area">
            <label htmlFor="hair_color">Hair Color</label>
            <checkbox name="hair_color" value="All" onChange={handleModel}/>All
            <checkbox name="hair_color" value="Black" onChange={handleModel}/>Black
            <checkbox name="hair_color" value="Blonde" onChange={handleModel}/>Blonde
            <checkbox name="hair_color" value="Brown" onChange={handleModel}/>Brown
            <checkbox name="hair_color" value="Grey" onChange={handleModel}/>Grey
            <checkbox name="hair_color" value="Others" onChange={handleModel}/>Others
          </div>
          <div className="field_area">
            <label htmlFor="field">Field</label>
            <checkbox name="field" value="Fashion" onChange={handleModel}/>Fashion
            <checkbox name="field" value="Hair/Makeup" onChange={handleModel}/>Hair/Mackup
            <checkbox name="field" value="Shoe" onChange={handleModel}/>Shoe
            <checkbox name="field" value="Sport" onChange={handleModel}/>Sport
            <checkbox name="field" value="Runway" onChange={handleModel}/>Runway
            <checkbox name="field" value="Others" onChange={handleModel}/>Others
          </div>
          <div classNmae="model_detail">
            <input type="text" name="detail" onChange={handleModel}/>
          </div>
        </div>

        <div className={isPhotographer ? "photographer_area active" : "photographer_area"}>
          <div className="field_area">
            <label htmlFor="field">Field</label>
            <checkbox name="field" value="Fashion" onChange={handlePhotographer}/>Fashion
            <checkbox name="field" value="Hair/Makeup" onChange={handlePhotographer}/>Hair/Mackup
            <checkbox name="field" value="Shoe" onChange={handlePhotographer}/>Shoe
            <checkbox name="field" value="Sport" onChange={handlePhotographer}/>Sport
            <checkbox name="field" value="Object" onChange={handlePhotographer}/>Object
            <checkbox name="field" value="Others" onChange={handlePhotographer}/>Others
          </div>
          <div className="retouch">
            <lable htmlFor="retouch">Retouch</lable>
            <radio name="retouch" value="Y" onChange={handlePhotographer}/>Yes
            <radio name="retouch" value="N" onChange={handlePhotographer}/>No
          </div>
          <div classNmae="photographer_detail">
            <input type="text" name="detail" onChange={handlePhotographer}/>
          </div>
        </div>

      <button type="submit">save</button>
    </form>
  );
}

export default New_Collaborate;
