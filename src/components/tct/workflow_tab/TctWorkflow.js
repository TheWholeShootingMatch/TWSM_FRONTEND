import React, {useEffect, useState} from "react";
import axios from "axios";
import TctComponant from "../tct_componant/TctComponant";
import "./TctWorkflow.scss"

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Modal from '@material-ui/core/Modal';

//임의로 리스트를 만들어 놨지만 실제론 db에서 카테고리 테이블을 가져오게 해놓을 예정
const categorylist = [
  {
    value: "",
    name:"category"
  },
  {
    value: "p",
    name:"Personnel"
  },
  {
    value: "w",
    name:"WhiteBoard"
  }
];

function Category({value,name}){
  return (<option value={value}>{name}</option>);
}

function NewNote() {
  const [inputs, setInputs] = useState();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    alert(inputs.category + inputs.new_title);
    e.preventDefault();
    axios
      .post('/api/note', inputs)
      .then (res => { alert("The file is successfully uploaded"); })
      .catch(err => { console.error(err); });
  };

  return (
    <form className="new_note" onSubmit={handleSubmit}>
      <div className="new_header">
        <input type="text" name="new_title" placeholder="NoTitle" onChange={handleChange}/>
        <select name="category" onChange={handleChange}>
          {categorylist.map((element, index) => <Category key={index} value={element.value} name={element.name} />)}
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

const sample_note_list = [{
  category_tag : "Personnel",
  title : "모델 한 명 추가",
  date : "2020.11.20",
  commemt_num : 2,
  comment_list : [
    {
      name : "가나다",
      comment_text : "확인."
    },
    {
      name : "마바사",
      comment_text : "확인."
    }
  ]
}];

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
            <p>{props.title}</p>
          </div>

          <div className="note_detail">
            <p>{props.date}</p>
            <p>댓글 {props.commemt_num}개</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {(props.comment_list).map((element, index) => <Comment
            key={index}
            name={element.name}
            comment_text={element.comment_text}
          />)}
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
  return (
    <div className="tct_contents">

      <div className="category_area">
        <select name="category">
          {categorylist.map((element, index) => <Category key={index} value={element.value} name={element.name} />)}
        </select>
        <AddBtn />
      </div>

      <div className="note_list">
        {sample_note_list.map((sample_note, index)=> <NoteArea
          key={index}
          category_tag={sample_note.category_tag}
          title = {sample_note.title}
          date = {sample_note.date}
          commemt_num = {sample_note.commemt_num}
          comment_list = {sample_note.comment_list}
          fold = {sample_note.fold}
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
