import React, {Component} from "react";
import TctComponant from "../tct_componant/TctComponant";

class TctWorkflow extends Component {
  render() {
    return (
      <div>
        <NewNote />
        {TctComponant(<Contents />)}
      </div>
    );
  }
}

class NewNote extends Component {
  render() {
    return (
      <form class="new_note" action="">
        <div class="new_header">
          <input type="text" name="new_title" value="NoTitle" />
          <select name="category">
            <option value="">category</option>
            <option value="p">Personnel</option>
            <option value="w">WhiteBoard</option>
            <option value="s">Shooting</option>
            <option value="r">Retouch</option>
          </select>
        </div>

        <input type="text" name="new_text" value="Leave a message" />

        <button type="submit">save</button>
      </form>
    );
  }
}

class Contents extends Component {
  render() {
    return (
      <div class="tct_contents">

        <div class="category_area">
          <select name="category">
            <option value="">category</option>
            <option value="">Personnel</option>
            <option value="">WhiteBoard</option>
          </select>
          <button type="button" name="button">add</button>
        </div>

        <div class="note_list">
          <div class="note_area">
            <div class="note_dot">
            </div>

            <div class="note">
              <div class="note_title">
                <p class="category_tag">Personnel</p>
                <p>모델 한 명 추가</p>
              </div>
              <div class="note_detail">
                <p>2020.11.20</p>
                <p>댓글 3개</p>
              </div>
              <button type="button" name="button">More Info</button>
            </div>

            <div class="note">
              <div class="note_title">
                <p>WhiteBoard</p>
                <p>11.22 수정사항</p>
              </div>
              <div class="note_detail">
                <p>2020.11.22</p>
              </div>
              <button type="button" name="button">More Info</button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default TctWorkflow;
