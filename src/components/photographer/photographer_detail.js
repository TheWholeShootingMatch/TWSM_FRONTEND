import React, { useState, useEffect } from "react";
import { useFetch } from "../common/useFetch"
import { useParams } from 'react-router-dom';

import Like from "./like_btn";

function Main({photographerId}) {
  // get photographer
  // const param = {
  //   method: "POST",
  //   headers: {
  //           'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ _id : photographerId })
  // }
  // const [photographer, setPhotographer] = useFetch('/api/photographer/fetch',param);

  const [photographer, setPhotographer] = useState({
    _id: "",
    Name: "",
    instagram: "",
    email: "",
    self_introduction: "",
    career: "",
    country : "",
    locations : "",
  });

  async function fetchUrl() {
    const response = await fetch('/api/photographer/fetch',
    {
      method: "POST",
      headers: {
              'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id : photographerId })
    });

    const json = await response.json();
    setPhotographer(json);
  }

  useEffect(() => {
    fetchUrl();
  }, []);

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
        <div className="photographer_loc">
          <h3>Valid Location</h3>
          <p>{photographer.country}</p>
          <p>{photographer.locations}</p>
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
