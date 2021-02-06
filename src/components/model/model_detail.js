import { useFetch } from "../common/useFetch"
import {useHistory, useParams} from 'react-router-dom';

import Like from "./like_btn";

function Main({modelId}) {
  // gwt model
  const param = {
    method: "POST",
    headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id : modelId })
  }
  const [model, setModel] = useFetch('/api/model/fetch',param);

  return (
    <main>
      <div className="model_info">
        <div className="model_img">
          <img src={model.profile_img} alt={model.Name}/>
        </div>
        <h2>{model.Name}</h2>
        <p>Age : {model.Age}</p>
        <p>Height : {model.height}</p>
        <p>Busto : {model.Busto}</p>
        <p>Quadril : {model.Quadril}</p>
        <p>Cintura : {model.Cintura}</p>
        <p>E-mail : {model.email}</p>
        <p>Instagram : {model.instagram}</p>
        <p>self introduction</p>
        <p>{model.self_introduction}</p>
        <p>career</p>
        <p>{model.career}</p>
        <div className="model_loc">
          <p>Valid Location : </p>
        </div>
      </div>
      <button className="back_btn"></button>
      <Like />
    </main>
  );
}

function Model_Detail(props) {
  // get model id in query
  let {modelId} = useParams();
  if (typeof modelId == "undefined") {
    return <p> Warning : incorrect path </p>
  }

  return (
    <>
      {props.children}
      <Main modelId = {modelId}/>
    </>
  );
}

export default Model_Detail;
