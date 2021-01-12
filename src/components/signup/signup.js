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
      await axios({
        method: 'get',
        withCredentials : true,
        url : '/api/users/signup'
      })
      .then((res) => console.log(res));
    };
    response();
  },[]);

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/users/signup', inputs, {
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
