import React, { useState, useContext, createContext, useEffect } from "react";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import './model.scss';

import SideNav from "../common/sidenav"
import Like from "./like_btn";

import Modal from '@material-ui/core/Modal';

const postNum = 4;

const ModalContext = createContext({
  bool: false,
  toggle: () => {}
});

// model ID inside modal
const ModelContext = createContext({
  model : {
    id: "",
    profile_img : "",
    Name : "",
    email : "",
    instagram : "",
    height : "",
    Busto : "",
    Quadril : "",
    Cintura : ""
  },

  setModelContext: () => {}
});

// get query - side_nav condition
function MakeParam({find, sort, skip}) {
  const findInput = {};
  const sortInput = {};
  const skipInput = {};

  // find
  if (find.get("gender") != null) {
    findInput.Gender = find.get("gender");
  }

  if (find.get("height") != null) {
    const height = find.get("height");
    findInput.height = { $gte: height, $lt: height+10 };
  }

  // sort : default "latest"
  if (sort === "P") {
    sortInput.height = 1;
  }
  else if (sort === "O") {
    sortInput._id = 1;
  }
  else {
    sortInput._id = -1;
  }

  //skip
  if (skip != null) {
    skipInput.cur = skip;
    skipInput.postNum = postNum;
  }

  return {
    find : findInput,
    sort : sortInput,
    skip : skipInput
  };
}

// model && page listing
function GetModel({setModelLeng}) {
  //for get models
  let location = useLocation();
  let find = new URLSearchParams(location.search);
  const {sort, skip} = useParams();

  const [modellist, setModellist] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/model", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(MakeParam({find, sort, skip}))
    });
    const json = await response.json();
    setModellist(json);
    setModelLeng(json.length);
  }

  useEffect(() => {
    fetchUrl();
  }, [useLocation()]);

  // for copmpcard
  const { toggle } = useContext(ModalContext);
  const { setModelContext } = useContext(ModelContext);

  const handleClick = (input) => {
    setModelContext(input);
    toggle();
  };

  return (
    <div className="model_list">
      {modellist.map((elem, index) =>
        <div className="model" key={index}>
          <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem)}/>
          <Like />
        </div>
      )}
    </div>
  );
}

function Compcard() {
  //for model info
  const modelC = useContext(ModelContext);

  //for modal
  const open = useContext(ModalContext);
  const { toggle } = useContext(ModalContext);

  return (
    <Modal open={open.bool} onClose={toggle}>
    <div className="Compcard">
      <div className="model_info">
        <div className="model_img">
          <img src={modelC.model.profile_img} alt={modelC.model.Name}/>
        </div>
        <div className="model_name">
          <h2>{modelC.model.Name}</h2>
        </div>
        <div className="model_contect">
          <p>E-mail : {modelC.model.email}</p>
          <p>Instagram : {modelC.model.instagram}</p>
        </div>
        <div className="model_size">
          <p>Height : {modelC.model.height}</p>
          <p>Size : {modelC.model.Busto}-{modelC.model.Quadril}-{modelC.model.Cintura}</p>
        </div>
      </div>
      <Like />
      <Link to={`/model/Model_Detail/${modelC.model._id}`}>
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
  let location = useLocation();
  const [modelLeng,setModelLeng] = useState(1);

  // for page
  let history = useHistory();
  const {skip, sort} = useParams();

  const page = [];

  for (let i=0; i<parseInt(modelLeng/postNum)+1; i++) {
    page.push(<li key={i} onClick={() => { history.push(`/model/Model/${i}/${sort}${location.search}`) }}>{i+1}</li>);
  };

  const handleChange = (e) => {
    history.push(`/model/Model/${skip}/${e.target.value}${location.search}`);
  };

  return (
    <main>
      <div className="main_header">
        <div className="sorting_bar">
          <label htmlFor="sort">sort as </label>
          <select name="sort" onChange={handleChange}>
            <option value="L" defaultValue>Latest</option>
            <option value="O">Oldest</option>
            <option value="P">Popular</option>
          </select>
        </div>

        <NewButton />
      </div>

      <GetModel setModelLeng={setModelLeng}/>

      <ul className="pageControll">
        {page}
      </ul>
    </main>
  );
}

function Model(props) {
  const navContents = [
    {
      name : "gender",
      option : [
        {
          value: "F",
          text: "female"
        },
        {
          value: "M",
          text: "male"
        },
        {
          value: "N",
          text: "not on the list"
        },
      ]
    },
    {
      name : "height",
      option : [
        {
          value: 190,
          text: "190~"
        },
        {
          value: 180,
          text: "180~190"
        },
        {
          value: 170,
          text: "170~180"
        },
        {
          value: 160,
          text: "160~170"
        },
        {
          value: 150,
          text: "150~160"
        },
        {
          value: 140,
          text: "~150"
        },
      ]
    }
  ];

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
  const setModelContext = (input) => {
    setModel(prevState => {
      return {
        ...prevState,
        model : input
      };
    });
  }

  const [model, setModel] = useState({
    model : {
      id: "",
      profile_img : "",
      Name : "",
      email : "",
      instagram : "",
      height : "",
      Busto : "",
      Quadril : "",
      Cintura : ""
    },
    setModelContext
  });

  //get header as children
  return (
    <>
      {props.children}

      <SideNav navContents={navContents} />

      <ModelContext.Provider value={model}>
      <ModalContext.Provider value={bool}>
        <Compcard />
        <Main />
      </ModalContext.Provider>
      </ModelContext.Provider>
    </>
  );
}

export default Model;
