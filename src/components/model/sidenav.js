import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

// import Language from "../common/language"
import {CountryOption} from "../common/country"
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';

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

const HeightSlider = withStyles({
  root: {
    color: "#707070",
    height: 20,
  },
  thumb: {
    height: 24,
    width: 24,
    color: "#707070",
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    color: "#FFDD00",
    height: 8,
    borderRadius: 4,
  },
  rail: {
    color: "#707070",
    height: 8,
    borderRadius: 4,
  },
})(Slider);

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
    <div className="height">
      <h3>Height</h3>
      <HeightSlider
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
    </div>
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

  return (
    <div className="side_nav">
      <div className="country">
        <h3>Country</h3>

        <select name="country" onChange={handleChange}>
          <CountryOption />
        </select>
      </div>

      <div className="gender">
        <h3>Gender</h3>
        <select name="gender" onChange={handleChange}>
          <option value="">gender</option>
          <option value="F">female</option>
          <option value="M">male</option>
          <option value="N">not on the list</option>
        </select>
      </div>

      <Height find={find} history={history} location={location}/>

    </div>
  );
}

export default SideNav;
