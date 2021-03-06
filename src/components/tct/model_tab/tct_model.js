import React, { useState, useContext, createContext, useEffect } from "react";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { useFetch } from "../../common/useFetch"
import useSocket from "../tct_componant/useSocket";
import TctComponant from "../tct_componant/TctComponant";

import Modal from '@material-ui/core/Modal';

// post in one page && page
const postNum = 3;
const pageNum = 3;

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

// model listing
function GetModel({location, skip, setModelLeng, sendSelectedList}) {
  let skipInput = 0;
  let limitInput = postNum * pageNum;

  //skip && limit
  if (skip != null && skip != 0) {
    skipInput = parseInt(skip/pageNum) * postNum * pageNum;
    limitInput = (parseInt(skip/pageNum) +1) * postNum * pageNum;
  }

  //for get models
  const [modellist, setModellist] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/model",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        find : {},
        sort : {},
        skip : skipInput,
        limit : limitInput
      })
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
              <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem)}/>
              <button onClick={() => sendSelectedList({id:elem._id, func:"P"})}>ADD</button>
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
    </Modal>
  );
}

function Selected({id, sendSelectedList}) {
  const [model, setModel] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/model/fetch",
    {
      method: "POST",
      headers: {
              'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id : id })
    });

    const json = await response.json();
    setModel(json);
  };

  useEffect(() => {
    fetchUrl();
  }, [id]);

  return (
    <>
    <img src={model.profile_img} alt={model.Name} onClick={() => sendSelectedList({id:id, func:"D"})}/>
    </>
  );
}

function Main() {
  let location = useLocation();
  let history = useHistory();
  const {skip} = useParams();

  //for page
  const page = [];

  const [modelLeng,setModelLeng] = useState(1);

  let pageSet = 0;
  if (skip != 0) {
    pageSet = parseInt(skip/pageNum);
    page.push(<li key={-1} onClick={() => { history.push(`/TctModel/${skip*1-1}`) }}>prev</li>);
  }
  else {
    page.push(<li key={-1}>prev</li>);
  }

  for (let i=0; i<parseInt(modelLeng/postNum)+1; i++) {
    if (pageSet*pageNum+i == skip) {
      page.push(<li key={i} onClick={() => { history.push(`/TctModel/${pageSet*pageNum+i}`) }}><strong>{pageSet*pageNum+i+1}</strong></li>);
    }
    else {
      page.push(<li key={i} onClick={() => { history.push(`/TctModel/${pageSet*pageNum+i}`) }}>{pageSet*pageNum+i+1}</li>);
    }
  };

  page.push(<li key={100} onClick={() => { history.push(`/TctModel/${skip*1+1}`) }}>next</li>);

  const handleChange = (e) => {
    history.push(`/TctModel/${skip}`);
  };

  // for selected list
  const { selectedList, sendSelectedList } = useSocket(201);

  const [prevSelectedList, setPrevSelectedList] = useState({models:[]});

  async function fetchUrl() {
    const response = await fetch("/api/tct/modelG",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

      })
    });

    const json = await response.json();
    setPrevSelectedList(json);
  }

  useEffect(() => {
    fetchUrl();
  }, []);

  return (
    <main>
      <div className="selectedArea">
      {
        prevSelectedList.models.map((elem,index)=> <Selected
          id = {elem._id}
          key={index}
          sendSelectedList={sendSelectedList}
        />)
      }

      {
        selectedList.map((elem, index) => <Selected
          id = {elem.body}
          key={index}
          sendSelectedList={sendSelectedList}
        />)
      }
      </div>

      <GetModel
        location={location}
        skip={skip}
        setModelLeng={setModelLeng}
        sendSelectedList = {sendSelectedList}
      />

      <ul className="pageControll">
        {page}
      </ul>
    </main>
  );
}

function Contents() {
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

  return (
    <ModelContext.Provider value={model}>
    <ModalContext.Provider value={bool}>
      <Compcard />
      <Main />
    </ModalContext.Provider>
    </ModelContext.Provider>
  )
}

function TctModel() {
  return (
    <>
      <TctComponant>
        <Contents />
      </TctComponant>
    </>
  );
}
export default TctModel;
