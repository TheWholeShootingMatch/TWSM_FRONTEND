import React, { useState } from "react";
import axios from "axios";
import { useFetch } from "../common/useFetch"
function Getting() {
  const [photolists, setPhotoLists] = useFetch('/api/photo');
  console.log(photolists);
  return (
    <>
      {photolists.map((element, index) =>
        <p>{element.link}</p>
      )}
    </>
  );
}

function Model() {
  const handleSubmit = (e) => {
    const formData = new FormData();
    formData.append('file', e.target.photo.files[0]);

    axios
    .post('/api/photo', formData)
    .then((response) => { console.log({ response }) });
  };

  return (
    <>
      <form encType='multipart/form-data' onSubmit={handleSubmit}>
        <input type="file" name="photo" accept='image/jpg, image/png, image/jpeg' />
        <button type="submit">save</button>
      </form>
      <Getting />
    </>
  );
}

export default Model;
