import React from "react";
import { useHistory, useLocation } from "react-router-dom";

function MakeOption(props) {
  return(
    <>
      <option value="">{props.name}</option>
      {props.option.map((elem, index) =>
        <option value={elem.value} key={index}>{elem.text}</option>
      )}
    </>
  );
}

// side_nav make query from parameter given by patrnts and move to that pgae
function SideNav({navContents}) {
  let history = useHistory();
  let location = useLocation();

  const handleChange = (e) => {
    const { value, name } = e.target;
    history.push(`${location.pathname}?${name}=${value}`);
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
      <select name="뭐라하지" onChange={handleChange}>
        <MakeOption name = "뭐라하지" option = {cOption} />
      </select>

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
