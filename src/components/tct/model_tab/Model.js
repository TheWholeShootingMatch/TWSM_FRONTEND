import React from "react";
import TctComponant from "../tct_componant/TctComponant";

function Contents() {
  return (
    <div>
        <p>hello</p>
    </div>
  )
}

function Model() {
  return (
    <>
      <TctComponant>
        <Contents />
      </TctComponant>
    </>
  );
}
export default Model;