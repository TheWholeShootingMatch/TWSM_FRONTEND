import React, { useEffect, useState } from "react";
import Header from "../common/header";
import { useFetch } from "../common/useFetch";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { BiArrowBack } from "react-icons/bi";
import "./CollaborateDetail.scss";

function Model({ collaborate }) {
    if (collaborate.model) {
        let {
            gender,
            age_min,
            age_max,
            height_min,
            height_max,
            weight_min,
            weight_max,
            busto_min,
            busto_max,
            quadril_min,
            quadril_max,
            cintura_min,
            cintura_max,
            ethnicity,
            eye_color,
            hair_color,
            model_field,
            model_detail
        } = collaborate;
        return (
            <article>
                <h2>Find Model</h2>
                <ul>
                    <li>gender : {gender}</li>
                    <li>
                        age : {age_min} - {age_max}
                    </li>
                    <li>
                        height : {height_min} - {height_max}
                    </li>
                    <li>
                        weight : {weight_min} - {weight_max}
                    </li>
                    <li>
                        busto : {busto_min} - {busto_max}
                    </li>
                    <li>
                        quadril : {quadril_min} - {quadril_max}
                    </li>
                    <li>
                        cintura : {cintura_min} - {cintura_max}
                    </li>
                    <li>ethnicity : {ethnicity}</li>
                    <li>eye color : {eye_color}</li>
                    <li>field : {model_field}</li>
                    <li>more : {model_detail}</li>
                </ul>
            </article>
        );
    } else {
        return <></>;
    }
}

function Photographer({ collaborate }) {
    if (collaborate.photographer) {
        let { photographer_field, retouch, photographer_detail } = collaborate;
        return (
            <article>
                <h2>Find Photographer</h2>
                <ul>
                    <li>field : {photographer_field}</li>
                    <li>retouch : {retouch}</li>
                    <li>more : {photographer_detail}</li>
                </ul>
            </article>
        );
    } else {
        return <></>;
    }
}

function Main({ projectId }) {
    const [collaborate, setCollaborate] = useState({
        id: "",
        Model: false,
        Photographer: false,
        title: "",
        corporation_name: "",
        about_project: "",
        location: "",
        date: "",
        model: "",
        photographer: "",
        gender: "",
        age_min: "",
        age_max: "",
        height_min: "",
        height_max: "",
        weight_min: "",
        weight_max: "",
        busto_min: "",
        busto_max: "",
        quadril_min: "",
        quadril_max: "",
        cintura_min: "",
        cintura_max: "",
        ethnicity: "",
        eye_color: "",
        hair_color: "",
        model_field: "",
        model_detail: "",
        photographer_field: "",
        retouch: "",
        photographer_detail: ""
    });
    let history = useHistory();

    async function fetchUrl() {
        await axios.post("/api/collaboration/fetch", { _id: projectId }).then(res => {
            setCollaborate(res.data);
        });
    }

    useEffect(() => {
        fetchUrl();
    }, []);

    const deleteProject = e => {
        // e.preventDefault();
        axios.post("/api/collaboration/delete", { _id: projectId }).then(res => {
            history.push("/collaboration/project");
        });
    };

    let { id, title, corporation_name, about_project, location, Pdate } = collaborate;
    const date = new Date(Pdate);

    return (
        <div className="collaborate_detail_wrapper">
            <div className="collaborate_breadcrumbs">
                <span>
                    <BiArrowBack style={{ verticalAlign: "top" }} />
                    <Link to="/collaboration/project/1/L">All Projects</Link>
                </span>
            </div>
            <div className="collaborate_contents_area">
                <div className="project_info">
                    <h1>{title}</h1>
                    <article>
                        <h2>Description</h2>
                        <p>{about_project}</p>
                    </article>

                    <Model collaborate={collaborate} />
                    <Photographer collaborate={collaborate} />
                </div>
                <div className="corporation_info">
                    <h2>{corporation_name}</h2>
                    <h3>Location</h3>
                    <p>{location}</p>
                    <h3>Due Date </h3>
                    <p>
                        {date.getDate()} / {date.getMonth()} / {date.getFullYear()}
                    </p>
                </div>
                {/* <button type="button" onClick={() => deleteProject()}>
                    Delete
                </button> */}
            </div>
        </div>
    );
}

function CollaborateDetail({ isLogin }) {
    let { projectId } = useParams();

    if (typeof projectId == "undefined") {
        return <p> Warning : incorrect path </p>;
    }

    return (
        <>
            <Header isLogin={isLogin} />
            <Main projectId={projectId} />
        </>
    );
}

export default CollaborateDetail;
