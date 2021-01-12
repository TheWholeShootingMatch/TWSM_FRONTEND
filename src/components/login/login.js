import React, {useEffect, useState} from "react";
import axios from "axios";

function Login(){

  const [inputs, setInputs] = useState({
    id: '',
    password: ''
  });

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  useEffect(() => {
    const response = async() => {
      await axios({
        method: 'get',
        withCredentials : true,
        url : '/api/users/login'
      })
      .then((res) => console.log(res));
    };
    response();
  },[]);

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/users/login', inputs, {
      withCredentials: true,
    }).then((res) => {alert(res.data)})
    .catch((err) => console.log(err));
  };

    return(
      <main>
        <div className="logo">
          <img src="" alt="logo"/>
        </div>
        <div className="container">
          <form onSubmit={onSubmit}>
            <input className="id_area" type="text" placeholder="ID" name="id" onChange={onChange} required/>
            <input className="pw_area" type="password" placeholder="PASSWORD" name="password" onChange={onChange} required/>
            <a href="#" className="pw_search">Forgot your password?</a>
            <button className="login_btn" type="submit">LOGIN</button>
          </form>
          <a href="/signup">SIGN UP</a>
        </div>
      </main>
    )
}

export default Login;
