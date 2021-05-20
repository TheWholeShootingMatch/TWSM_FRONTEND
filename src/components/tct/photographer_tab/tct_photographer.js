import React, { useState, useContext, createContext, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import useSocket from "../tct_componant/useSocket";
import TctComponant from "../tct_componant/TctComponant";
import { HiOutlineMail } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";

// post in one page && page
const postNum = 3;
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

const YelllowCheckbox = withStyles({
    root: {
        color: orange[400],
        padding: 0,
        margin: 0,
        "&$checked": {
            color: orange[600]
        }
    }
})(props => <Checkbox color="default" {...props} />);

// photographer listing
function GetPhotographer({ location, skip, setPhotographerLeng, sendSelectedList, TcTnum, selectedDBId }) {
    let skipInput = 0;
    let limitInput = postNum * pageNum;

    //skip && limit
    if (skip != null && skip != 0) {
        skipInput = parseInt(skip / pageNum) * postNum * pageNum;
        limitInput = (parseInt(skip / pageNum) + 1) * postNum * pageNum;
    }

    const [photographerlist, setPhotographerlist] = useState([]);

    async function fetchUrl() {
        const response = await fetch("/api/photographer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                find: {},
                sort: {},
                skip: skipInput,
                limit: limitInput,
                TcTnum: TcTnum
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
        <div className="profile_list">
            {photographerlist.map((elem, index) => {
                if (indexLow * postNum <= index && index < indexLow * postNum + postNum) {
                    return (
                        <Compcard
                            elem={elem}
                            index={index}
                            key={index}
                            sendSelectedList={sendSelectedList}
                            TcTnum={TcTnum}
                            selectedDBId={selectedDBId}
                        />
                    );
                }
            })}
        </div>
    );
}

function Compcard({ elem, index, sendSelectedList, TcTnum, selectedDBId }) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const x = selectedDBId.includes(elem._id);
        setChecked(x);
    }, [selectedDBId, elem._id]);

    const handleChange = event => {
        setChecked(event.target.checked);
        if (event.target.checked) {
            sendSelectedList({
                id: elem._id,
                func: "P",
                type: "P",
                TcTnum: TcTnum
            });
        } else {
            sendSelectedList({
                id: elem._id,
                func: "P",
                type: "D",
                TcTnum: TcTnum
            });
        }
    };

    return (
        <div className="profile" key={index}>
            <div className="profile_header">
                <h2>{elem.Name}</h2>
                <FormControlLabel
                    style={{ margin: "0" }}
                    control={<YelllowCheckbox checked={checked} onChange={handleChange} name="checkedG" />}
                />
            </div>
            <div className="profile_wrapper">
                <div className="profile_img">
                    <img src={elem.profile_img} alt={elem.Name} />
                </div>
                <div className="profile_info">
                    <h3>CONTACT</h3>
                    <p>
                        <HiOutlineMail />
                        <span>{elem.email}</span>
                    </p>
                    <p>
                        <FaInstagram />
                        <span>{elem.instagram}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function Main() {
    let location = useLocation();
    let history = useHistory();
    const { skip, TcTnum } = useParams();

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
                    history.push(`/TctPhotographer/${skip * 1 - 1}/${TcTnum}`);
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
                        history.push(`/TctPhotographer/${pageSet * pageNum + i}/${TcTnum}`);
                    }}
                >
                    <b>{pageSet * pageNum + i + 1}</b>
                </li>
            );
        } else {
            page.push(
                <li
                    key={i}
                    onClick={() => {
                        history.push(`/TctPhotographer/${pageSet * pageNum + i}/${TcTnum}`);
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
                history.push(`/TctPhotographer/${skip * 1 + 1}/${TcTnum}`);
            }}
        >
            next
        </li>
    );

    const handleChange = e => {
        history.push(`/TctPhotographer/${skip}/${TcTnum}`);
    };

    // for selected list
    const { selectedList, sendSelectedList } = useSocket(TcTnum);
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [selectedDB, setSelectedDB] = useState([]);
    const [selectedDBId, setSelectedDBId] = useState([]);

    async function fetchUrl() {
        const response = await fetch("/api/tct/photographer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ TcTnum: TcTnum })
        });

        const json = await response.json();
        setSelectedDB(json);
        const ids = json.map(elm => elm._id);
        setSelectedDBId(ids);
        if (json.length !== 0) {
            setSelectedStatus(true);
        } else {
            setSelectedStatus(false);
        }
    }

    useEffect(() => {
        fetchUrl();
    }, [selectedList]);

    return (
        <main>
            <div
                className="selected_area"
                style={selectedStatus ? { border: "1px solid #ebebeb" } : { border: "none" }}
            >
                <h2>Choose your photographer</h2>

                <div className="selected_list">
                    {selectedDB.map((elem, index) => (
                        <div class="selected_profile">
                            <img src={elem.profile_img} alt={elem.Name} />
                            <span
                                onClick={() =>
                                    sendSelectedList({
                                        id: elem._id,
                                        func: "D",
                                        type: "P",
                                        TcTnum: TcTnum
                                    })
                                }
                            >
                                X
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <GetPhotographer
                location={location}
                skip={skip}
                setPhotographerLeng={setPhotographerLeng}
                sendSelectedList={sendSelectedList}
                TcTnum={TcTnum}
                selectedDBId={selectedDBId}
            />
            <ul className="page-controll">{page}</ul>
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

    return (
        <PhotographerContext.Provider value={photographer}>
            <ModalContext.Provider value={bool}>
                <Main />
            </ModalContext.Provider>
        </PhotographerContext.Provider>
    );
}

function TctPhotographer() {
    return (
        <>
            <TctComponant linkType={true}>
                <Contents />
            </TctComponant>
        </>
    );
}
export default TctPhotographer;
