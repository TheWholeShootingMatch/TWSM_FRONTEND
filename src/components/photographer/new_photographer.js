import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { CountryOption } from "../common/country";
import "./new_photographer.scss";
import Header from "../common/header";

// import Language from "../common/language"

// function Country() {
//
//   //get cities from DB
//   const [citiesDB, setCitiesDB] = useState([]);
//
//   async function fetchcitiesDB() {
//     const response = await fetch("/api/photographicAreaP/fetch");
//     const json = await response.json();
//     setCitiesDB(json);
//   }
//
//   const handleClick = (input) => {
//     fetch('/api/photographicAreaP/delete/'+input, {
//       method: 'DELETE',
//       headers: {
//         accept: "application/json",
//       },
//     });
//
//     fetchcitiesDB();
//   }
//
//   //user input will go in here
//   const [country, setCountry] = useState("");
//   const [state, setState] = useState("");
//
//   //api key
//   const param = {
//     headers : {
//       accept: "application/json",
//       "X-CSCAPI-KEY": "enNoTTJWWjh5OVJIdDRDUzZkYmxiVUVtZTFkbjBhVklNODBqTTNBcg=="
//     }
//   };
//
//   // get countries from api
//   const [countries, setCountries] = useState([]);
//
//   useEffect(() => {
//     fetchcitiesDB();
//
//     axios
//     .get("https://api.countrystatecity.in/v1/countries", param)
//     .then(res => setCountries(res.data));
//   }, []);
//
//   // get states from api
//   const [states, setStates] = useState([]);
//
//   const handleCountry = (e) => {
//     e.preventDefault();
//     setCountry(e.target.value);
//     axios
//     .get(`https://api.countrystatecity.in/v1/countries/${e.target.value}/states`, param)
//     .then(res => setStates(res.data));
//     setCities([]);
//     setState("");
//   };
//
//   // get cities from api
//   const [cities, setCities] = useState([]);
//
//   const handleStates = (e) => {
//     e.preventDefault();
//     setState(e.target.value);
//     axios
//     .get(`https://api.countrystatecity.in/v1/countries/${country}/states/${e.target.value}/cities`, param)
//     .then(res => setCities(res.data));
//   };
//
//   // post to DB
//   const handleCity = (e) => {
//     e.preventDefault();
//     axios
//     .post("/api/photographicAreaP",
//       {
//         ciso : country,
//         siso : state,
//         name : e.target.value
//       }
//     )
//
//     fetchcitiesDB();
//   };
//
//   return (
//     <form>
//       {citiesDB.map((elem,index) =>
//         <button key={index} onClick={(e) => handleClick(elem.name)}>{elem.name}</button>
//       )}
//       <label htmlFor="country">country</label>
//       <select name="country" onChange={handleCountry}>
//         <option value="">select</option>
//         {countries.map((elem, index) =>
//           <option value={elem.iso2} key={index}>{elem.name}</option>
//         )}
//       </select>
//
//       <label htmlFor="state">state</label>
//       <select name="state" onChange={handleStates}>
//         <option value="">select</option>
//         {states.map((elem, index) =>
//           <option value={elem.iso2} key={index}>{elem.name}</option>
//         )}
//       </select>
//
//       <label htmlFor="city">city</label>
//       <select name="city" onChange={handleCity}>
//         <option value="">select</option>
//         {cities.map((elem, index) =>
//           <option value={elem.name} key={index}>{elem.name}</option>
//         )}
//       </select>
//     </form>
//   );
// }

function ProfileForm() {
    // for get user information
    const [photographer, setPhotographer] = useState({
        _id: "",
        Name: "",
        instagram: "",
        email: "",
        self_introduction: "",
        career: "",
        country: "",
        locations: "",
        profile_img: ""
    });

    async function fetchUrl() {
        const response = await fetch("/api/photographer/searchForUid");
        const json = await response.json();
        if (json !== null) {
            setPhotographer(json);
        }
    }

  useEffect(() => {
      fetchUrl();
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setPhotographer({
      ...photographer,
      [name]: value
    });
  };

  // for form post
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', e.target.photo.files[0]);
    formData.append('Name', e.target.Name.value);
    formData.append('instagram', e.target.instagram.value);
    formData.append('email', e.target.email.value);
    formData.append('self_introduction', e.target.self_introduction.value);
    formData.append('career', e.target.career.value);
    // formData.append('language', e.target.language.value);
    formData.append('country', e.target.country.value);
    formData.append('locations', e.target.locations.value);

    axios
    .post('/api/photographer/new', formData)
    .then((response) => { history.push(`/photographer/P_portfolio`) });
  };

  return (
    <div className="new_photographer_wrapper">
      <div className="new_photographer_header">
        <h1></h1>
        <p>
        </p>
      </div>
      <form className="photographer_form" encType='multipart/form-data' onSubmit={handleSubmit}>
        <article className="photographer_form">

          <div className="photographer_input">
            <label htmlFor="photo">Profile photo</label>
            {(photographer.profile_img !== "")?
            <img src={photographer.profile_img} alt={photographer.Name}/> : null}
            <input type="file" name="photo" accept='image/jpg, image/png, image/jpeg' />
          </div>

          <div className="photographer_input">
            <label htmlFor="Name">Name</label>
            <input type="text" value={photographer.Name} name="Name" onChange={handleChange}/>
          </div>

          <div className="photographer_input">
            <label htmlFor="instagram">instagram</label>
            <input type="text" name="instagram" value={photographer.instagram} onChange={handleChange}/>
          </div>

          <div className="photographer_input">
            <label htmlFor="email">email</label>
            <input type="text" name="email" value={photographer.email} onChange={handleChange}/>
          </div>

          <div className="photographer_input">
            <label htmlFor="self_introduction">self introduction</label>
            <input type="text" name="self_introduction" value={photographer.self_introduction} onChange={handleChange}/>
          </div>

          <div className="photographer_input">
            <label htmlFor="career">career</label>
            <input type="text" name="career" value={photographer.career} onChange={handleChange}/>
          </div>

          <div className="photographer_input">
            <label htmlFor="country">country</label>
            <select name="country" value={photographer.country} onChange={handleChange}>
              <CountryOption />
            </select>
          </div>

          <div className="photographer_input">
            <label htmlFor="locations">locations</label>
            <input type="text" name="locations" value={photographer.locations} onChange={handleChange}/>
          </div>
        </article>

        <button className="save-btn" type="submit">NEXT</button>
      </form>
    </div>
  );
}

function New_Photographer({ isLogin }) {
    return (
        <>
            <Header isLogin={isLogin} />
            <main>
                <ProfileForm />
            </main>
        </>
    );
}

export default New_Photographer;
