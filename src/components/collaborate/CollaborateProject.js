import React, { useState } from "react";
import Header from "../common/header";
import { Link } from "react-router-dom";
import { useFetch } from "../common/useFetch";

function CollaborateProject({isLogin}) {

    const [collaborationProjects] = useFetch('/api/collaboration');

    return (
        <div>
            <Header isLogin={isLogin}/>
            <div className="collaboration_wrapper">
                <main>
                    <Link to="/collaboration/create-project">new</Link>
                    {collaborationProjects.map((project) => <Project project={project} />)}
                </main>
            </div>
        </div>
    )
}

function Project({ project }) {
    
    const { Pdate, title, contents, location } = project;
    return (
        <div className="projects">
            <p>{title} <span>{new Date(Pdate).toLocaleDateString()}</span></p>
            <p>{contents}</p>
            <p>{location}</p>
        </div>

    )
}

export default CollaborateProject;