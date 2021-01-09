import React, {useEffect, useState} from "react";
import axios from "axios";

function Signup(){

  const [inputs, setInputs] = useState({
    name: "",
    id: '',
    email: '',
    password: '',
    password_repeat: ''
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
      const reslut = await axios({
        method: 'get',
        withCredentials : true,
        url : '/api/signup'
      });
      console.log('signup page');
    };
    response();
  },[]);

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/signup', inputs, {
      withCredentials: true,
    });
    console.log('signup page');
  };

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
    )
}

export default Signup;
