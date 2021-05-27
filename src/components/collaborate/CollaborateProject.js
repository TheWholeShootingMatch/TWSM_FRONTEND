import React, { useState, useEffect } from "react";
import Header from "../common/header";
import SideNav from "./sidenav";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
// import { useFetch } from "../common/useFetch";
import axios from "axios";
import _ from "lodash";
import "./Collaboration.scss";
import locationIcon from "./icon/outline_location_on_black_24dp.png";

function NewButton({ isLogin }) {
    if (isLogin) {
        return (
            <Link to="/collaboration/Create_Project">
                <button>create job notice</button>
            </Link>
        );
    }
    return (
        <Link to="/login">
            <button>create job notice</button>
        </Link>
    );
}

function paginate(list, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize; // 자를 배열의 시작점

    return _(list).slice(startIndex).take(pageSize).value();
}

function param({ find, sort }) {
    const findInput = {};
    const sortInput = {};

    if (find.get("heightMin") != null) {
        const heightMin = find.get("heightMin");
        const heightMax = find.get("heightMax");
        findInput.height_max = { $gte: heightMax, $lte: heightMax };
        findInput.height_min = { $gte: heightMin, $lt: heightMax };
    }

    if (find.get("country") != null  && find.get("country") !== "") {
      findInput.country = find.get("country");
    }

    if (find.get("category") === "M") {
        findInput.model = true;
    } else if (find.get("category") === "P") {
        findInput.photographer = true;
    }

    if (sort === "P") {
        sortInput.height = 1;
    } else if (sort === "O") {
        sortInput._id = 1;
    } else {
        sortInput._id = -1;
    }
    return {
        find: findInput,
        sort: sortInput
    };
}

function CollaborateProject({ isLogin }) {
    let history = useHistory();
    let location = useLocation();
    let { currentPage, sort } = useParams();
    const find = new URLSearchParams(location.search);
    const [collaborationProjects, setCollaborationProjects] = useState(null);

    async function fetchUrl() {
        const response = await fetch("/api/collaboration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param({ find, sort }))
        });
        const json = await response.json();
        setCollaborationProjects(json);
    }

    useEffect(() => {
        fetchUrl();
    }, [useLocation()]);

    // const [collaborationProjects] = useFetch('/api/collaboration', JSON.stringify(param({find, sort})));

    const pageSize = 10;
    const pageCollaboration = paginate(collaborationProjects, currentPage, pageSize);

    const handlePageChange = page => {
      if (page !== 0 && page < collaborationProjects.length / pageSize + 1) {
        history.push(`/collaboration/project/${page}/${sort}`);
      }
      else {
        console.log("page length error");
      }
    };

    const handleChange = e => {
        history.push(`/collaboration/project/1/${e.target.value}${location.search}`);
    };

    if (collaborationProjects === null) {
        return (
            <>
                <p>loading...</p>
            </>
        );
    } else {
        return (
            <>
                <Header isLogin={isLogin} />
                <div className="collaboration_wrapper">
                    <div className="left">
                    <div className="new_box">
                      <h3>Create Job Notice</h3>
                      <p>Create notice of job opening post.</p>
                      <NewButton isLogin={isLogin} />
                    </div>
                    <SideNav />
                    </div>
                    <main>
                        <div className="collaboration_header">
                            <div className="sorting_bar">
                                <label htmlFor="sort">Sort by : </label>
                                <select name="sort" onChange={handleChange} className="sortBy">
                                    <option value="L" defaultValue>
                                        Latest
                                    </option>
                                    <option value="O">Oldest</option>
                                </select>
                            </div>
                        </div>
                        <div className="collaboration_table">
                        {pageCollaboration.map((project, index) => (
                            <Project
                                project={project}
                                key={index}
                                index={(currentPage - 1) * pageSize + index}
                            />
                        ))}
                        </div>
                        <Pagination
                            projectSize={collaborationProjects.length}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </main>
                </div>
            </>
        );
    }
}

function Pagination({ projectSize, pageSize, currentPage, onPageChange }) {
    const pageCount = projectSize / pageSize + 1;
    const pages = _.range(1, pageCount);

    return (
        <div>
            <ul className="pagination">
                <li className="page-item">
                    <Link onClick={() => onPageChange(Number(currentPage) - 1)}>prev</Link>
                </li>
                {pages.map(page => (
                    <li key={page} className="page-item">
                        <Link className="page-link" onClick={() => onPageChange(page)}>
                            {page}
                        </Link>
                    </li>
                ))}
                <li className="page-item">
                    <Link onClick={() => onPageChange(Number(currentPage) + 1)}>next</Link>
                </li>
            </ul>
        </div>
    );
}

function Project({ project, index }) {
    const { _id, Pdate, title, corporation_name, location, id } = project;
    const date = new Date(Pdate);
    return (
        <div key={index} className="small_box">
          <div className="small_left">
            <div className="title">
              <h3>{index + 1}</h3>
              <h2>{title}</h2>
              </div>
              <div className="location">
              <img src={locationIcon} alt="locationIcon" />
              <p>{location}</p>
              </div>
              <p className="name">{corporation_name}</p>
          </div>
          <div className="small_right">
            <p className="date">{date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}</p>
            <Link to={`/collaboration/CollaborateDetail/${_id}`}><button>View More</button></Link>
          </div>
        </div>
    );
}

export default CollaborateProject;
