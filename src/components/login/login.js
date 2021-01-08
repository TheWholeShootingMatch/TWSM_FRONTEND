import React from "react";

function Login(){

    return(
      <main>
        <div className="logo">
          <img src="" alt="logo"/>
        </div>
        <div className="container">
          <form>
            <input className="id_area" type="text" placeholder="ID" name="id" required/>
            <input className="pw_area" type="password" placeholder="PASSWORD" name="password" required/>
            <a href="#" className="pw_search">Forgot your password?</a>
            <button className="login_btn" type="submit">LOGIN</button>
          </form>
          <a href="/signup">SIGN UP</a>
        </div>
      </main>
    )
}

export default Login;
