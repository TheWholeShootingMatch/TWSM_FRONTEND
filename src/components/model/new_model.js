import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Language from "../common/language"

function Country() {

  //get cities from DB
  const [citiesDB, setCitiesDB] = useState([]);

  async function fetchcitiesDB() {
    const response = await fetch("/api/photographicAreaM/fetch");
    const json = await response.json();
    setCitiesDB(json);
  }

  const handleClick = (input) => {
    fetch('/api/photographicAreaM/delete/'+input, {
      method: 'DELETE',
      headers: {
        accept: "application/json",
      },
    });

    fetchcitiesDB();
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
    fetchcitiesDB();

    axios
    .get("https://api.countrystatecity.in/v1/countries", param)
    .then(res => setCountries(res.data));
  }, []);

  // get states from api
  const [states, setStates] = useState([]);

  const handleCountry = (e) => {
    e.preventDefault();
    setCountry(e.target.value);
    axios
    .get(`https://api.countrystatecity.in/v1/countries/${e.target.value}/states`, param)
    .then(res => setStates(res.data));
    setCities([]);
    setState("");
  };

  // get cities from api
  const [cities, setCities] = useState([]);

  const handleStates = (e) => {
    e.preventDefault();
    setState(e.target.value);
    axios
    .get(`https://api.countrystatecity.in/v1/countries/${country}/states/${e.target.value}/cities`, param)
    .then(res => setCities(res.data));
  };

  // post to DB
  const handleCity = (e) => {
    e.preventDefault();
    axios
    .post("/api/photographicAreaM",
      {
        ciso : country,
        siso : state,
        name : e.target.value
      }
    )
    .then(res => console.log(res));

    fetchcitiesDB();
  };

  return (
    <>
      {citiesDB.map((elem,index) =>
        <button key={index} onClick={(e) => handleClick(elem.name)}>{elem.name}</button>
      )}
      <label htmlFor="country">country</label>
      <select name="country" onChange={handleCountry}>
        <option value="">select</option>
        {countries.map((elem, index) =>
          <option value={elem.iso2} key={index}>{elem.name}</option>
        )}
      </select>

      <label htmlFor="state">state</label>
      <select name="state" onChange={handleStates}>
        <option value="">select</option>
        {states.map((elem, index) =>
          <option value={elem.iso2} key={index}>{elem.name}</option>
        )}
      </select>

      <label htmlFor="city">city</label>
      <select name="city" onChange={handleCity}>
        <option value="">select</option>
        {cities.map((elem, index) =>
          <option value={elem.name} key={index}>{elem.name}</option>
        )}
      </select>
    </>
  );
}

function ProfileForm() {
  // for get user information
  const [model, setModel] = useState({
    _id : "",
    Name : "",
    Age : "",
    Gender : "",
    height : "",
    Busto : "",
    Quadril : "",
    Cintura : "",
    instagram : "",
    email : "",
    self_introduction : "",
    career : "",
    language : ""
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

  const handleChange = (e) => {
    const { value, name } = e.target;
    setModel({
      ...model,
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
    formData.append('Age', e.target.Age.value);
    formData.append('Gender', e.target.Gender.value);
    formData.append('height', e.target.height.value);
    formData.append('Busto', e.target.Busto.value);
    formData.append('Quadril', e.target.Quadril.value);
    formData.append('Cintura', e.target.Cintura.value);
    formData.append('instagram', e.target.instagram.value);
    formData.append('email', e.target.email.value);
    formData.append('self_introduction', e.target.self_introduction.value);
    formData.append('career', e.target.career.value);
    formData.append('language', e.target.language.value);

    axios
    .post('/api/model/new', formData)
    .then((response) => { history.push(`/model/Model/0`) });
  };

  return (
    <form className="model_form" encType='multipart/form-data' onSubmit={handleSubmit}>
      <div className="form_top">

        <div className="left" id="photo_area">
          <label htmlFor="photo">Profile photo</label>
          <input type="file" name="photo" accept='image/jpg, image/png, image/jpeg' />
        </div>

        <div className="right" id="basic_info">
          <label htmlFor="Name">Name</label>
          <input type="text" value={model.Name} name="Name" onChange={handleChange}/>

          <label htmlFor="Age">Age</label>
          <input type="text" name="Age" value={model.Age} onChange={handleChange}/>

          <label htmlFor="Gender">Gender</label>
          <select name="Gender" value={model.Gender} onChange={handleChange}>
            <option value="">select</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="N">Not on the list</option>
          </select>

          <label htmlFor="height">height</label>
          <input type="text" name="height" value={model.height} onChange={handleChange}/>

          <label htmlFor="Busto">Busto</label>
          <input type="text" name="Busto" value={model.Busto} onChange={handleChange}/>

          <label htmlFor="Quadril">Quadril</label>
          <input type="text" name="Quadril" value={model.Quadril} onChange={handleChange}/>

          <label htmlFor="Cintura">Cintura</label>
          <input type="text" name="Cintura" value={model.Cintura} onChange={handleChange}/>

          <label htmlFor="instagram">instagram</label>
          <input type="text" name="instagram" value={model.instagram} onChange={handleChange}/>

          <label htmlFor="email">email</label>
          <input type="text" name="email" value={model.email} onChange={handleChange}/>
        </div>
      </div>

      <div className="form_bottom">
        <label htmlFor="self_introduction">self introduction</label>
        <input type="text" name="self_introduction" value={model.self_introduction} onChange={handleChange}/>

        <label htmlFor="career">career</label>
        <input type="text" name="career" value={model.career} onChange={handleChange}/>

        <label htmlFor="language">language</label>
        <select name="language" value={model.language} onChange={handleChange}>
          <Language />
        </select>

        <Country />
      </div>

      <button type="submit">save</button>
    </form>
  );
}

function New_Model(props) {
  return (
    <>
      {props.children}
      <main>
        <ProfileForm />
      </main>
    </>
  );
}

export default New_Model;
