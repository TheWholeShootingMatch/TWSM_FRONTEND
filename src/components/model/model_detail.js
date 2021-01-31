import React, { useState } from "react";
import axios from "axios";
import { useFetch } from "../common/useFetch"

function Getting() {
  const [modellists, setModelLists] = useFetch('/api/model');

  return (
    <p> working </p>
  );
}

function Model_Detail() {
  return (
    <Getting />
  );
}

export default Model_Detail;
