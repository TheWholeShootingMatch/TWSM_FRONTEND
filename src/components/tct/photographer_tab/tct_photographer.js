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

// photographer inside modal
const PhotographerContext = createContext({
  photographer : {
    id: "",
    profile_img : "",
    Name : "",
    email : "",
    instagram : "",
  },

  setPhotographerContext: () => {}
});

// photographer listing
function GetPhotographer ({location, skip, setPhotographerLeng, sendSelectedList}) {
  let skipInput = 0;
  let limitInput = postNum * pageNum;

  //skip && limit
  if (skip != null && skip != 0) {
    skipInput = parseInt(skip/pageNum) * postNum * pageNum;
    limitInput = (parseInt(skip/pageNum) +1) * postNum * pageNum;
  }

  const [photographerlist, setPhotographerlist] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/photographer",
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
    setPhotographerLeng(json.length);
    setPhotographerlist(json);
  }

  useEffect(() => {
    fetchUrl();
  }, [useLocation()]);

  // for copmpcard
  const { toggle } = useContext(ModalContext);
  const { setPhotographerContext } = useContext(PhotographerContext);

  const handleClick = (input) => {
    setPhotographerContext(input);
    toggle();
  };

  // for page
  let indexLow = 0;
  if (skip != 0) {
    indexLow = skip%pageNum;
  }

  return (
    <div className="photographer_list">
      {photographerlist.map((elem, index) => {
        if (indexLow*postNum<=index && index<indexLow*postNum+(postNum)) {
          return (
            <div className="photographer" key={index}>
              <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem)}/>
              <button onClick={() => sendSelectedList({id:elem._id, func:"P", type:"P"})}>ADD</button>
            </div>
          );
        }
      })}
    </div>
  );
}

function Compcard() {
  //for photographer info
  const photographerC = useContext(PhotographerContext);

  //for modal
  const open = useContext(ModalContext);
  const { toggle } = useContext(ModalContext);

  return (
    <Modal open={open.bool} onClose={toggle}>
    <div className="Compcard">
      <div className="photographer_img">
        <img src={photographerC.photographer.profile_img} alt={photographerC.photographer.Name}/>
      </div>
      <div className="photographer_name">
        <h2>{photographerC.photographer.Name}</h2>
      </div>
      <div className="photographer_contact">
        <p>E-mail : {photographerC.photographer.email}</p>
        <p>Instagram : {photographerC.photographer.instagram}</p>
      </div>
    </div>
    </Modal>
  );
}

function Main() {
  let location = useLocation();
  let history = useHistory();
  const {skip} = useParams();

  //for page
  const page = [];

  const [photographerLeng,setPhotographerLeng] = useState(1);

  let pageSet = 0;
  if (skip != 0) {
    pageSet = parseInt(skip/pageNum);
    page.push(<li key={-1} onClick={() => { history.push(`/TctPhotographer/${skip*1-1}`) }}>prev</li>);
  }
  else {
    page.push(<li key={-1}>prev</li>);
  }

  for (let i=0; i<parseInt(photographerLeng/postNum)+1; i++) {
    if (pageSet*pageNum+i == skip) {
      page.push(<li key={i} onClick={() => { history.push(`/TctPhotographer/${pageSet*pageNum+i}`) }}><strong>{pageSet*pageNum+i+1}</strong></li>);
    }
    else {
      page.push(<li key={i} onClick={() => { history.push(`/TctPhotographer/${pageSet*pageNum+i}`) }}>{pageSet*pageNum+i+1}</li>);
    }
  };

  page.push(<li key={100} onClick={() => { history.push(`/TctPhotographer/${skip*1+1}`) }}>next</li>);

  const handleChange = (e) => {
    history.push(`/TctPhotographer/${skip}`);
  };

  // for selected list
  const { selectedList, sendSelectedList } = useSocket(101);

  const [selectedDB, setSelectedDB] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/tct/photographer",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const json = await response.json();
    setSelectedDB(json);
  }

  useEffect(() => {
    fetchUrl();
  }, [selectedList]);

  return (
    <main>
      <div className="selectedArea">
      {selectedDB.map((elem, index) =>
        <img src={elem.profile_img} alt={elem.Name} onClick={() => sendSelectedList({id:elem._id, func:"D", type:"P"})}/>
      )}
      </div>

      <GetPhotographer
        location={location}
        skip={skip}
        setPhotographerLeng={setPhotographerLeng}
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
  const setPhotographerContext = (input) => {
    setPhotographer(prevState => {
      return {
        ...prevState,
        photographer : input
      };
    });
  }

  const [photographer, setPhotographer] = useState({
    photographer : {
      id: "",
      profile_img : "",
      Name : "",
      email : "",
      instagram : "",
    },
    setPhotographerContext
  });

  return (
    <PhotographerContext.Provider value={photographer}>
    <ModalContext.Provider value={bool}>
      <Compcard />
      <Main />
    </ModalContext.Provider>
    </PhotographerContext.Provider>
  )
}

function TctPhotographer() {
  return (
    <>
      <TctComponant>
        <Contents />
      </TctComponant>
    </>
  );
}
export default TctPhotographer;
