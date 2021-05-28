import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Header from "../common/header";
import "./new_photographer.scss";

function PortfolioForm() {
    // for get user information
    const [portfolioP, setPortfolioP] = useState({
        _id: "",
        id: "",
        link: ""
    });

    async function fetchUrl() {
        const response = await fetch("/api/photographer/portfolioUid");
        const json = await response.json();
        if (json !== null) {
            setPortfolioP(json);
        }
    }

    useEffect(() => {
        fetchUrl();
    }, []);

    const handleChange = e => {
        const { value, name } = e.target;
        setPortfolioP({
            ...portfolioP,
            [name]: value
        });
    };

    // for form post
    let history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", e.target.portfolio.files[0]);

        axios.post("/api/photographer/portfolioNew", formData).then(response => {
            history.push(`/photographer/Photographer/0/L`);
        });
    };

    return (
      <div className="new_photographer_wrapper">
        <form className="new_photographer_form" encType="multipart/form-data" onSubmit={handleSubmit}>
          <article className="portfolio_form">
            <div className="photographer_input">
              <label htmlFor="portfolio">Upload the portfolio file</label>
              <p>* please submit as PDF file.</p>
              <input type="file" name="portfolio" accept="application/pdf" />
            </div>
          </article>
          <button className="save_btn" type="submit">SAVE</button>
        </form>
      </div>
    );
}

function P_portfolio({ isLogin }) {
    return (
        <>
            <Header isLogin={isLogin} />
            <main>
                <PortfolioForm />
            </main>
        </>
    );
}

export default P_portfolio;
