import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import logo from "../common/logo.png";
import Header from "../common/header";
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
                if (res.data.id === "") {
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
                <Header isLogin={false} />
                <div className="login_wrapper">
                    <main>
                        <h2>Sign in to TWSM</h2>
                        <div className="container">
                            <form onSubmit={onSubmit}>
                                <TextField
                                    id="outlined-password-input"
                                    type="text"
                                    name="id"
                                    autoComplete="current-password"
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
                            <Link to="/signup">
                                <button className="signup_btn">SIGN UP</button>{" "}
                            </Link>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}
