import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFetch } from "../../common/useFetch";
import { useHistory, useLocation, useParams } from "react-router-dom";

import TctComponant from "../tct_componant/TctComponant";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import { FaCircle } from "react-icons/fa";

const useStyles = makeStyles(() => ({
    inputField: {
        minWidth: "300px"
    },
    selectField: {
        minWidth: "150px"
    },
    messageField: {
        minWidth: "100%"
    },
    accordionField: {
        width: "80%",
        margin: "40px 0"
    }
}));

function Category({ handleChange, inputs }) {
    const classes = useStyles();
    const [categorylist, setCategorylist] = useFetch("/api/category");
    const [contentsFieldCategory, setContentsFieldCategory] = useState("");

    useEffect(() => {
        if (inputs === undefined) {
            setContentsFieldCategory("Select");
        } else {
            for (let elem of categorylist) {
                if (elem._id === inputs) {
                    setContentsFieldCategory(elem.name);
                }
            }
        }
    }, [inputs]);

    return (
        <>
            <InputLabel id="category" shrink={false}>
                {contentsFieldCategory}
            </InputLabel>
            <Select labelId="category" onChange={handleChange} className={classes.selectField} name="category">
                <MenuItem disabled>Select</MenuItem>
                {categorylist.map((element, index) => (
                    <MenuItem value={element._id}>{element.name}</MenuItem>
                ))}
            </Select>
        </>
    );
}

function NewNote({ TcTnum }) {
    // for post
    const [inputs, setInputs] = useState({ TcTnum: TcTnum });

    const classes = useStyles();

    const handleChange = e => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios
            .post("/api/note", inputs)
            .then(res => {
                window.location.reload(true);
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className="new_note">
            {" "}
            <form onSubmit={handleSubmit}>
                <div className="note_upper">
                    <div>
                        <label htmlFor="title" className="main_label">
                            Title
                        </label>
                        <br />
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            name="title"
                            placeholder="No Title"
                            onChange={handleChange}
                            className={classes.inputField}
                            size="small"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="main_label">
                            Category
                        </label>
                        <br />
                        <FormControl variant="outlined" size="small">
                            <Category handleChange={handleChange} inputs={inputs["category"]} />{" "}
                        </FormControl>
                    </div>
                </div>
                <label htmlFor="text" className="main_label">
                    Message
                </label>
                <br />

                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="text"
                    placeholder="Leave a message"
                    onChange={handleChange}
                    size="small"
                    className={classes.messageField}
                    multiline
                    rows={5}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
}

// contents
function Comment(props) {
    return (
        <div className="comment" id={props._id}>
            <h3 className="comment_name">{props.writer}</h3>
            <p className="comment_text">{props.contents}</p>
        </div>
    );
}

function NoteArea(props) {
    //fetch comment
    const classes = useStyles();

    const param = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Lnum: props._id })
    };
    const [commentlist, setCommentlist] = useFetch(`/api/comment/fetch`, param);

    //post comment
    const [inputs, setInputs] = useState({ Lnum: props._id, contents: "" });

    const handleChange = e => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios
            .post("/api/comment", inputs)
            .then(res => {
                window.location.reload(true);
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className="note_area" id={props._id}>
            <div className="timeline">
                <span className="timeline_icon">
                    {" "}
                    <FaCircle style={props.category.name === "issue" ? { color: "#EBA1F9" } : { color: "#A1F9C2" }} />
                </span>
            </div>
            <Accordion className={classes.accordionField}>
                <AccordionSummary>
                    <span
                        className="note_tag"
                        style={
                            props.category.name === "issue"
                                ? { backgroundColor: "#EBA1F9" }
                                : { backgroundColor: "#A1F9C2" }
                        }
                    >
                        {props.category.name}
                    </span>
                    <div className="note_header">
                        <div className="note_header_main">
                            <h3 className="">{props.writer.id}</h3>
                            <p className="note_title">{props.title}</p>
                        </div>
                        <div className="note_header_sub">
                            <p>
                                {new Date(props.logdate).toLocaleString()} | comment {commentlist.length}
                            </p>
                        </div>
                    </div>
                    <div className="note_detail">
                        <p className="note_contents">{props.contents}</p>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {commentlist.map(({ _id, writer, contents }, index) => (
                        <Comment key={index} _id={_id} writer={writer.name} contents={contents} />
                    ))}
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="contents" onChange={handleChange} />
                        <button type="submit">send</button>
                    </form>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

function Contents() {
    const { TcTnum } = useParams();
    const [input, setInput] = useState("");
    let history = useHistory();
    let location = useLocation();
    const find = new URLSearchParams(location.search);

    const findInput = {};
    findInput.TcTnum = TcTnum;
    if (find.get("category") !== null && find.get("category") !== "") {
        findInput.category = find.get("category");
    }

    const [noteList, setNoteList] = useState([]);

    async function fetchUrl() {
        const response = await fetch("/api/note/fetch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ find: findInput })
        });

        const json = await response.json();
        setNoteList(json);
    }

    useEffect(() => {
        fetchUrl();
        setInput(findInput.category);
    }, [useLocation()]);

    // category filter
    const handleChange = e => {
        e.preventDefault();
        find.set(e.target.name, e.target.value);
        history.push(`/TctWorkflow/${TcTnum}?${find}`);
    };

    return (
        <div className="tct_contents">
            <NewNote TcTnum={TcTnum} />
            <div className="category_area">
                <FormControl variant="outlined" size="small">
                    <Category handleChange={handleChange} inputs={input} />
                </FormControl>
            </div>
            <div className="note_list">
                {noteList.map((elem, index) => (
                    <NoteArea
                        key={index}
                        _id={elem._id}
                        writer={elem.writer}
                        category={elem.category}
                        title={elem.title}
                        contents={elem.contents}
                        logdate={elem.logdate}
                    />
                ))}
            </div>
        </div>
    );
}

// wrap
function TctWorkflow() {
    return (
        <TctComponant linkType={true}>
            <Contents />
        </TctComponant>
    );
}

export default TctWorkflow;
