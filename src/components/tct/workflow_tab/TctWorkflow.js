import React, { useState } from "react";
import axios from "axios";
import TctComponant from "../tct_componant/TctComponant";
import { useFetch } from "../../common/useFetch"
import "./TctWorkflow.scss"

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Modal from '@material-ui/core/Modal';

// category in modal & contents
function Category({value,name}){
  return (<option value={value}>{name}</option>);
}

function CategotyMapping() {
  const [categorylist, setCategorylist] = useFetch('/api/category');
  return (
    <>
      {categorylist.map((element, index) =>
        <Category value={element._id} name={element.category} key={index}/>)
      }
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
      <Modal
      open={open}
      onClose={handleClose}
      >
        <form className="new_note" onSubmit={handleSubmit}>
          <div className="new_header">
            <input type="text" name="new_title" placeholder="NoTitle" onChange={handleChange}/>
            <select name="Cnum" onChange={handleChange}>
              <Category value={""} name={"select"} />
              <CategotyMapping />
            </select>
          </div>

          <input type="text" name="new_text" placeholder="Leave a message" onChange={handleChange}/>
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
      <p className="comment_name">{props.id}</p>
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

  //post
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
    <div className="note_area">
      <div className="note_dot"></div>

      <Accordion id = {props._id}>
        <AccordionSummary>
          <div className="note_title">
            <p className="category_tag">{props.category_tag}</p>
            <h3>{props.title}</h3>
          </div>

          <div className="note_detail">
            <p>{props.writer}</p>
            <p>{props.logdate}</p>
            <p>댓글 {commentlist.length}개</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {commentlist.map(({_id, id, contents}, index) => <Comment
            key={index}
            _id = {_id}
            id = {id}
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
  const [noteList, setNoteList] = useFetch('/api/note');
  return (
    <div className="tct_contents">

      <div className="category_area">
        <select name="category">
          <CategotyMapping />
        </select>
        <AddBtn />
      </div>

      <div className="note_list">
        {noteList.map(({ Cnum, title, logdate, id, _id }, index) => <NoteArea
          key={index}
          category_tag={Cnum}
          title = {title}
          writer = {id}
          logdate = {logdate}
          _id = {_id}
        />)}
      </div>
    </div>
  );
}

// wrap
function TctWorkflow() {
  return (
    <>
      <TctComponant>
        <Contents />
      </TctComponant>
    </>
  );
}

export default TctWorkflow;
