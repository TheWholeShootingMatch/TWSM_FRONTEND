import React, {useEffect, useState} from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";

function Signup(){

  const [inputs, setInputs] = useState({
    name: "",
    id: '',
    email: '',
    password: '',
    password_repeat: ''
  });

  const [toMain, setToMain] = useState(false);

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
        url : '/api/users/signup'
      }).then((res) => {
        if(res.data === true ) { //login 기록이 있을 시 redirect("/")
          alert('already logined');
          setToMain(true);
        }
      });
    };
    response();
  },[]);

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/users/signup', inputs, {
      withCredentials: true,
    }).then(res => {
      alert(res.data.log);
      setToMain(res.data.isSignup);
    });
  };
  if(toMain) {
      return (
        <Redirect to={{
            pathname: "/"
          }}/>
      );
    }
    else {
      return(
        <main>
          <div className="logo">
            <img src="" alt="logo"/>
          </div>
          <div className="container">
          <form onSubmit={onSubmit}>
            <label for="name"><b>Name</b></label>
            <input type="text" name="name" onChange={onChange} required/>

            <label for="id"><b>ID</b></label>
            <input type="text" name="id" onChange={onChange} required/>

            <label for="email"><b>E-mail address</b></label>
            <input type="text" name="email" onChange={onChange} required/>

            <label for="password"><b>Password</b></label>
            <input type="password" name="password" onChange={onChange} required/>

            <label for="password_repeat"><b>Repeat Password</b></label>
            <input type="password" name="password_repeat" onChange={onChange} required/>

            <input type="submit" value="SIGN UP"/>
          </form>
          </div>
        </main>
      );
    }
}

export default Signup;
