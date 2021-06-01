import React, { useState, useEffect } from "react";
import { useFetch } from "../common/useFetch";
import { useParams } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";
import Like from "./like_btn";
import Header from "../common/header";
import "../common/detail_page.scss";

function Portfolio({ Uid }) {
    const [portfolio, setPortfolio] = useState({
        _id: "",
        id: Uid,
        link: ""
    });

    async function fetchUrl() {
        const response = await fetch("/api/model/portfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: Uid })
        });

        const json = await response.json();
        if (json !== null) {
            setPortfolio(json);
        }
    }

    useEffect(() => {
        fetchUrl();
    }, [Uid]);

    return portfolio.link !== "" ? <a href={portfolio.link}>download</a> : null;
}

function Main({ modelId, isLogin }) {
    // get model
    const [model, setModel] = useState({
        _id: "",
        Name: "",
        Age: "",
        Gender: "",
        height: "",
        Busto: "",
        Quadril: "",
        Cintura: "",
        instagram: "",
        email: "",
        self_introduction: "",
        career: "",
        country: "",
        locations: ""
    });

    async function fetchUrl() {
        const response = await fetch("/api/model/fetch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ _id: modelId })
        });

        const json = await response.json();
        setModel(json);
    }

    useEffect(() => {
        fetchUrl();
    }, []);

    return (
        <main>
            <div className="detail_profile_wrapper">
                <article className="detail_section_left">
                    <div className="profile_img">
                        <img src={model.profile_img} alt={model.Name} />
                    </div>
                    <div className="standard_info">
                        <h1>{model.Name}</h1>
                        <section>
                            <h2>Contact</h2>
                            <p>
                                <HiOutlineMail />
                                <span>{model.email}</span>
                            </p>
                            <p>
                                <FaInstagram />
                                <span>{model.instagram}</span>
                            </p>
                        </section>
                        <section>
                            <h2>Valid Location</h2>
                            <p>{model.country}</p>
                            <p>{model.locations}</p>
                        </section>
                        <Like id={model._id} isLogin={isLogin} />
                    </div>
                </article>
                <article className="detail_section_right">
                    <div className="detail_box">
                        <h2>Slef Introduction</h2>
                        <pre>{model.self_introduction}</pre>
                    </div>
                    <div className="detail_box body_info">
                        <p>
                            <span>{model.Age}</span>
                            AGE
                        </p>
                        <p>
                            <span>{model.height}</span>
                            HEIGHT
                        </p>
                        <p>
                            <span>{model.Busto}</span>
                            Busto
                        </p>
                        <p>
                            <span>{model.Quadril}</span>
                            Quadril
                        </p>
                        <p>
                            <span>{model.Cintura}</span>
                            Cintura
                        </p>
                    </div>
                    <div className="detail_box">
                        <h2>Career</h2>
                        <pre>{model.career}</pre>
                    </div>
                    <div className="detail_box">
                        <h2>Portfolio</h2>
                        <Portfolio Uid={model.Uid} />
                    </div>
                </article>
            </div>
        </main>
    );
}

function Model_Detail(isLogin) {
    // get model id in query
    let { modelId } = useParams();
    if (typeof modelId == "undefined") {
        return <p> Warning : incorrect path </p>;
    }

    return (
        <>
            <Header isLogin={isLogin} />
            <Main modelId={modelId} isLogin={isLogin} />
        </>
    );
}

export default Model_Detail;
