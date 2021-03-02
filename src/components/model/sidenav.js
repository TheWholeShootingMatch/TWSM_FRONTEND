import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

// import Language from "../common/language"
import {CountryOption} from "../common/country"
import Slider from '@material-ui/core/Slider';

// function Age({find,history,location}) {
//   const [value, setValue] = React.useState([10, 90]);
//
//   const handleChange = (event, newValue) => {
//     event.preventDefault();
//     setValue(newValue);
//   };
//
//   const handleChangeCommitted = (e) => {
//     e.preventDefault();
//     find.set("ageMin", value[0]);
//     find.set("ageMax", value[1]);
//     history.push(`/model/Model/0/L?${find}`);
//   };
//
//   return (
//     <>
//     <h3>Age</h3>
//     <Slider
//       value={value}
//       onChange={handleChange}
//       valueLabelDisplay="auto"
//       aria-labelledby="range-slider"
//       step={5}
//       marks
//       min={10}
//       max={90}
//       onChangeCommitted={handleChangeCommitted}
//     />
//     </>
//   )
// }

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

  return (
    <div className="side_nav">

      <select name="gender" onChange={handleChange}>
        <option value="">gender</option>
        <option value="F">female</option>
        <option value="M">male</option>
        <option value="N">not on the list</option>
      </select>

      <select name="country" onChange={handleChange}>
        <CountryOption />
      </select>

      <Height find={find} history={history} location={location}/>

    </div>
  );
}

export default SideNav;
