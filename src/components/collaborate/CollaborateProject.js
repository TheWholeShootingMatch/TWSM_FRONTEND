import React, { useState, useEffect } from "react";
import Header from "../common/header";
import SideNav from "./sidenav";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
// import { useFetch } from "../common/useFetch";
import axios from "axios";
import _ from 'lodash';
import './Collaboration.scss';

function NewButton({isLogin}) {
  if(isLogin) {
    return <Link to="/collaboration/Create_Project">New Collaboration</Link>
  }
  return <Link to="/login">New Collaboration</Link>
}

function paginate(list, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize; // 자를 배열의 시작점

  return _(list)
    .slice(startIndex)
    .take(pageSize)
    .value();
}

function param({find, sort}) {
  const findInput = {};
  const sortInput = {};

  if (find.get("category") === "M") {
    findInput.model = true;
  }
  else if(find.get("category") === "P") {
    findInput.photographer = true;
  }
  if (sort === "P") {
    sortInput.height = 1;
  }
  else if (sort === "O") {
    sortInput._id = 1;
  }
  else {
    sortInput._id = -1;
  }
  return {
    find : findInput,
    sort : sortInput
  };
}

function CollaborateProject({isLogin}) {

    let history = useHistory();
    let location = useLocation();
    let {currentPage, sort} = useParams();
    const find = new URLSearchParams(location.search);
    const [collaborationProjects, setCollaborationProjects] = useState(null);

    async function fetchUrl() {
      const response = await fetch("/api/collaboration",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param({find, sort}))
      });
      const json = await response.json();
      setCollaborationProjects(json);
    }

    useEffect(() => {
      fetchUrl();
    }, [useLocation()]);

    // const [collaborationProjects] = useFetch('/api/collaboration', JSON.stringify(param({find, sort})));

    const pageSize = 3;
    const pageCollaboration = paginate(collaborationProjects, currentPage, pageSize);

    const handlePageChange = (page) => {
      if(0 < page < collaborationProjects.length/pageSize+1) {
        history.push(`/collaboration/project/${page}/${sort}`)
        console.log(currentPage)
      }
    };

    const handleChange = (e) => {
      history.push(`/collaboration/project/1/${e.target.value}${location.search}`);
    };

    if(collaborationProjects===null) {
      return (
        <>
          <p>loading...</p>
        </>
      )
    }
    else{
      return (
          <>
            <Header isLogin={isLogin}/>
            <div className="collaboration_wrapper">
              <main>
                <div className="main-header">
                  <div className="sorting_bar">
                    <label htmlFor="sort">sort as </label>
                    <select name="sort" onChange={handleChange}>
                      <option value="L" defaultValue>Latest</option>
                      <option value="O">Oldest</option>
                    </select>
                  </div>
                  <NewButton isLogin={isLogin}/>
                </div>
                <SideNav/>
                <table>
                  <thead>
                    <tr>
                      <th>index</th>
                      <th>title</th>
                      <th>corporation</th>
                      <th>Pdate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageCollaboration.map((project, index) => <Project project={project} key={index} index={(currentPage-1)*pageSize+index}/>)}
                  </tbody>
                </table>
                <Pagination projectSize={collaborationProjects.length} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange}/>
              </main>
            </div>
          </>
      )
    }
}

function Pagination({projectSize, pageSize, currentPage, onPageChange}) {
  const pageCount = projectSize/pageSize + 1;
  const pages = _.range(1, pageCount);

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <a onClick={() => onPageChange(currentPage-1)}>prev</a>
        </li>
        {pages.map(page => (
          <li key={page} className="page-item">
            <a className="page-link" onClick={() => onPageChange(page)}>{page}</a>
          </li>
        ))}
        <li className="page-item">
          <a onClick={() => onPageChange(currentPage+1)}>next</a>
        </li>
      </ul>
    </nav>
  );
}

function Project({ project, index }) {

    const { _id, Pdate, title, corporation_name } = project;
    return (
        <tr key={index}>
          <td>{index+1}</td>
          <td><Link to={`/collaboration/CollaborateDetail/${_id}`}>{title}</Link></td>
          <td>{corporation_name}</td>
          <td>{new Date(Pdate).toLocaleDateString()}</td>
        </tr>

    )
}

export default CollaborateProject;
