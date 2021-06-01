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
        const response = await fetch("/api/photographer/portfolio", {
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

function Main({ photographerId, isLogin }) {
    // get photographer
    // const param = {
    //   method: "POST",
    //   headers: {
    //           'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ _id : photographerId })
    // }
    // const [photographer, setPhotographer] = useFetch('/api/photographer/fetch',param);

    const [photographer, setPhotographer] = useState({
        _id: "",
        Name: "",
        instagram: "",
        email: "",
        self_introduction: "",
        career: "",
        country: "",
        locations: ""
    });

    async function fetchUrl() {
        const response = await fetch("/api/photographer/fetch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ _id: photographerId })
        });

        const json = await response.json();
        setPhotographer(json);
    }

    useEffect(() => {
        fetchUrl();
    }, []);

    return (
        <main>
            <div className="detail_profile_wrapper">
                <article className="detail_section_left">
                    <div className="profile_img">
                        <img src={photographer.profile_img} alt={photographer.Name} />
                    </div>
                    <div className="standard_info">
                        <h1>{photographer.Name}</h1>
                        <section>
                            <h2>Contact</h2>
                            <p>
                                <HiOutlineMail />
                                <span>{photographer.email}</span>
                            </p>
                            <p>
                                <FaInstagram />
                                <span>{photographer.instagram}</span>
                            </p>
                        </section>
                        <section>
                            <h2>Valid Location</h2>
                            <p>{photographer.country}</p>
                            <p>{photographer.locations}</p>
                        </section>
                        <Like id={photographerId} isLogin={isLogin} />
                    </div>
                </article>
                <article className="detail_section_right">
                    <div className="detail_box">
                        <h2>Slef Introduction</h2>
                        <pre>{photographer.self_introduction}</pre>
                    </div>
                    <div className="detail_box">
                        <h2>Career</h2>
                        <pre>{photographer.career}</pre>
                    </div>
                    <div className="detail_box">
                        <h2>Portfolio</h2>
                        <Portfolio Uid={photographer.Uid} />
                    </div>
                </article>
            </div>
        </main>
    );
}

function Photographer_Detail(isLogin) {
    // get photographer id in query
    let { photographerId } = useParams();
    if (typeof photographerId == "undefined") {
        return <p> Warning : incorrect path </p>;
    }

    return (
        <>
            <Header isLogin={isLogin} />
            <Main photographerId={photographerId} isLogin={isLogin} />
        </>
    );
}

export default Photographer_Detail;
