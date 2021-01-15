import React, {useEffect, useState} from "react";
import axios from "axios";
import TctComponant from "../tct_componant/TctComponant";
import "./TctWorkflow.scss"

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Modal from '@material-ui/core/Modal';

function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchUrl() {
    const response = await fetch(url);
    const json = await response.json();
    setData(json);
    setLoading(false);
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}

function Category({value,name}){
  return (<option value={value}>{name}</option>);
}

function NewNote() {
  const [categorylist, setCategorylist] = useFetch('/api/category');
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
    <form className="new_note" onSubmit={handleSubmit}>
      <div className="new_header">
        <input type="text" name="new_title" placeholder="NoTitle" onChange={handleChange}/>
        <select name="category" onChange={handleChange}>
          {categorylist.map(element => <Category value={element._id} name={element.category} />)}
        </select>
      </div>

      <input type="text" name="new_text" placeholder="Leave a message" onChange={handleChange}/>

      <button type="submit">save</button>
    </form>
  );
}

function AddBtn() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={handleOpen}>add</button>
      <Modal
      open={open}
      onClose={handleClose}
      >
        <NewNote />
      </Modal>
    </>
  );
}

function Comment(props) {
  return (
    <div className="comment">
      <p className="comment_name">{props.name}</p>
      <p className="comment_text">{props.comment_text}</p>
    </div>
  );
}

function NoteArea(props) {
  return (
    <div className="note_area">
      <div className="note_dot"></div>

      <Accordion className="note">
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="note_title">
            <p className="category_tag">{props.category_tag}</p>
            <h3>{props.title}</h3>
          </div>

          <div className="note_detail">
            <p>{props.writer}</p>
            <p>{props.logdate}</p>
            <p>댓글 {props.commemt_num}개</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>

          <form >
            <input type="text" name="comment" />
            <button type="submit">send</button>
          </form>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function Contents() {
  const [noteList, setNoteList] = useFetch('/api/note');
  const [categorylist, setCategorylist] = useFetch('/api/category');

  return (
    <div className="tct_contents">

      <div className="category_area">
        <select name="category">
          {categorylist.map(element => <Category value={element._id} name={element.category} />)}
        </select>
        <AddBtn />
      </div>

      <div className="note_list">
        {noteList.map (({Cnum,title,logdate,id}) => <NoteArea
          category_tag={Cnum}
          title = {title}
          writer = {id}
          logdate = {logdate}
          commemt_num = {2}
          // comment_list = {sample_note.comment_list}
        />)}
      </div>
    </div>
  );
}

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
