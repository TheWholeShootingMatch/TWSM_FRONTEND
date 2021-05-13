import React, { useState, useContext, createContext, useEffect } from "react";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import './model.scss';

import SideNav from "./sidenav"
import Like from "./like_btn";

import Modal from '@material-ui/core/Modal';

// post in one page && page
const postNum = 20;
const pageNum = 3;

const ModalContext = createContext({
  bool: false,
  toggle: () => {}
});

// model info inside modal
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
  let skipInput = 0;
  let limitInput = postNum * pageNum;
  let cityInput = "";

  // find
  if (find.get("gender") !== null && find.get("gender") !== "") {
    findInput.Gender = find.get("gender");
  }

  if (find.get("heightMin") != null) {
    const heightMin = find.get("heightMin");
    const heightMax = find.get("heightMax");
    findInput.height = { $gte: heightMin, $lt: heightMax };
  }

  // if (find.get("ageMin") != null) {
  //   const ageMin = find.get("ageMin");
  //   const ageMax = find.get("ageMax");
  //   findInput.Age = { $gte: ageMin, $lt: ageMax };
  // }

  // if (find.get("language") != null && find.get("language") !== "") {
  //   findInput.language = find.get("language");
  // }

  if (find.get("country") != null  && find.get("country") !== "") {
    findInput.country = find.get("country");
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

  //skip && limit
  if (skip != null && skip != 0) {
    skipInput = parseInt(skip/pageNum) * postNum * pageNum;
    limitInput = (parseInt(skip/pageNum) +1) * postNum * pageNum;
  }

  return {
    find : findInput,
    sort : sortInput,
    skip : skipInput,
    limit : limitInput
  };
}

// model listing
function GetModel({location, sort, skip, setModelLeng, isLogin}) {
  //for get models
  const find = new URLSearchParams(location.search);

  const [modellist, setModellist] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/model",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(MakeParam({find, sort, skip}))
    });

    const json = await response.json();
    setModelLeng(json.length);
    setModellist(json);
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

  // for page
  let indexLow = 0;
  if (skip != 0) {
    indexLow = skip%pageNum;
  }

  return (
    <div className="model_list">
      {modellist.map((elem, index) => {
        if (indexLow*postNum<=index && index<indexLow*postNum+(postNum)) {
          return (
            <div className="model" key={index}>
              <div className="model_img">
                <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem)}/>
              </div>
              <div className="model_name">
                <p>{elem.Name}</p>
                {
                  isLogin ? <Like id={elem._id} /> : <button className="like_btn">♡</button>
                }
              </div>
            </div>
          );
        }
      })}
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
      <Like id={modelC.model._id}/>
      <Link to={`/model/Model_Detail/${modelC.model._id}`}>
        View More
      </Link>
    </div>
    </Modal>
  );
}

function NewButton({isLogin}) {
  //check is user logined
  const [isModel, setIsModel] = useState(false);

  if (isLogin) {
    axios
      .get('/api/model/ismodel')
      .then(res => {
        if(res.data === true ) {
            setIsModel(true);
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
  const [isLogin, setIsLogin] = useState(false);
  axios
    .get('/api/users/login')
    .then(res => {
      if(res.data !== false ) {
          setIsLogin(true);
      }
    })

  let location = useLocation();
  let history = useHistory();
  const {skip, sort} = useParams();

  //for page
  const page = [];

  const [modelLeng,setModelLeng] = useState(1);

  let pageSet = 0;
  if (skip != 0) {
    pageSet = parseInt(skip/pageNum);
    page.push(<li key={-1} onClick={() => { history.push(`/model/Model/${skip*1-1}/${sort}${location.search}`) }}>prev</li>);
  }
  else {
    page.push(<li key={-1}>prev</li>);
  }

  for (let i=0; i<parseInt(modelLeng/postNum)+1; i++) {
    if (pageSet*pageNum+i == skip) {
      page.push(<li key={i} onClick={() => { history.push(`/model/Model/${pageSet*pageNum+i}/${sort}${location.search}`) }}><strong>{pageSet*pageNum+i+1}</strong></li>);
    }
    else {
      page.push(<li key={i} onClick={() => { history.push(`/model/Model/${pageSet*pageNum+i}/${sort}${location.search}`) }}>{pageSet*pageNum+i+1}</li>);
    }
  };

  page.push(<li key={100} onClick={() => { history.push(`/model/Model/${skip*1+1}/${sort}${location.search}`) }}>next</li>);

  const handleChange = (e) => {
    history.push(`/model/Model/${skip}/${e.target.value}${location.search}`);
  };

  return (
    <main className="model_content">
      <h1 className="title">MODEL</h1>
      <div className="main_header">
        <div className="sorting_bar">
          <label htmlFor="sort">sort as </label>
          <select name="sort" onChange={handleChange}>
            <option value="L" defaultValue>Latest</option>
            <option value="O">Oldest</option>
            <option value="P">Popular</option>
          </select>
        </div>

        <NewButton isLogin={isLogin}/>
      </div>
      <hr/>
      <SideNav/>

      <GetModel location={location} skip={skip} sort ={sort} setModelLeng={setModelLeng} isLogin={isLogin} />

      <ul className="pageControll">
        {page}
      </ul>
    </main>
  );
}

function Model(props) {
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
