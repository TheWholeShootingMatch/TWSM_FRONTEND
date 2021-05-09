import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

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
                    console.log(res.data.id);
                    if (res.data.id === "manager") {
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
            <main>
                <div className="logo">
                    <img src="" alt="logo" />
                </div>
                <div className="container">
                    <form onSubmit={onSubmit}>
                        <input
                            className="id_area"
                            type="text"
                            placeholder="ID"
                            name="id"
                            onChange={onChange}
                            required
                        />
                        <input
                            className="pw_area"
                            type="password"
                            placeholder="PASSWORD"
                            name="password"
                            onChange={onChange}
                            required
                        />
                        <a href="#" className="pw_search">
                            Forgot your password?
                        </a>
                        <button className="login_btn" type="submit">
                            LOGIN
                        </button>
                    </form>
                    <a href="/signup">SIGN UP</a>
                </div>
            </main>
        );
    }
}
