import React, { useState, createContext, useContext } from "react";
import { Redirect } from "react-router-dom";
import MyPage from "./MyPage";
import { useFetch } from "../../common/useFetch";
import { useHistory } from "react-router-dom";
import personIcon from "../Icons/person.png";
import axios from "axios";

import "./Overview.scss";

const overviewContext = createContext();

function Overview({ isLogin, userType }) {
    if (!isLogin) {
        alert("로그인 후 이용하세요!");
        return <Redirect to={{ pathname: "/login" }} />;
    }
    return (
        <MyPage isLogin={isLogin} user={userType}>
            <overviewContext.Provider value={userType}>
                <OverviewPropjects />
            </overviewContext.Provider>
        </MyPage>
    );
}

function ShortBox(project, mainTitle) {
    const { title, request_time, _id } = project.project;
    const date = new Date(request_time);

    return (
        <div className="box_short_left">
          <h4>{title}</h4>
          <p>
              {date.getDate() +
              "/" +
              date.getMonth() +
              "/" +
              date.getFullYear()}
          </p>
        </div>
    );
}

function ProjectForm({ mainTitle, projects }) {
    const userType = useContext(overviewContext);
    let history = useHistory();

    const sliceJson = project => {
        if (project) {
            if (userType === "manager") {
                return project;
            } else {
                if (mainTitle === "requested project") {
                    return project;
                } else {
                    return project.TcTnum;
                }
            }
        }
    };

    if (userType === "manager") {
      return (
          <article className="overview_project_area">
              <h3 className="project_area_header">{mainTitle}</h3>
              <div>
                  {projects.map((project, index) => {
                      if (index < 2 && sliceJson(project)) {
                          return (
                            <div className="box_short">
                              <ShortBox
                                project={sliceJson(project)}
                                mainTitle={mainTitle}
                              />
                              <button onClick={() => history.push(`/mypage/requested-message`)}>view</button>
                            </div>
                          );
                      }
                  })}
              </div>
          </article>
      );
    }

    if (mainTitle === "requested project") {
      return (
          <article className="overview_project_area">
              <h3 className="project_area_header">{mainTitle}</h3>
              <div>
                  {projects.map((project, index) => {
                      if (index < 2 && sliceJson(project)) {
                          return (
                            <div className="box_short">
                              <ShortBox
                                project={sliceJson(project)}
                                mainTitle={mainTitle}
                              />
                              <button onClick={() => history.push(`/mypage/requested-project`)}>view</button>
                            </div>
                          );
                      }
                  })}
              </div>
          </article>
      );
    }
    else {
      return (
          <article className="overview_project_area">
              <h3 className="project_area_header">{mainTitle}</h3>
              <div>
                {projects.map((project, index) => {
                    if (index < 2 && sliceJson(project)) {
                        return (
                          <div className="box_short">
                            <ShortBox
                              project={sliceJson(project)}
                              mainTitle={mainTitle}
                            />
                            <button onClick={() => window.open(`/whiteboard/${sliceJson(project)._id}`, "_blank")}>open</button>
                          </div>
                        );
                    }
                })}
              </div>
          </article>
      );
    }
}

function OverviewPropjects() {
    const userType = useContext(overviewContext);
    const [requestedProject] = useFetch("/api/project");
    const [myProjects] = useFetch("/api/project/my-project");

    const [user,setUser] = useFetch("/api/users/mypage");

    if (userType === "manager") {
        return (
            <div className="overview_wrap">
            <div className="Profile_box">
              <img src={personIcon} alt="personIcon" />
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <p>{user._id}</p>
              <button>Edit Profile</button>
            </div>
                <ProjectForm
                    mainTitle="requested project"
                    projects={requestedProject}
                />
                <ProjectForm
                    mainTitle="approved project"
                    projects={requestedProject}
                />
            </div>
        );
    } else {
        return (
            <div className="overview_wrap">
                <div className="Profile_box">
                  <img src={personIcon} alt="personIcon" />
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <p>{user._id}</p>
                  <button>Edit Profile</button>
                </div>
                <ProjectForm
                    mainTitle="requested project"
                    projects={requestedProject}
                />
                <ProjectForm mainTitle="my project" projects={myProjects} />
            </div>
        );
    }
}

export default Overview;
