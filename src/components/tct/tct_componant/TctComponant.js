import React, { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, NavLink } from "react-router-dom";
import {
    originSuffix,
    activeUserList
} from "../whiteboard_tab/tools/SharedTypes";
import "./TctComponant.scss";
import axios from "axios";
import logo from "./TWSM_logo.png";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import { BiUserPin, BiCamera, BiNews, BiSitemap } from "react-icons/bi";
import { IconContext } from "react-icons";

const TcTnumcontext = createContext();

function SideMenu({ TcTnum }) {
    return (
        <div className="tct_sidemenu">
            <div className="logo_area">
                <img src={logo} alt="The Whole Shooting Match logo" />
            </div>
            <IconContext.Provider value={{ className: "menu_icon" }}>
                <nav className="menu_area">
                    <ul>
                        <li className="menu">
                            <NavLink
                                to={`/TctModel/0/${TcTnum}`}
                                activeClassName="tct-menu-active"
                            >
                                <BiUserPin />
                                Model
                            </NavLink>
                        </li>
                        <li className="menu">
                            <NavLink
                                to={`/TctPhotographer/0/${TcTnum}`}
                                activeClassName="tct-menu-active"
                            >
                                <BiCamera />
                                Photographer
                            </NavLink>
                        </li>
                        <li className="menu">
                            <NavLink
                                to={`/whiteboard/${TcTnum}`}
                                activeClassName="tct-menu-active"
                            >
                                <BiNews />
                                Whiteboard
                            </NavLink>
                        </li>
                        <li className="menu">
                            <NavLink
                                to={`/TctWorkflow/${TcTnum}`}
                                activeClassName="tct-menu-active"
                            >
                                <BiSitemap />
                                Workflow
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>
    );
}

AddUserMenu.propTypes = {
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired
};

const useStyles = makeStyles({
    inviteHighlight: {
        color: "#597ef7",
        borderColor: "#597ef7"
    },
    inviteBtn: {
        color: "#fff",
        backgroundColor: "#707070",
        fontWeight: "bold",
        minWidth: "50px"
    },
    paperWidth: {
        maxWidth: "400px"
    }
});

function AddUserMenu(props) {
    const classes = useStyles();
    const TcTnum = useContext(TcTnumcontext);
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    const [inputs, setInputs] = useState({ TcTnum: TcTnum });

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
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
        >
            <DialogTitle
                id="simple-dialog-title"
                className={classes.inviteHighlight}
            >
                Invite User
            </DialogTitle>
            <DialogContent className={classes.paperWidth}>
                <DialogContentText>
                    To invite to this collaboration page, please enter user
                    email address here. We will send invite message to the user.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    name="id"
                    label="Enter the ID"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                />
                <DialogActions>
                    <Button onClick={handleClose} color="red">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        className={classes.inviteHighlight}
                    >
                        Invite
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

function InviteUser() {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = value => {
        setOpen(false);
    };

    return (
        <div className="invite_menu">
            <Button
                variant=""
                onClick={handleClickOpen}
                className={classes.inviteBtn}
            >
                +
            </Button>
            <AddUserMenu open={open} onClose={handleClose} />
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
                            backgroundColor: user.color,
                            boxShadow: `${user.color} 0px 0px 3px 1px`
                        }}
                    >
                        {user.name.charAt(0)}
                    </span>
                ))}
            </div>
            <TcTnumcontext.Provider value={TcTnum}>
                <InviteUser />
            </TcTnumcontext.Provider>
        </header>
    );
}

function TctComponant({ children, title, linkType }) {
    const { TcTnum } = useParams();
    return (
        <div className="whole_wrapper">
            <SideMenu TcTnum={TcTnum} />
            <div
                className="tct_wrapper"
                style={linkType ? { overflow: "none" } : { overflow: "hidden" }}
            >
                <Header TcTnum={TcTnum} title={title} />
                {children}
            </div>
        </div>
    );
}

export default TctComponant;
