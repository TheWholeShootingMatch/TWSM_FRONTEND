import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

// import Language from "../common/language"
import {CountryOption} from "../common/country"
import Slider from '@material-ui/core/Slider';

// side_nav make query and move to that pgae
function SideNav() {
  let history = useHistory();
  let location = useLocation();
  const find = new URLSearchParams(location.search);

  const handleChange = (e) => {
    e.preventDefault();
    find.set(e.target.name, e.target.value);

    history.push(`/photographer/Photographer/0/L?${find}`);
  };

  return (
    <div className="side_nav">

      <select name="country" onChange={handleChange}>
        <CountryOption />
      </select>

    </div>
  );
}

export default SideNav;
