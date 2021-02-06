import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

function MakeOption(props) {
  return(
    <>
      <option value={props.name}>{props.name}</option>
      {props.option.map((elem, index) =>
        <option value={elem.value} key={index}>{elem.text}</option>
      )}
    </>
  );
}

function SideNav({navContents}) {
  let history = useHistory();
  let location = useLocation();

  const handleChange = (e) => {
    const { value, name } = e.target;
    history.push(location.pathname + "?" + name + "=" + value);
  };

  const cOption = [
    {
      value: "model",
      text: "model"
    },
    {
      value: "potographer",
      text: "potographer"
    }
  ];

  return (
    <div className="side_nav">
      <MakeOption name = "뭐라하지" option = {cOption} />

      {navContents.map(({name, option}, index) =>
        <select name={name} key={index} onChange={handleChange}>
          <MakeOption
            name = {name}
            option = {option}
          />
        </select>
      )}
    </div>
  );
}

export default SideNav;
