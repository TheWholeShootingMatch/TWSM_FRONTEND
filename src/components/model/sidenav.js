import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

import Language from "../common/language"
import Slider from '@material-ui/core/Slider';

function Age({find,history,location}) {
  const [value, setValue] = React.useState([10, 90]);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleChangeCommitted = (e) => {
    e.preventDefault();
    find.set("ageMin", value[0]);
    find.set("ageMax", value[1]);
    history.push(`/model/Model/0/L?${find}`);
  };

  return (
    <>
    <h3>Age</h3>
    <Slider
      value={value}
      onChange={handleChange}
      valueLabelDisplay="auto"
      aria-labelledby="range-slider"
      step={5}
      marks
      min={10}
      max={90}
      onChangeCommitted={handleChangeCommitted}
    />
    </>
  )
}

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
    history.push(`/model/Model/0/L?${find}`);
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
  const find = new URLSearchParams(location.search);

  const handleChange = (e) => {
    e.preventDefault();
    find.set(e.target.name, e.target.value);

    history.push(`/model/Model/0/L?${find}`);
  };

  // when it changed to photographer it will move to photographer page
  const handleCategory = (e) => {
    e.preventDefault();
    history.push(`${location.pathname}`);
  }

  //user input will go in here
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  //api key
  const param = {
    headers : {
      accept: "application/json",
      "X-CSCAPI-KEY": "enNoTTJWWjh5OVJIdDRDUzZkYmxiVUVtZTFkbjBhVklNODBqTTNBcg=="
    }
  };

  // get countries from api
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
    .get("https://api.countrystatecity.in/v1/countries", param)
    .then(res => setCountries(res.data));
  }, []);

  // get states from api
  const [states, setStates] = useState([]);

  const handleCountry = (e) => {
    e.preventDefault();
    setCountry(e.target.value);
    axios
    .get(`https://api.countrystatecity.in/v1/countries/${e.target.value}/states`, param)
    .then(res => setStates(res.data));
    setCities([]);
    setState("");
  };

  // get cities from api
  const [cities, setCities] = useState([]);

  const handleStates = (e) => {
    e.preventDefault();
    setState(e.target.value);
    axios
    .get(`https://api.countrystatecity.in/v1/countries/${country}/states/${e.target.value}/cities`, param)
    .then(res => setCities(res.data));
  };

  return (
    <div className="side_nav">
      <select name="category" onChange={handleCategory}>
        <option value="">Model</option>
        <option value="photographer">photographer</option>
      </select>

      <select name="gender" onChange={handleChange}>
        <option value="">gender</option>
        <option value="F">female</option>
        <option value="M">male</option>
        <option value="N">not on the list</option>
      </select>

      <Height find={find} history={history} location={location}/>
      <Age find={find} history={history} location={location}/>

      <select name="language" onChange={handleChange}>
        <option value="">language</option>
        <Language />
      </select>

      <select name="country" onChange={handleCountry}>
        <option value="">country</option>
        {countries.map((elem, index) =>
          <option value={elem.iso2} key={index}>{elem.name}</option>
        )}
      </select>

      <select name="state" onChange={handleStates}>
        <option value="">state</option>
        {states.map((elem, index) =>
          <option value={elem.iso2} key={index}>{elem.name}</option>
        )}
      </select>

      <select name="city" onChange={handleChange}>
        <option value="">city</option>
        {cities.map((elem, index) =>
          <option value={elem.name} key={index}>{elem.name}</option>
        )}
      </select>

    </div>
  );
}

export default SideNav;
