import React, { useState, useEffect } from "react";
import { useFetch } from "../common/useFetch"
import { useParams } from 'react-router-dom';

import Like from "./like_btn";

function Main({photographerId}) {
  // get photographer
  const param = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id : photographerId })
  }
  const [photographer, setPhotographer] = useFetch('/api/photographer/fetch',param);

  //get cities
  const cityparam = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Uid : photographer.Uid })
  }

  const [citiesDB, setCitiesDB] = useState([]);

  async function fetchcitiesDB() {
    const response = await fetch('/api/photographicAreaP/searchPid',cityparam);
    const json = await response.json();
    setCitiesDB(json);
  }

  useEffect(() => {
    fetchcitiesDB();
  }, [photographer]);

  return (
    <main>
      <div className="photographer_info">
        <div className="photographer_img">
          <img src={photographer.profile_img} alt={photographer.Name}/>
        </div>
        <h2>{photographer.Name}</h2>
        <p>E-mail : {photographer.email}</p>
        <p>Instagram : {photographer.instagram}</p>
        <h3>self introduction</h3>
        <p>{photographer.self_introduction}</p>
        <h3>career</h3>
        <p>{photographer.career}</p>
        <h3>language</h3>
        <p>{photographer.language}</p>
        <div className="photographer_loc">
          <h3>Valid Location</h3>
          {citiesDB.map((elem,index) =>
            <p key={index}>{elem.name}</p>
          )}
        </div>
      </div>
      <Like />
    </main>
  );
}

function Photographer_Detail(props) {
  // get photographer id in query
  let {photographerId} = useParams();
  if (typeof photographerId == "undefined") {
    return <p> Warning : incorrect path </p>
  }

  return (
    <>
      {props.children}
      <Main photographerId = {photographerId}/>
    </>
  );
}

export default Photographer_Detail;
