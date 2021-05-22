import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import logo from "../tct/tct_componant/TWSM_logo.png";
import "./login.scss";

export function Logout({ setIsLogin, setUserType }) {
    useEffect(() => {
        const response = async () => {
            await axios({
                method: "get",
                withCredentials: true,
                url: "/api/users/logout"
            }).then(res => {
                if (res.data === true) {
                    setIsLogin(false);
                    setUserType();
                    window.localStorage.clear();
                }
            });
        };
        response();
    }, []);
    alert("logout");
    return <Redirect to={{ pathname: "/" }} />;
}

export function Login({ setUserType, setIsLogin, isLogin }) {
    const [inputs, setInputs] = useState({
        id: "",
        password: ""
    });

    const onChange = e => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        axios
            .post("/api/users/login", inputs, {
                withCredentials: true
            })
            .then(res => {
                if (res.data.name === "") {
                    //login 실패시
                    alert("login fail");
                    setIsLogin(false);
                } else {
                    //login 성공
                    window.localStorage.setItem("name", res.data.name);
                    if (res.data.name === "manager") {
                        setUserType("manager");
                    } else {
                        setUserType("general");
                    }
                    setIsLogin(true);
                }
            });
    };

    if (isLogin) {
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
                <div className="login_wrapper">
                    <main>
                        <Link to="/" className="login_logo">
                            <img src={logo} alt="TWSM_LOGO" />
                        </Link>
                        <div className="container">
                            <form onSubmit={onSubmit}>
                                <TextField
                                    id="outlined-id-input"
                                    type="text"
                                    name="id"
                                    variant="outlined"
                                    placeholder="Id"
                                    size="small"
                                    className="id_area"
                                    onChange={onChange}
                                />
                                {/* <span className="pw_search">
                                    Forgot your password?
                                </span> */}
                                <TextField
                                    id="outlined-password-input"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    placeholder="Password"
                                    size="small"
                                    className="pw_area"
                                    onChange={onChange}
                                />
                                <button className="login_btn" type="submit">
                                    LOGIN
                                </button>
                            </form>

                            <p className="signup_btn">
                                Not a member? <Link to="/signup">Sign up now </Link>
                            </p>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}
