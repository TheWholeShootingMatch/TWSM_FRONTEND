import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import MyPage from "./MyPage";
import { useFetch } from "../../common/useFetch";

import "./Overview.scss"

function Overview({ isLogin, userType }) {
    if (!isLogin) {
        alert("로그인 후 이용하세요!");
        return <Redirect to={{ pathname: "/login" }} />;
    }
    return (
        <MyPage header="Overview" isLogin={isLogin} user={userType}>
            <OverviewPropjects user={userType} />
        </MyPage>
    );
}

function ShortBox(project) {
    const { title, description, _id } = project.project;
    return (
        <div
            className="box_short"
            onClick={() => window.open(`/whiteboard/${_id}`, "_blank")}
        >
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
}

function ProjectForm({ title, projects }) {
    return (
        <article className="project_area">
            <h3 className="project_area_header">{title}</h3>
            <div>
                {projects.map((project, index) => {
                    if (index < 4) return <ShortBox project={project.TcTnum} />;
                })}
            </div>
        </article>
    );
}

function OverviewPropjects({ user }) {
    const [requestedProject] = useFetch("/api/project");
    const [myProjects] = useFetch("/api/project/my-project");

    if (user === "manager") {
        return (
            <>
                <ProjectForm
                    title="requested project"
                    projects={requestedProject}
                />
                <ProjectForm
                    title="approved project"
                    projects={requestedProject}
                />
            </>
        );
    } else {
        return (
            <>
                <ProjectForm
                    title="requested project"
                    projects={requestedProject}
                />
                <ProjectForm title="my project" projects={myProjects} />
            </>
        );
    }
}

export default Overview;
