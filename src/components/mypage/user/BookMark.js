import React, { useEffect, useState } from "react";
import UserMyPage from "../common/MyPage";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import "./BookMark.css";

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

    const onClickCategory = newCategory => {
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
        const filterResult =
            category === "model"
                ? result[0].fav_models
                : result[0].fav_photographers;
        console.log(category, result, bookmarkList);
        setBookmarkList([...bookmarkList, ...filterResult]);
    };

    const onScroll = () => {
        const { documentElement, body } = window.document;
        const scrollHeight = Math.max(
            documentElement.scrollHeight,
            body.scrollHeight
        );
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
                        <button>model</button>
                    </li>
                    <li onClick={() => onClickCategory("photographer")}>
                        <button>photographer</button>
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
        width: 700,
        height: 500,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        overflow: "auto",
        display: "flex",
        justifyContent: "space-between"
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
            <article>
                <img src={list.profile_img} alt={list.Name} />
                <p>Name : {list.Name}</p>
                <p>email : {list.email}</p>
                <p>instagram : {list.instagram}</p>
            </article>
            <article>
                <p>Age : {list.Age}</p>
                <p>Gender : {list.Gender}</p>
                <p>Busto : {list.Busto}</p>
                <p>Cintura : {list.Cintura}</p>
                <p>height : {list.height}</p>
                <p>Quadril : {list.Quadril}</p>
                <p>career : {list.career}</p>
                <p>country : {list.country}</p>
                <p>locations : {list.locations}</p>
                <p>self_introduction : {list.self_introduction}</p>
            </article>
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
