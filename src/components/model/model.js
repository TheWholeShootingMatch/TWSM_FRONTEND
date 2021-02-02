import React, { useState, useContext, createContext, useEffect } from "react";
import { useFetch } from "../common/useFetch"
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import './model.scss';

import Header from "../common/header";
import SideNav from "../common/sidenav"
import Like from "./like_btn";

import Modal from '@material-ui/core/Modal';

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
        <div className="model" key={index}>
          <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem._id)}/>
          <Like />
        </div>
      )}
    </>
  );
}

function Compcard() {
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

  //for modal
  const open = useContext(ModalContext);
  const { toggle } = useContext(ModalContext);

  return (
    <Modal open={open.bool} onClose={toggle}>
    <div className="Compcard">
      <div className="model_info">
        <div className="model_img">
          <img src={info.profile_img} alt={info.Name}/>
        </div>
        <div className="model_name">
          <h2>{info.Name}</h2>
        </div>
        <div className="model_contect">
          <p>E-mail : {info.email}</p>
          <p>Instagram : {info.instagram}</p>
        </div>
        <div className="model_size">
          <p>Height : {info.height}</p>
          <p>Age : {info.Age}</p>
          <p>Size : {info.Busto}-{info.Busto}-{info.Busto}</p>
        </div>
        <div className="model_career">
          <p>{info.career}</p>
        </div>
      </div>
      <button className="back_btn"></button>
      <Like />
      <Link to={`/model/Model_Detail/${model.id}`}>
        View More
      </Link>
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
      <ModelContext.Provider value={id}>
      <ModalContext.Provider value={bool}>
        <Compcard />

        <div className="sorting_bar">
          <p>sort as </p>
          <select name="sort">
            <option value="popular" defaultValue>popular</option>
            <option value="latest">lastest</option>
          </select>
        </div>

        <Link to="/model/New_Model">Registration</Link>

        <div className="model_list">
          <GetModel />
        </div>
      </ModalContext.Provider>
      </ModelContext.Provider>
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
