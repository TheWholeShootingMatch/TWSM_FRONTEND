import React, { useEffect, useState } from "react";
import UserMyPage from "../common/MyPage";

function BookMark({ isLogin }) {

    return(
        <UserMyPage user="user" header="Bookmark" isLogin={isLogin}>
            <BookMarkArea/>
        </UserMyPage>
    )
}

function BookMarkArea() {
    return(
        <>
        <div className="bookmark_area_header">
                <div>model</div>
                <div>photographer</div>
        </div>
        <div className="bookmark_list">
                <div>
                    
                </div>
            </div>
        </>
    )
}

export default BookMark;
