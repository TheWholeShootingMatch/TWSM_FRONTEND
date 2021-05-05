import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams, NavLink } from "react-router-dom";
import {
    originSuffix,
    activeUserList
} from "../whiteboard_tab/tools/SharedTypes";
import "./TctComponant.scss";
import axios from "axios";

function SideMenu({ TcTnum }) {
    return (
        <div className="tct_sidemenu">
            <div className="logo_area">logo</div>
            <nav className="menu_area">
                <ul>
                    <li className="menu">
                        <NavLink
                            to={`/TctModel/0/${TcTnum}`}
                            activeClassName="tct-menu-active"
                        >
                            model
                        </NavLink>
                    </li>
                    <li className="menu">
                        <NavLink
                            to={`/TctPhotographer/0/${TcTnum}`}
                            activeClassName="tct-menu-active"
                        >
                            photographer
                        </NavLink>
                    </li>
                    <li className="menu">
                        <NavLink
                            to={`/whiteboard/${originSuffix}`}
                            activeClassName="tct-menu-active"
                        >
                            whiteboard
                        </NavLink>
                    </li>
                    <li className="menu">
                        <NavLink
                            to={`/TctWorkflow/${TcTnum}`}
                            activeClassName="tct-menu-active"
                        >
                            workflow
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

function Header({ TcTnum, title }) {
    const currentList = Array.from(activeUserList.values()).map(e => e[0]);
    const [activeUsers, setActiveUsers] = useState(currentList);
    activeUserList.observe(ymapEvent => {
        ymapEvent.changes.keys.forEach((change, key) => {
            if (change.action === "add") {
                const socketId = activeUsers.map(e => e.socketId);
                if (!socketId.includes(key)) {
                    const user = activeUserList.get(key);
                    setActiveUsers([...activeUsers, user[0]]);
                }
            } else if (change.action === "delete") {
                const socketId = activeUsers.map(e => e.socketId);
                if (socketId.includes(key)) {
                    setActiveUsers(
                        activeUsers.filter(user => user.socketId !== key)
                    );
                }
            }
        });
    });

    // for post
    const [inputs, setInputs] = useState({ TcTnum: TcTnum });
    const [titleInputs, setTitleInputs] = useState("");

    const titleHandleChanges = e => {
        const title = e.target.value;
        setTitleInputs(title);
    };

    const titleSubmit = e => {
        e.preventDefault();
        axios
            .post("/api/tct/title", {
                titleInputs: titleInputs,
                TcTnum: TcTnum
            })
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(err);
            });
    };

    const handleChange = e => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios
            .post("/api/notification/invite", inputs)
            .then(res => {})
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <header className="tct_header">
            <div className="project_title">
                <input
                    placeholder={title}
                    type="text"
                    name="title"
                    value={titleInputs}
                    onChange={titleHandleChanges}
                    onBlur={titleSubmit}
                />
            </div>
            <div className="connected_users">
                {activeUsers.map(user => (
                    <span
                        className="user_icon"
                        style={{
                            color: user.color,
                            borderColor: user.color,
                            boxShadow: `${user.color} 0px 0px 3px 1px`
                        }}
                    >
                        {user.name.charAt(0)}
                    </span>
                ))}
            </div>
            <div className="invite_btn">
                <details>
                    <summary>plus</summary>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="id"
                            placeholder="Enter the ID"
                            onChange={handleChange}
                        />
                        <button type="submit">Invite</button>
                    </form>
                    <div>user list</div>
                </details>
            </div>
        </header>
    );
}

function TctComponant({ children, title }) {
    const { TcTnum } = useParams();
    return (
        <div className="whole_wrapper">
            <SideMenu TcTnum={TcTnum} />
            <div className="tct_wrapper">
                <Header TcTnum={TcTnum} title={title} />
                {children}
            </div>
        </div>
    );
}

export default TctComponant;
