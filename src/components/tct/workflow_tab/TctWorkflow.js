import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFetch } from "../../common/useFetch"
import { useHistory, useLocation } from "react-router-dom";

import TctComponant from "../tct_componant/TctComponant";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Modal from '@material-ui/core/Modal';

function Category() {
  const [categorylist, setCategorylist] = useFetch('/api/category');
  return (
    <>
      {categorylist.map((element, index) =>
        <option value={element._id} key={index}>{element.name}</option>
      )}
    </>
  );
}

//modal
function AddBtn() {

  // for modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // for post
  const [inputs, setInputs] = useState();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/note', inputs)
      .then (res => { window.location.reload(true); })
      .catch(err => { console.error(err); });
  };

  return (
    <>
      <button onClick={handleOpen}>add</button>
      <Modal open={open} onClose={handleClose}>
        <form className="new_note" onSubmit={handleSubmit}>
          <div className="new_header">
            <input type="text" name="title" placeholder="NoTitle" onChange={handleChange}/>
            <select name="category" onChange={handleChange}>
              <option value={""}>select</option>
              <Category />
            </select>
          </div>

          <input type="text" name="text" placeholder="Leave a message" onChange={handleChange}/>
          <button type="submit">save</button>
        </form>
      </Modal>
    </>
  );
}

// contents
function Comment(props) {
  return (
    <div className="comment" id = {props._id}>
      <p className="comment_name">{props.writer}</p>
      <p className="comment_text">{props.contents}</p>
    </div>
  );
}

function NoteArea(props) {
  //fetch comment
  const param = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Lnum : props._id })
  }
  const [commentlist, setCommentlist] = useFetch(`/api/comment/fetch`, param);

  //post comment
  const [inputs, setInputs] = useState({ Lnum:props._id, contents:"" });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/comment', inputs)
      .then (res => { window.location.reload(true); })
      .catch(err => { console.error(err); });
  };

  return (
    <div className="note_area" id = {props._id}>
      <div className="note_dot"></div>

      <Accordion>
        <AccordionSummary>
          <div className="note_title">
            <p className="category_tag">{props.category.name}</p>
            <h3>{props.title}</h3>
            <p>{props.contents}</p>
          </div>

          <div className="note_detail">
            <p>{props.writer.id}</p>
            <p>{props.logdate}</p>
            <p>댓글 {commentlist.length}개</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {commentlist.map(({_id, writer, contents}, index) => <Comment
            key={index}
            _id = {_id}
            writer = {writer.name}
            contents = {contents}
          />)}
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
  let history = useHistory();
  let location = useLocation();
  const find = new URLSearchParams(location.search);

  const findInput = {};
  if (find.get("category") !== null && find.get("category") !== "") {
    findInput.category = find.get("category");
  }

  const [noteList, setNoteList] = useState([]);

  async function fetchUrl() {
    const response = await fetch("/api/note/fetch",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({find : findInput})
    });

    const json = await response.json();
    setNoteList(json);
  }

  useEffect(() => {
    fetchUrl();
  }, [useLocation()]);

  // category filter
  const handleChange = (e) => {
    e.preventDefault();
    find.set(e.target.name, e.target.value);

    history.push(`/TctWorkflow?${find}`);
  };

  return (
    <div className="tct_contents">

      <div className="category_area">
        <select name="category" onChange={handleChange}>
          <option value={""}>select</option>
          <Category />
        </select>
        <AddBtn />
      </div>

      <div className="note_list">
        {noteList.map((elem, index) => <NoteArea
          key={index}
          _id = {elem._id}
          writer = {elem.writer}
          category = {elem.category}
          title = {elem.title}
          contents = {elem.contents}
          logdate = {elem.logdate}
        />)}
      </div>
    </div>
  );
}

// wrap
function TctWorkflow() {
  return (
    <TctComponant>
      <Contents />
    </TctComponant>
  );
}

export default TctWorkflow;
