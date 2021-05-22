import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { CountryOption } from "../common/country";
import Header from "../common/header";

import "./new_model.scss";

// import Language from "../common/language"

// function Country({citiesArr, setCitiesArr}) {
//
//   const handleClick = (input) => {
//     setCitiesArr((citiesArr) => citiesArr.filter(elem => elem != input));
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
//   const exist = (arr,input) => {
//     let bool = false;
//
//     arr.map((elem) => {
//       if (elem === input) {
//         bool = true;
//     }});
//
//     return bool;
//   }
//
//   // push to citiesArr
//   const handleCity = (e) => {
//     e.preventDefault();
//     exist(citiesArr)
//     setCitiesArr((citiesArr) =>
//       exist(citiesArr, e.target.value) ?
//       [...citiesArr] :
//       [...citiesArr, e.target.value]
//     )
//   };
//
//   return (
//     <>
//       {citiesArr.map((elem,index) =>
//         <button key={index} onClick={(e) => handleClick(elem)}>{elem}</button>
//       )}
//
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
//     </>
//   );
// }

function ProfileForm() {
    // for get user information
    const [model, setModel] = useState({
        _id: "",
        Name: "",
        Age: "",
        Gender: "",
        height: "",
        Busto: "",
        Quadril: "",
        Cintura: "",
        instagram: "",
        email: "",
        self_introduction: "",
        career: "",
        language: "",
        country: "",
        locations: "",
        profile_img: ""
    });

    async function fetchUrl() {
        const response = await fetch("/api/model/searchForUid");
        const json = await response.json();
        if (json != null) {
            setModel(json);
        }
    }

    useEffect(() => {
        fetchUrl();
    }, []);

    const handleChange = e => {
        const { value, name } = e.target;
        setModel({
            ...model,
            [name]: value
        });
    };

    // for form post
    let history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", e.target.photo.files[0]);
        formData.append("Name", e.target.Name.value);
        formData.append("Age", e.target.Age.value);
        formData.append("Gender", e.target.Gender.value);
        formData.append("height", e.target.height.value);
        formData.append("Busto", e.target.Busto.value);
        formData.append("Quadril", e.target.Quadril.value);
        formData.append("Cintura", e.target.Cintura.value);
        formData.append("instagram", e.target.instagram.value);
        formData.append("email", e.target.email.value);
        formData.append("self_introduction", e.target.self_introduction.value);
        formData.append("career", e.target.career.value);
        // formData.append('language', e.target.language.value);
        formData.append("country", e.target.country.value);
        formData.append("locations", e.target.locations.value);

        // formData.append('photographicArea', citiesArr);
    }

  return (
      <div className="new_model_wrapper">
        <div className="new_model_header">
          <h1></h1>
          <p>
          </p>
        </div>
        <form className="new_model_form" encType='multipart/form-data' onSubmit={handleSubmit}>
          <article className="model_form">
            <div className="model_input">
              <label htmlFor="photo">Profile photo</label>
              {(model.profile_img !== "")?
              <img src={model.profile_img} alt={model.Name}/> : null}
              <input type="file" name="photo" accept='image/jpg, image/png, image/jpeg' />
            </div>

            <div className="model_input">
              <label htmlFor="Name">Name</label>
              <input type="text" value={model.Name} name="Name" onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="Age">Age</label>
              <input type="text" name="Age" value={model.Age} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="Gender">Gender</label>
              <select name="Gender" value={model.Gender} onChange={handleChange}>
                <option value="select">select</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="N">Not on the list</option>
              </select>
            </div>

            <div className="model_input">
              <label htmlFor="height">height</label>
              <input type="text" name="height" value={model.height} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="Busto">Busto</label>
              <input type="text" name="Busto" value={model.Busto} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="Quadril">Quadril</label>
              <input type="text" name="Quadril" value={model.Quadril} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="Cintura">Cintura</label>
              <input type="text" name="Cintura" value={model.Cintura} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="instagram">instagram</label>
              <input type="text" name="instagram" value={model.instagram} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="email">email</label>
              <input type="text" name="email" value={model.email} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="self_introduction">self introduction</label>
              <input type="text" name="self_introduction" value={model.self_introduction} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="career">career</label>
              <input type="text" name="career" value={model.career} onChange={handleChange}/>
            </div>

            <div className="model_input">
              <label htmlFor="country">country</label>
              <select name="country" value={model.country} onChange={handleChange}>
                <CountryOption />
              </select>
            </div>

            <div className="model_input">
              <label htmlFor="locations">locations</label>
              <input type="text" name="locations" value={model.locations} onChange={handleChange}/>
            </div>
          </article>

          <input type="submit" value="NEXT" className="save_btn"/>
        </form>
      </div>
  );
}

function New_Model({ isLogin }) {
    return (
        <>
            <Header isLogin={isLogin} />
            <main>
                <ProfileForm />
            </main>
        </>
    );
}

export default New_Model;
