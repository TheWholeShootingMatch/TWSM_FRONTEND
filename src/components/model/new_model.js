import React, { useState } from "react";
import axios from "axios";
import { useFetch } from "../common/useFetch"
import Header from "../common/header";
import { Link, useHistory } from "react-router-dom";

function ProfileForm() {

  const handleSubmit = (e) => {
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

    axios
    .post('/api/model/new', formData)
    .then((response) => { console.log({ response }) });
  };

  return (
    <form class="model_form" encType='multipart/form-data' onSubmit={handleSubmit}>
      <div class="form_top">

        <div class="left" id="photo_area">
          <label for="photo">Profile photo</label>
          <input type="file" name="photo" accept='image/jpg, image/png, image/jpeg' />
        </div>

        <div class="right" id="basic_info">
          <label for="Name">Name</label>
          <input type="text" name="Name" />

          <label for="Age">Age</label>
          <input type="text" name="Age" />

          <label for="Gender">Gender</label>
          <select name="Gender">
            <option value="">select</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="N">None</option>
          </select>

          <label for="height">height</label>
          <input type="text" name="height" />

          <label for="Busto">Busto</label>
          <input type="text" name="Busto" />

          <label for="Quadril">Quadril</label>
          <input type="text" name="Quadril" />

          <label for="Cintura">Cintura</label>
          <input type="text" name="Cintura" />

          <label for="instagram">instagram</label>
          <input type="text" name="instagram" />

          <label for="email">email</label>
          <input type="text" name="email" />
        </div>
      </div>

      <div class="form_bottom">
        <label for="self_introduction">self introduction</label>
        <input type="text" name="self_introduction" />

        <label for="career">career</label>
        <input type="text" name="career" />
      </div>

      <button type="submit">save</button>
    </form>
  );
}

function New_Model() {
  return (
    <>
      <Header />
      <main>
        <ProfileForm />
      </main>
    </>
  );
}

export default New_Model;
