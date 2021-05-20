import React, { useEffect, useState } from "react";
import UserMyPage from "../common/MyPage";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { HiOutlineMail } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";
import "./BookMark.scss";

function BookMark({ isLogin }) {
    return (
        <UserMyPage user="user" header="Bookmark" isLogin={isLogin}>
            <BookMarkArea />
        </UserMyPage>
    );
}

function BookMarkArea() {
    const [category, setCategory] = useState("model");
    const [skipNum, setSkipNum] = useState(0);
    const [bookmarkList, setBookmarkList] = useState([]);
    const [isActive, setActive] = useState({
        model: true,
        photographer: false
    });
    const onClickCategory = newCategory => {
        if (newCategory === "model") {
            setActive({ model: true, photographer: false });
        } else {
            setActive({ model: false, photographer: true });
        }
        setBookmarkList([]);
        setSkipNum(0);
        setCategory(newCategory);
    };

    const getBookmarkList = async () => {
        const getBookmarkList = await fetch("/api/bookmark", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ skipNum, category })
        });
        const result = await getBookmarkList.json();
        const filterResult = category === "model" ? result[0].fav_models : result[0].fav_photographers;
        console.log(category, result, bookmarkList);
        setBookmarkList([...bookmarkList, ...filterResult]);
    };

    const onScroll = () => {
        const { documentElement, body } = window.document;
        const scrollHeight = Math.max(documentElement.scrollHeight, body.scrollHeight);
        const scrollTop = Math.max(documentElement.scrollTop, body.scrollTop);
        const clientHeight = documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
            setSkipNum(skipNum + 6);
            getBookmarkList();
        }
    };

    /* 스크롤 이동 리스너 */
    useEffect(() => {
        getBookmarkList();
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [category]);

    return (
        <>
            <div className="bookmark_area_header">
                <ul>
                    <li onClick={() => onClickCategory("model")}>
                        <span className={isActive.model ? "active" : ""}>model</span>
                    </li>
                    <li onClick={() => onClickCategory("photographer")}>
                        <span className={isActive.photographer ? "active" : ""}>photographer</span>
                    </li>
                </ul>
            </div>
            <div className="bookmark_list">
                {bookmarkList.map((list, index) => (
                    <BookmarkModal list={list} key={index} />
                ))}
            </div>
        </>
    );
}

const useStyles = makeStyles(theme => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        width: "fit-content",
        height: "fit-content",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: "20px"
    }
}));

function BookmarkModal({ list }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <div className={classes.paper}>
            <div className="bm_profile_wrapper">
                <h1>{list.Name}</h1>
                <div className="bm_profile">
                    <article className="bm_profile_img">
                        <img src={list.profile_img} alt={list.Name} />
                    </article>
                    <article className="bm_profile_info">
                        <h2>
                            AGE <span>{list.Age}</span>
                        </h2>
                        <h2>
                            GENDER <span>{list.Gender}</span>
                        </h2>
                        <h2>
                            BUSTO <span>{list.Busto}</span>
                        </h2>
                        <h2>
                            CINTURA <span>{list.Cintura}</span>
                        </h2>
                        <h2>
                            HEIGHT <span>{list.height}</span>
                        </h2>
                        <h2>
                            QUADRIL <span>{list.Quadril}</span>
                        </h2>
                        <h2>COUNTRY</h2>
                        <p>{list.country}</p>
                        <h2>CONTACT</h2>
                        <p>
                            <HiOutlineMail />
                            <span>{list.email}</span>
                        </p>
                        <p>
                            <FaInstagram />
                            <span>{list.instagram}</span>
                        </p>
                    </article>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <img src={list.profile_img} alt={list.Name} onClick={handleOpen} />
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}

export default BookMark;
