import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Header from "../common/header";
import "./NewCollaboration.scss";
import { BiPlusCircle } from "react-icons/bi";

function CollaborationForm({ isLogin }) {
    const [isModel, setModel] = useState(false);
    const [isPhotographer, setPhotographer] = useState(false);

    const onClickArea = type => {
        if (type === "model") {
            setModel(!isModel);
            console.log("model button", isModel);
            if (isModel) {
            }
        } else if (type === "photographer") {
            setPhotographer(!isPhotographer);
            console.log("photographer button", isPhotographer);
        }
    };

    const [collaborate, setCollaborate] = useState({
        Model: false,
        Photographer: false,
        title: "",
        corporation_name: "",
        about_project: "",
        location: "",
        date: "",
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

    useEffect(() => {
        setCollaborate({
            ...collaborate,
            Model: isModel
        });
    }, [isModel]);

    useEffect(() => {
        setCollaborate({
            ...collaborate,
            Photographer: isPhotographer
        });
    }, [isPhotographer]);

    const handleChange = e => {
        const { value, name } = e.target;
        setCollaborate({
            ...collaborate,
            [name]: value
        });
    };

    const handleSubmit = e => {
        e.preventDefault();

        console.log(collaborate);
        axios.post("/api/collaboration/new", collaborate).then(res => {
            history.push("/collaboration/project/1/L");
        });
    };

    return (
        <>
            {" "}
            <Header isLogin={isLogin} />
            <div className="new_collaborate_wrapper">
                <div className="new_collaborate_header">
                    <h1>Create a new Collaboration Project</h1>
                    <p>
                        Our collaboration service help you find professional model and photographer, and connect with
                        qualified candidates.
                    </p>
                </div>

                <form className="new_collaborate_form" onSubmit={handleSubmit}>
                    <article className="overview">
                        <div className="overview_input">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" onChange={handleChange} required />
                        </div>
                        <div className="overview_input">
                            <label htmlFor="corporation_name">Corporation</label>
                            <input type="text" name="corporation_name" onChange={handleChange} required />
                        </div>
                        <div className="overview_input">
                            <label htmlFor="about_project">Description</label>
                            <input type="text" name="about_project" onChange={handleChange} required />
                        </div>
                        <div className="overview_input">
                            <label htmlFor="location">Shooting Location</label>
                            <input type="text" name="location" onChange={handleChange} required />
                        </div>
                        <div className="overview_input">
                            <label htmlFor="date">Due Date</label>
                            <input type="date" name="date" onChange={handleChange} required />
                        </div>
                    </article>

                    <article className="model">
                        <div className="add_field">
                            <button type="button" onClick={() => onClickArea("model")}>
                                <BiPlusCircle style={{ verticalAlign: "top" }} /> Model
                            </button>
                        </div>
                        <div className={isModel ? "model_form active" : "model_form"}>
                            <div className="model_input">
                                <label htmlFor="gender">Gender</label>
                                <label htmlFor="all">All</label>
                                <input id="all" type="radio" name="gender" value="A" onChange={handleChange} />
                                <label htmlFor="male">Male</label>
                                <input id="male" type="radio" name="gender" value="M" onChange={handleChange} />
                                <label htmlFor="female">Female</label>
                                <input id="female" type="radio" name="gender" value="F" onChange={handleChange} />
                            </div>
                            <div className="model_input">
                                <label htmlFor="age">Age</label>
                                <input type="number" name="age_min" min="0" onChange={handleChange} /> -{" "}
                                <input type="number" name="age_max" onChange={handleChange} />
                                years
                            </div>
                            <div className="model_input">
                                <label htmlFor="height">Height</label>
                                <input type="number" name="height_min" min="0" onChange={handleChange} /> -{" "}
                                <input type="number" name="height_max" onChange={handleChange} />
                                cm
                            </div>
                            <div className="model_input">
                                <label htmlFor="weight">Weight</label>
                                <input type="number" name="weight_min" min="0" onChange={handleChange} /> -{" "}
                                <input type="number" name="weight_max" onChange={handleChange} />
                                kg
                            </div>
                            <div className="model_input">
                                <label htmlFor="busto">Busto</label>
                                <input type="number" name="busto_min" min="0" onChange={handleChange} /> -{" "}
                                <input type="number" name="busto_max" onChange={handleChange} />
                            </div>
                            <div className="model_input">
                                <label htmlFor="quadril">Quadril</label>
                                <input type="number" name="quadril_min" min="0" onChange={handleChange} /> -{" "}
                                <input type="number" name="quadril_max" onChange={handleChange} />
                            </div>
                            <div className="model_input">
                                <label htmlFor="cintura">Cintura</label>
                                <input type="number" name="cintura_min" min="0" onChange={handleChange} /> -{" "}
                                <input type="number" name="cintura_max" onChange={handleChange} />
                            </div>
                            <div className="model_input">
                                <label htmlFor="ethnicity">Ethnicity</label>
                                <input type="checkbox" name="ethnicity" value="All" onChange={handleChange} />
                                All
                                <input type="checkbox" name="ethnicity" value="American" onChange={handleChange} />
                                American
                                <input type="checkbox" name="ethnicity" value="European" onChange={handleChange} />
                                European
                                <input type="checkbox" name="ethnicity" value="Asian" onChange={handleChange} />
                                Asian
                                <input type="checkbox" name="ethnicity" value="African" onChange={handleChange} />
                                African
                                <input type="checkbox" name="ethnicity" value="Others" onChange={handleChange} />
                                Others
                            </div>
                            <div className="model_input">
                                <label htmlFor="eye_color">Eye Color</label>
                                <input type="checkbox" name="eye_color" value="All" onChange={handleChange} />
                                All
                                <input type="checkbox" name="eye_color" value="Black" onChange={handleChange} />
                                Black
                                <input type="checkbox" name="eye_color" value="Blue" onChange={handleChange} />
                                Blue
                                <input type="checkbox" name="eye_color" value="Brown" onChange={handleChange} />
                                Brown
                                <input type="checkbox" name="eye_color" value="Green" onChange={handleChange} />
                                Green
                                <input type="checkbox" name="eye_color" value="Others" onChange={handleChange} />
                                Others
                            </div>
                            <div className="model_input">
                                <label htmlFor="hair_color">Hair Color</label>
                                <input type="checkbox" name="hair_color" value="All" onChange={handleChange} />
                                All
                                <input type="checkbox" name="hair_color" value="Black" onChange={handleChange} />
                                Black
                                <input type="checkbox" name="hair_color" value="Blonde" onChange={handleChange} />
                                Blonde
                                <input type="checkbox" name="hair_color" value="Brown" onChange={handleChange} />
                                Brown
                                <input type="checkbox" name="hair_color" value="Grey" onChange={handleChange} />
                                Grey
                                <input type="checkbox" name="hair_color" value="Others" onChange={handleChange} />
                                Others
                            </div>
                            <div className="model_input">
                                <label htmlFor="model_field">Field</label>
                                <input type="checkbox" name="model_field" value="Fashion" onChange={handleChange} />
                                Fashion
                                <input type="checkbox" name="model_field" value="Hair/Makeup" onChange={handleChange} />
                                Hair/Mackup
                                <input type="checkbox" name="model_field" value="Shoe" onChange={handleChange} />
                                Shoe
                                <input type="checkbox" name="model_field" value="Sport" onChange={handleChange} />
                                Sport
                                <input type="checkbox" name="model_field" value="Runway" onChange={handleChange} />
                                Runway
                                <input type="checkbox" name="model_field" value="Others" onChange={handleChange} />
                                Others
                            </div>
                            <div className="model_input">
                                <label htmlFor="model_detail">More Information</label>
                                <input type="text" name="model_detail" onChange={handleChange} />
                            </div>
                        </div>
                    </article>

                    <article className="photographer">
                        <div className="add_field">
                            <button type="button" onClick={() => onClickArea("photographer")}>
                                <BiPlusCircle style={{ verticalAlign: "top" }} /> Photogrpaher
                            </button>
                        </div>
                        <div className={isPhotographer ? "photographer_form active" : "photographer_form"}>
                            <div className="photographer_input">
                                <label htmlFor="photographer_field">Field</label>
                                <input
                                    type="checkbox"
                                    name="photographer_field"
                                    value="Fashion"
                                    onChange={handleChange}
                                />
                                Fashion
                                <input
                                    type="checkbox"
                                    name="photographer_field"
                                    value="Hair/Makeup"
                                    onChange={handleChange}
                                />
                                Hair/Mackup
                                <input type="checkbox" name="photographer_field" value="Shoe" onChange={handleChange} />
                                Shoe
                                <input
                                    type="checkbox"
                                    name="photographer_field"
                                    value="Sport"
                                    onChange={handleChange}
                                />
                                Sport
                                <input
                                    type="checkbox"
                                    name="photographer_field"
                                    value="Object"
                                    onChange={handleChange}
                                />
                                Object
                                <input
                                    type="checkbox"
                                    name="photographer_field"
                                    value="Others"
                                    onChange={handleChange}
                                />
                                Others
                            </div>
                            <div className="photographer_input">
                                <label htmlFor="retouch">Retouch</label>
                                <input type="radio" name="retouch" value="Y" onChange={handleChange} />
                                Yes
                                <input type="radio" name="retouch" value="N" onChange={handleChange} />
                                No
                            </div>
                            <div className="photographer_input">
                                <label htmlFor="photographer_detail">More Information</label>
                                <input type="text" name="photographer_detail" onChange={handleChange} />
                            </div>
                        </div>
                    </article>
                    <input type="submit" value="save" className="new_collaboration_btn" />
                </form>
            </div>
        </>
    );
}

export default CollaborationForm;
