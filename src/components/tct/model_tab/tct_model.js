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

// model ID inside modal
const ModelContext = createContext({
    model: {
        id: "",
        profile_img: "",
        Name: "",
        email: "",
        instagram: "",
        height: "",
        Busto: "",
        Quadril: "",
        Cintura: ""
    },

    setModelContext: () => {}
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

// model listing
function GetModel({
    location,
    skip,
    setModelLeng,
    sendSelectedList,
    TcTnum,
    selectedDBId
}) {
    let skipInput = 0;
    let limitInput = postNum * pageNum;

    //skip && limit
    if (skip !== null && skip !== 0) {
        skipInput = parseInt(skip / pageNum) * postNum * pageNum;
        limitInput = (parseInt(skip / pageNum) + 1) * postNum * pageNum;
    }

    //for get models
    const [modellist, setModellist] = useState([]);

    async function fetchUrl() {
        const response = await fetch("/api/model", {
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
        setModelLeng(json.length);
        setModellist(json);
    }

    useEffect(() => {
        fetchUrl();
    }, [useLocation()]);

    // for copmpcard
    const { toggle } = useContext(ModalContext);
    const { setModelContext } = useContext(ModelContext);

    const handleClick = input => {
        setModelContext(input);
        toggle();
    };

    // for page
    let indexLow = 0;
    if (skip != 0) {
        indexLow = skip % pageNum;
    }

    return (
        <div className="profile_list">
            {modellist.map((elem, index) => {
                if (
                    indexLow * postNum <= index &&
                    index < indexLow * postNum + postNum
                ) {
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
                type: "M",
                TcTnum: TcTnum
            });
        } else {
            sendSelectedList({
                id: elem._id,
                func: "D",
                type: "M",
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
                    control={
                        <YelllowCheckbox
                            checked={checked}
                            onChange={handleChange}
                            name="checkedG"
                        />
                    }
                />
            </div>
            <div className="profile_wrapper">
                <div className="profile_img">
                    <img src={elem.profile_img} alt={elem.Name} />
                </div>
                <div className="profile_info">
                    <h3>
                        HEIGHT <span>{elem.height}</span>
                    </h3>
                    <h3>
                        SIZE{" "}
                        <span>
                            {elem.Busto} - {elem.Quadril} - {elem.Cintura}
                        </span>
                    </h3>
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
    const { skip,TcTnum } = useParams();

    //for page
    const page = [];

    const [modelLeng, setModelLeng] = useState(1);

    let pageSet = 0;
    if (skip !== 0) {
        pageSet = parseInt(skip / pageNum);
        page.push(
            <li
                key={-1}
                onClick={() => {
                    history.push(`/TctModel/${skip * 1 - 1}/${TcTnum}`);
                }}
            >
                prev
            </li>
        );
    } else {
        page.push(<li key={-1}>prev</li>);
    }

    for (let i = 0; i < parseInt(modelLeng / postNum) + 1; i++) {
        if (pageSet * pageNum + i === skip) {
            page.push(
                <li
                    key={i}
                    onClick={() => {
                        history.push(`/TctModel/${pageSet * pageNum + i}/${TcTnum}`);
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
                        history.push(`/TctModel/${pageSet * pageNum + i}/${TcTnum}`);
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
                history.push(`/TctModel/${skip * 1 + 1}/${TcTnum}`);
            }}
        >
            next
        </li>
    );

    // const handleChange = e => {
    //     history.push(`/TctModel/${skip}`);
    // };

    // for selected list
    const { TcTnum } = useParams();
    const { selectedList, sendSelectedList } = useSocket(TcTnum);
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [selectedDB, setSelectedDB] = useState([]);
    const [selectedDBId, setSelectedDBId] = useState([]);

    async function fetchUrl() {
        const response = await fetch("/api/tct/model", {
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
                style={
                    selectedStatus
                        ? { borderBottom: "1px solid #ebebeb" }
                        : { borderBottom: "none" }
                }
            >
                <h2>Choose your model</h2>
                <div className="selected_list">
                    {selectedDB.map((elem, index) => (
                        <div className="selected_profile">
                            <img src={elem.profile_img} alt={elem.Name} />
                            <span
                                onClick={() =>
                                    sendSelectedList({
                                        id: elem._id,
                                        func: "D",
                                        type: "M",
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
            <GetModel
                location={location}
                skip={skip}
                setModelLeng={setModelLeng}
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
    const setModelContext = input => {
        setModel(prevState => {
            return {
                ...prevState,
                model: input
            };
        });
    };

    const [model, setModel] = useState({
        model: {
            id: "",
            profile_img: "",
            Name: "",
            email: "",
            instagram: "",
            height: "",
            Busto: "",
            Quadril: "",
            Cintura: ""
        },
        setModelContext
    });

    return (
        <ModelContext.Provider value={model}>
            <ModalContext.Provider value={bool}>
                <Main />
            </ModalContext.Provider>
        </ModelContext.Provider>
    );
}

function TctModel() {
    return (
        <>
            <TctComponant linkType={true}>
                <Contents />
            </TctComponant>
        </>
    );
}

export default TctModel;
