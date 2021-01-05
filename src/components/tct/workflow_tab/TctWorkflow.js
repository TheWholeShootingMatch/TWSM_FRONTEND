import React, {useEffect} from "react";
import TctComponant from "../tct_componant/TctComponant";

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
  },
  {
    value: "s",
    name:"Shooting"
  },
  {
    value: "r",
    name:"Retouch"
  }
]

function Category({value,name}){
  return (<option value={value}>{name}</option>);
}

function NewNote() {
  return (
    <form className="new_note" action="">
      <div className="new_header">
        <input type="text" name="new_title" placeholder="NoTitle" />
        <select name="category">
          {categorylist.map(element => <Category value={element.value} name={element.name} />)}
        </select>
      </div>

      <input type="text" name="new_text" placeholder="Leave a message" />

      <button type="submit">save</button>
    </form>
  );
}

function Contents() {
  return (
    <div className="tct_contents">

      <div className="category_area">
        <select name="category">
          {categorylist.map(element => <Category value={element.value} name={element.name} />)}
        </select>
        <button type="button" name="button">add</button>
      </div>

      <div className="note_list">

        <div className="note_area">
          <div className="note_dot"></div>
          <div className="note">
            <div className="note_header">
              <div className="note_title">
                <p className="category_tag">Personnel</p>
                <p>모델 한 명 추가</p>
              </div>

              <div className="note_detail">
                <p>2020.11.20</p>
                <p>댓글 2개</p>
              </div>
              <button type="button" name="button">More Info</button>
            </div>
            <div className="note_footer">
              <div className="comment">
                <p className="comment_name">가나다</p>
                <p className="comment_text">확인.</p>
              </div>
              <div className="comment">
                <p className="comment_name">마바사</p>
                <p className="comment_text">확인.</p>
              </div>
              <form>
                <input type="text" name="comment" />
                <button type="submit">send</button>
              </form>
            </div>
          </div>
        </div>

        <div className="note_area">
          <div className="note_dot"></div>
          <div className="note">
            <div className="note_header">
              <div className="note_title">
                <p>WhiteBoard</p>
                <p>11.22 수정사항</p>
              </div>

              <div className="note_detail">
                <p>2020.11.22</p>
              </div>
              <button type="button" name="button">More Info</button>
            </div>
            <div className="note_footer">
              <form>
                <input type="text" name="comment" />
                <button type="submit">send</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function TctWorkflow() {
  return (
    <>
      <NewNote />
      <TctComponant>
        <Contents />
      </TctComponant>
    </>
  );
}

export default TctWorkflow;
