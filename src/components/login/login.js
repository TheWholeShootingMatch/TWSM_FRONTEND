import React, {useEffect, useState} from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";

export function Logout({setIsLogin, setUserType}) {
  useEffect(() => {
    const response = async() => {
      await axios({
        method: 'get',
        withCredentials : true,
        url : '/api/users/logout'
      }).then((res) => {
        if (res.data === true) {
          setIsLogin(false);
          setUserType();
        }
      });
    };
    response();
  }, []);
  alert("logout");
  return <Redirect to={{pathname: "/"}}/>
}

export function Login({setUserType, setIsLogin, isLogin}){

  const [inputs, setInputs] = useState({
    id: '',
    password: ''
  });

  // const [isLogin, setIsLogin] = useState(false); //true -> redirect to mainpage   //더 좋은 방법은 모르겠엄..

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
      }).then((res) => {
        if(res.data === true) { //login 기록이 있을 시 redirect("/")
          alert('already logined');
          setIsLogin(true);
        }
        else {
          setIsLogin(false);
        }
      });
    };
    response();
  },[]);

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/users/login', inputs, {
      withCredentials: true,
    }).then(res => {
      console.log(res.data);
      if(res.data.id === '') {  //login 실패시
        alert("login fail");
        setIsLogin(false);
      }
      else {  //login 성공
        if (res.data.id === "manager") {
          setUserType("manager");
        }
        else {
          setUserType("general");
        }
        setIsLogin(true);
      }
    });
  };

  if(isLogin) {
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
              <input className="id_area" type="text" placeholder="ID" name="id" onChange={onChange} required/>
              <input className="pw_area" type="password" placeholder="PASSWORD" name="password" onChange={onChange} required/>
              <a href="#" className="pw_search">Forgot your password?</a>
              <button className="login_btn" type="submit">LOGIN</button>
            </form>
            <a href="/signup">SIGN UP</a>
          </div>
        </main>
      );
    }
}