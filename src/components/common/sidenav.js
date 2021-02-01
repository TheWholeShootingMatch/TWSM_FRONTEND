import React, { useState } from "react";

const sample = [
  {
    name : "gender",
    option : [
      {
        value: "f",
        text: "female"
      },
      {
        value: "m",
        text: "male"
      }
    ]
  }
];

function MakeSelct(props) {
  return(
    <select name={props.name}>
      {props.option.map((elem, index) =>
        <option value={elem.value} key={index}>{elem.text}</option>
      )}
    </select>
  );
}

function SideNav() {
  return (
    <div className="side_nav">
      {sample.map(({name, option}, index) => <MakeSelct
        key={index}
        name = {name}
        option = {option}
      />)}
    </div>
  );
}

export default SideNav;
