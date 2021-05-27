import React, { useState, useContext, createContext, useEffect } from "react";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import SideNav from "./sidenav";
import Like from "./like_btn";
import Header from "../common/header";
import Modal from "@material-ui/core/Modal";
import "./photographer.scss";

// post in one page && page
const postNum = 16;
const pageNum = 3;

const ModalContext = createContext({
    bool: false,
    toggle: () => {}
});

// photographer inside modal
const PhotographerContext = createContext({
    photographer: {
        id: "",
        profile_img: "",
        Name: "",
        email: "",
        instagram: ""
    },

    setPhotographerContext: () => {}
});

// get query - side_nav condition
function MakeParam({ find, sort, skip }) {
    const findInput = {};
    const sortInput = {};
    let skipInput = 0;
    let limitInput = postNum * pageNum;
    let cityInput = "";

    // find
    if (find.get("language") != null) {
        findInput.language = find.get("language");
    }

    if (find.get("country") != null && find.get("country") !== "") {
        findInput.country = find.get("country");
    }

    // sort : default "latest"
    if (sort === "P") {
        sortInput.height = 1;
    } else if (sort === "O") {
        sortInput._id = 1;
    } else {
        sortInput._id = -1;
    }

    //skip && limit
    if (skip != null && skip != 0) {
        skipInput = parseInt(skip / pageNum) * postNum * pageNum;
        limitInput = (parseInt(skip / pageNum) + 1) * postNum * pageNum;
    }

    //city
    // if (find.get("city") != null) {
    //   cityInput = find.get("city");
    // }

    return {
        find: findInput,
        sort: sortInput,
        skip: skipInput,
        limit: limitInput
    };
}

// photographer listing
function GetPhotographer({ location, sort, skip, setPhotographerLeng, isLogin }) {
    //for get photographers
    const find = new URLSearchParams(location.search);

    const [photographerlist, setPhotographerlist] = useState([]);

    async function fetchUrl() {
        const response = await fetch("/api/photographer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(MakeParam({ find, sort, skip }))
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

    const handleClick = input => {
        setPhotographerContext(input);
        toggle();
    };

    // for page
    let indexLow = 0;
    if (skip != 0) {
        indexLow = skip % pageNum;
    }

    return (
        <div className="photographer_list">
            {photographerlist.map((elem, index) => {
                if (indexLow * postNum <= index && index < indexLow * postNum + postNum) {
                    return (
                        <div className="photographer" key={index}>
                            <div className="photographer_img">
                                <img src={elem.profile_img} alt={elem.Name} onClick={() => handleClick(elem)} />
                            </div>
                            <div className="photographer_name">
                                <p>{elem.Name}</p>
                                <Like id={elem._id} isLogin={isLogin} />
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}

function Compcard({ isLogin }) {
    //for photographer info
    const photographerC = useContext(PhotographerContext);

    //for modal
    const open = useContext(ModalContext);
    const { toggle } = useContext(ModalContext);

    return (
      <Modal open={open.bool} onClose={toggle}>
        <div className="photographer_compcard">
          <div className="photographer_info">
            <div className="left_content">
              <div className="photographer_img">
                <img src={photographerC.photographer.profile_img} alt={photographerC.photographer.Name}/>
              </div>
              <div className="photographer_name">
                <h2>{photographerC.photographer.Name}</h2>
              </div>
            </div>
            <div className="right_content">
              <div className="photographer_contact">
                <p>E-mail : {photographerC.photographer.email}</p>
                <p>Instagram : {photographerC.photographer.instagram}</p>
              </div>
            </div>
          </div>
          <Like id={photographerC.photographer._id} isLogin={isLogin}/>
          <Link className="view_more" to={`/photographer/photographer_Detail/${photographerC.photographer._id}`}>
            View More
          </Link>
        </div>
      </Modal>
    );
}

function NewButton({ isLogin }) {
    //check is user logined
    const [isPhotographer, setIsPhotographer] = useState(false);

    if (isLogin) {
        axios.get("/api/photographer/isPhotographer").then(res => {
            if (res.data === true) {
                setIsPhotographer(true);
            }
        });

        if (isPhotographer) {
            return <Link to="/photographer/New_Photographer">Edit Profile</Link>;
        }
        return <Link to="/photographer/New_Photographer">Registration</Link>;
    }
    return <Link to="/login">Registration</Link>;
}

function Main() {
    const [isLogin, setIsLogin] = useState(false);
    axios.get("/api/users/login").then(res => {
        if (res.data !== false) {
            setIsLogin(true);
        }
    });

    let location = useLocation();
    let history = useHistory();
    const { skip, sort } = useParams();

    //for page
    const page = [];

    const [photographerLeng, setPhotographerLeng] = useState(1);

    let pageSet = 0;
    if (skip != 0) {
        pageSet = parseInt(skip / pageNum);
        page.push(
            <li
                key={-1}
                onClick={() => {
                    history.push(`/photographer/photographer/${skip * 1 - 1}/${sort}${location.search}`);
                }}
            >
                prev
            </li>
        );
    } else {
        page.push(<li key={-1}>prev</li>);
    }

    for (let i = 0; i < parseInt(photographerLeng / postNum) + 1; i++) {
        if (pageSet * pageNum + i == skip) {
            page.push(
                <li
                    key={i}
                    onClick={() => {
                        history.push(`/photographer/photographer/${pageSet * pageNum + i}/${sort}${location.search}`);
                    }}
                >
                    <strong>{pageSet * pageNum + i + 1}</strong>
                </li>
            );
        } else {
            page.push(
                <li
                    key={i}
                    onClick={() => {
                        history.push(`/photographer/photographer/${pageSet * pageNum + i}/${sort}${location.search}`);
                    }}
                >
                    {pageSet * pageNum + i + 1}
                </li>
            );
        }
    }

    page.push(
        <li
            key={100}
            onClick={() => {
                history.push(`/photographer/photographer/${skip * 1 + 1}/${sort}${location.search}`);
            }}
        >
            next
        </li>
    );

    const handleChange = e => {
        history.push(`/photographer/photographer/${skip}/${e.target.value}${location.search}`);
    };

    return (
        <main className="photographer_content">
            <h1 className="title">PHOTOGRAPHER</h1>
            <div className="main_header">
                <div className="sorting_bar">
                    <label htmlFor="sort">sort as </label>
                    <select name="sort" value={sort} onChange={handleChange}>
                        <option value="L" defaultValue>
                            Latest
                        </option>
                        <option value="O">Oldest</option>
                        <option value="P">Popular</option>
                    </select>
                </div>
                <NewButton isLogin={isLogin} />
            </div>
            <hr />
            <SideNav />

            <GetPhotographer
                location={location}
                skip={skip}
                sort={sort}
                setPhotographerLeng={setPhotographerLeng}
                isLogin={isLogin}
            />
            <Compcard isLogin={isLogin} />

            <ul className="pageControll">{page}</ul>
        </main>
    );
}

function Photographer({ isLogin }) {
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
    const setPhotographerContext = input => {
        setPhotographer(prevState => {
            return {
                ...prevState,
                photographer: input
            };
        });
    };

    const [photographer, setPhotographer] = useState({
        photographer: {
            id: "",
            profile_img: "",
            Name: "",
            email: "",
            instagram: ""
        },
        setPhotographerContext
    });

    //get header as children
    return (
        <>
            <Header isLogin={isLogin} />
            <PhotographerContext.Provider value={photographer}>
                <ModalContext.Provider value={bool}>
                    <Main />
                </ModalContext.Provider>
            </PhotographerContext.Provider>
        </>
    );
}

export default Photographer;
