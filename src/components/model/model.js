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

// model ID inside modal
const ModelContext = createContext({
  id: "",
  setModel: () => {}
});

// model && page listing
function GetModel() {
  const [modellist, setModellist] = useFetch('/api/model');
  const { toggle } = useContext(ModalContext);
  const { setModel } = useContext(ModelContext);

  const handleClick = (input) => {
    setModel(input);
    toggle();
  };

  // for page
  const [cur, setCur] = useState(0);
  const page = [];
  const pageComponantNum = 5;

  for (let i=0; i<parseInt(modellist.length/pageComponantNum)+1; i++) {
    page.push(<li key={i} onClick={() => setCur(i)}>{i+1}</li>);
  };

  return (
    <>
    <div className="model_list">
      {modellist.map((elem, index) => {
        if (cur*pageComponantNum<=index && index<cur*pageComponantNum+(pageComponantNum-1)) {
          return (
            <div className="model" key={index}>
              <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem._id)}/>
              <Like />
            </div>
          );
        }
      })}
    </div>
    <ul className="pageControll">
      {page}
    </ul>
    </>
  );
}

function Compcard() {
  //for model info
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
      <Like />
      <Link to={`/model/Model_Detail/${info._id}`}>
        View More
      </Link>
    </div>
    </Modal>
  );
}

function NewButton() {
  //check is user logined
  const [isLogin, setIsLogin] = useState(false);
  const [isModel, setIsModel] = useState(false);
  axios
    .get('/api/users/login')
    .then(res => {
      if(res.data === true ) {
          setIsLogin(true);
      }
      else {
          setIsLogin(false);
      }
    })

  if (isLogin) {
    axios
      .get('/api/model/ismodel')
      .then(res => {
        if(res.data === true ) {
            setIsModel(true);
        }
        else {
            setIsModel(false);
        }
      })

    if (isModel) {
      return <Link to="/model/New_Model">Edit Profile</Link>
    }
    return <Link to="/model/New_Model">Registration</Link>
  }
  return <Link to="/login">Registration</Link>
}

function Main() {
  //for modal status
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

  // for modal contents
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

        <div className="main_header">
          <div className="sorting_bar">
            <label htmlFor="sort">sort as </label>
            <select name="sort">
              <option value="popular" defaultValue>popular</option>
              <option value="latest">lastest</option>
            </select>
          </div>

          <NewButton />
        </div>

        <GetModel />
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
