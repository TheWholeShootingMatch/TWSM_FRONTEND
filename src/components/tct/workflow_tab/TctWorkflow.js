import React, { useState } from "react";
import axios from "axios";
import { useFetch } from "../../common/useFetch"

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
        <option value={element._id} key={index}>{element.category}</option>
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
            <input type="text" name="new_title" placeholder="NoTitle" onChange={handleChange}/>
            <select name="Cnum" onChange={handleChange}>
              <option value={""}>select</option>
              <Category />
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
    <div className="note_area">
      <div className="note_dot"></div>

      <Accordion id = {props._id}>
        <AccordionSummary>
          <div className="note_title">
            <p className="category_tag"></p>
            <h3>{props.title}</h3>
            <p>{props.contents}</p>
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

  if (setNoteList) {
    return <p> loading... </p>
  }

  return (
    <div className="tct_contents">

      <div className="category_area">
        <select name="category">
          <option value={""}>select</option>
          <Category />
        </select>
        <AddBtn />
      </div>

      <div className="note_list">
        {noteList.map(({ title,logdate,id,_id,category,contents }, index) => <NoteArea
          key={index}
          title = {title}
          logdate = {logdate}
          writer = {id}
          _id = {_id}
          category = {category}
          contents = {contents}
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
