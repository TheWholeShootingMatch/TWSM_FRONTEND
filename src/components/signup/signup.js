import React from "react";

function Signup(){

    return(
      <form>
        <label for="name"><b>Name</b></label>
        <input type="text" placeholder="Enter Name" name="name" required/>

        <label for="id"><b>ID</b></label>
        <input type="text" placeholder="Enter ID" name="id" required/>

        <label for="email"><b>E-mail address</b></label>
        <input type="text" placeholder="Enter E-mail" name="email" required/>

        <label for="password"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="password" required/>

        <label for="password_repeat"><b>Repeat Password</b></label>
        <input type="password" placeholder="Repeat Password" name="password_repeat" required/>

        <input type="submit" value="SIGN UP"/>
      </form>
    )
}

export default Signup;
