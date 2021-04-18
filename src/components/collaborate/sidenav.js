import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import {CountryOption} from "../common/country"
import Slider from '@material-ui/core/Slider';
import './Collaboration.scss';

function Height({find,history,location}) {
  const [value, setValue] = React.useState([140, 190]);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleChangeCommitted = (e) => {
    e.preventDefault();
    find.set("heightMin", value[0]);
    find.set("heightMax", value[1]);
    history.push(`/collaboration/project/1/L?${find}`);
  };

  return (
    <>
    <h3>height</h3>
    <Slider
      value={value}
      onChange={handleChange}
      valueLabelDisplay="auto"
      aria-labelledby="range-slider"
      step={5}
      marks
      min={140}
      max={190}
      onChangeCommitted={handleChangeCommitted}
    />
    </>
  )
}

// side_nav make query and move to that pgae
function SideNav() {
  let history = useHistory();
  let location = useLocation();
  const [model, setModel] = useState(false);
  const [photographer, setPhotographer] = useState(false);
  const find = new URLSearchParams(location.search);

  const filterSelection = (type) => {  //select category
    if(type === "M") {
      find.set("category", "M")
      setModel(true);
      setPhotographer(false);
    }
    else if(type === "P") {
      find.set("category", "P")
      setModel(false);
      setPhotographer(true);
    }
    else {
      find.set("category", "")
      setModel(false);
      setPhotographer(false);
    }
    history.push(`/collaboration/project/1/L?${find}`);
  }

  const handleChange = (e) => {
    e.preventDefault();
    find.set(e.target.name, e.target.value);

    history.push(`/collaboration/project/1/L?${find}`);
  };

  return (
    <div className="side_nav">
      <div className="category">
        <button className="btn active" onClick={()=>filterSelection("A")}> All </button>
        <button className="btn" onClick={()=>filterSelection("M")}> Model </button>
        <button className="btn" onClick={()=>filterSelection("P")}> Photographer </button>
      </div>

      <select name="country" onChange={handleChange}>
        <CountryOption />
      </select>

      <div className={model ? "model_filter active" : "model_filter"}>
        <select name="gender" onChange={handleChange}>
          <option value="">gender</option>
          <option value="F">female</option>
          <option value="M">male</option>
          <option value="N">not on the list</option>
        </select>

        <Height find={find} history={history} location={location}/>
      </div>

      <div className={photographer ? "photographer_filter active" : "photographer_filter"}>
      </div>
    </div>
  );
}

export default SideNav;
