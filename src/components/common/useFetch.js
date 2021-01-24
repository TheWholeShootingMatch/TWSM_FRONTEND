import React, {useEffect, useState} from "react";

function useFetch(url, param) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const option = Object.assign({
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }}, param);
  async function fetchUrl() {
    const response = await fetch(url, option);
    const json = await response.json();
    setData(json);
    setLoading(false);
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}

export { useFetch };
