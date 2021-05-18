import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import logo from "../tct/tct_componant/TWSM_logo.png";
import TextField from "@material-ui/core/TextField";
import "./signup.scss";

function Signup() {
    const [inputs, setInputs] = useState({
        name: "",
        id: "",
        email: "",
        password: "",
        password_repeat: ""
    });

    const [toMain, setToMain] = useState(false);

    const onChange = e => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    useEffect(() => {
        const response = async () => {
            await axios({
                method: "get",
                withCredentials: true,
                url: "/api/users/signup"
            }).then(res => {
                if (res.data === true) {
                    //login 기록이 있을 시 redirect("/")
                    alert("already logined");
                    setToMain(true);
                }
            });
        };
        response();
    }, []);

    const onSubmit = e => {
        e.preventDefault();
        axios
            .post("/api/users/signup", inputs, {
                withCredentials: true
            })
            .then(res => {
                alert(res.data.log);
                setToMain(res.data.isSignup);
            });
    };
    if (toMain) {
        return (
            <Redirect
                to={{
                    pathname: "/"
                }}
            />
        );
    } else {
        return (
            <>
                <div className="signup_wrapper">
                    <main>
                        <Link to="/" className="login_logo">
                            <img src={logo} alt="TWSM_logo" />
                        </Link>
                        <div className="container">
                            <form onSubmit={onSubmit}>
                                <p>ID</p>
                                <TextField
                                    type="text"
                                    name="id"
                                    variant="outlined"
                                    placeholder="ID"
                                    size="small"
                                    className="input_area"
                                    onChange={onChange}
                                    required
                                />
                                <p>Name</p>
                                <TextField
                                    type="text"
                                    name="name"
                                    variant="outlined"
                                    placeholder="Name"
                                    size="small"
                                    className="input_area"
                                    onChange={onChange}
                                    required
                                />
                                <p>E-mail address</p>
                                <TextField
                                    type="text"
                                    name="email"
                                    variant="outlined"
                                    placeholder="Name"
                                    size="small"
                                    className="input_area"
                                    onChange={onChange}
                                    required
                                />
                                <p>Password</p>
                                <TextField
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    placeholder="Password"
                                    size="small"
                                    className="input_area"
                                    onChange={onChange}
                                    required
                                />
                                <p>Confirm Password</p>
                                <TextField
                                    type="password"
                                    name="password_repeat"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    placeholder="Confirm Password"
                                    size="small"
                                    className="input_area"
                                    onChange={onChange}
                                    required
                                />
                                <input type="submit" value="SIGN UP" className="signup_btn" />
                            </form>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}

export default Signup;
