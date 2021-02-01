import React, { useState, useContext, createContext, useEffect } from "react";
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

const ModalContext = createContext({
  bool: false,
  toggle: () => {}
});

const ModelContext = createContext({
  id: "",
  setModel: () => {}
});

function GetModel() {
  const [modellist, setModellist] = useFetch('/api/model');
  const { toggle } = useContext(ModalContext);
  const { setModel } = useContext(ModelContext);

  const handleClick = (input) => {
    setModel(input);
    toggle();
  };

  return (
    <>
      {modellist.map((elem, index) =>
        <div class="model" key={index}>
          <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem._id)}/>
          <Like />
        </div>
      )}
    </>
  );
}

function Compcard() {
  //for modal
  const open = useContext(ModalContext);
  const { toggle } = useContext(ModalContext);

  //for info
  const model = useContext(ModelContext);
  const [info, setInfo] = useState([]);

  const param = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id : model.id })
  }

  async function fetchUrl() {
    const response = await fetch("/api/model/fetch", param);
    const json = await response.json();
    setInfo(json);
  }

  useEffect(() => {
    fetchUrl();
  }, [model.id]);

  return (
    <Modal open={open.bool} onClose={toggle}>
    <div class="Compcard">
      <div class="model_info">
        <div class="model_img">
          <img src={info.profile_img} alt={info.Name}/>
        </div>
        <div class="model_name">
          <h2>{info.Name}</h2>
        </div>
        <div class="model_contect">
          <p>E-mail : {info.email}</p>
          <p>Instagram : {info.instagram}</p>
        </div>
        <div class="model_size">
          <p>Height : {info.height}</p>
          <p>Age : {info.Age}</p>
          <p>Size : {info.Busto}-{info.Busto}-{info.Busto}</p>
        </div>
        <div class="model_career">
          <p>{info.career}</p>
        </div>
      </div>
      <button class="back_btn"></button>
      <Like />
      <Link to="/model/Model_Detail">View More</Link>
    </div>
    </Modal>
  );
}

function Main() {
  const toggle = () => {
    setBool(prevState => {
      return {
        ...prevState,
        bool: !prevState.bool
      };
    });
  };

  const [bool, setBool] = useState({
    bool: false,
    toggle
  });

  const setModel = (input) => {
    setId(prevState => {
      return {
        ...prevState,
        id : input
      };
    });
  }

  const [id, setId] = useState({
    id: "",
    setModel
  });

  return (
    <main>
      <ModalContext.Provider value={bool}>
      <ModelContext.Provider value={id}>
        <Compcard />

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
      </ModelContext.Provider>
      </ModalContext.Provider>
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
