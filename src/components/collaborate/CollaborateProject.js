import React, { useState } from "react";
import Header from "../common/header";
import { Link, useHistory, useParams } from "react-router-dom";
import { useFetch } from "../common/useFetch";
import axios from "axios";
import _ from 'lodash';
import './Collaboration.scss';

function NewButton({isLogin}) {
  if(isLogin) {
    return <Link to="Create_Project">New Collaboration</Link>
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

function CollaborateProject({isLogin}) {

    let history = useHistory();
    let {currentPage} = useParams();
    const [collaborationProjects] = useFetch('/api/collaboration');
    const pageSize = 3;
    const pageCollaboration = paginate(collaborationProjects, currentPage, pageSize);

    const handlePageChange = (page) => {
      if(0 < page < collaborationProjects.length/pageSize+1) {
        history.push(`/collaboration/project/${page}`)
        console.log(currentPage)
      }
    };

    if(collaborationProjects.length===0) {
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
                <NewButton isLogin={isLogin}/>
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
                    {pageCollaboration.map((project, index) => <Project project={project} index={(currentPage-1)*pageSize+index}/>)}
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
