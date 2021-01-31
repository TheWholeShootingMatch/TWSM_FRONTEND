import React, { useState } from "react";
import { useFetch } from "../common/useFetch"
import axios from "axios";
import Header from "../common/header";
import SideNav from "../common/sidenav"
import { Link, useHistory } from "react-router-dom";
import './model.scss';

import Modal from '@material-ui/core/Modal';

function Like(){
  return (
    <button class="like_btn">♥</button>
  );
}

function GetModel() {
  const [modellist, setModellist] = useFetch('/api/model');
  return (
    <>
      {modellist.map((elem, index) =>
        <div class="model" key={index}>
          <img src={elem.profile_img} alt={elem.Name}/>
          <Like />
        </div>
      )}
    </>
  );
}

function Compcard(props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div class="model_info">
          <div class="model_img">
            <img src={props.profile_img} alt={props.Name}/>
          </div>
          <div class="model_name">
            <h2>{props.Name}</h2>
          </div>
          <div class="model_contect">
            <p>E-mail : {props.email}</p>
            <p>Instagram : {props.instagram}</p>
          </div>
          <div class="model_size">
            <p>Height : {props.height}</p>
            <p>Age : {props.Age}</p>
            <p>Size : {props.Busto}-{props.Busto}-{props.Busto}</p>
          </div>
          <div class="model_career">
            <p>{props.career}</p>
          </div>
        </div>
        <button class="back_btn"></button>
        <Like />
        <Link to="/model/Model_Detail">View More</Link>
      </Modal>
    </>
  );
}

function Main() {
  return (
    <main>
      <div class="sorting_bar">
        <p>sort as </p>
        <select name="sort">
          <option value="popular" selected>popular</option>
          <option value="latest">lastest</option>
        </select>
      </div>

      <Link to="/model/New_Model">Registration</Link>

      <div class="model_list">
        <GetModel />
      </div>
    </main>
  );
}

function Model() {
  return (
    <>
      <Header />
      <SideNav />
      <Main />
    </>
  );
}

export default Model;
