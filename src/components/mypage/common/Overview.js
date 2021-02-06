import React from "react";
import { Redirect } from 'react-router-dom';
import MyPage from "./MyPage";

function Overview({ isLogin, userType }) {
    console.log(userType);
    if (!isLogin) {
        alert("로그인 후 이용하세요!");
        return <Redirect to={{pathname: "/login"}}/>
    }
    return(
        <MyPage header="Overview" isLogin={isLogin} user={userType}>
            <OverviewPropjects user={userType}/>
        </MyPage>
    )
}

function ShortBox(){
    return(
        <div className="box_short"></div>
    )   
}

function ProjectForm({title}){
    return(
        <div className="project_area">
                <h3 className="project_area_header">{title}</h3>
                <div>
                    <ShortBox />
                    <ShortBox />
                </div>
        </div>
    )
}

function OverviewPropjects({user}){

    if(user === "manager"){
        return (
            <>
            <ProjectForm title="requested project"/>
            <ProjectForm title="approved project"/>
            </>
        )
    }
    else{
        return (
            <>
            <ProjectForm title="requested project"/>
            <ProjectForm title="my project"/>
            </>
        )  
    }
}

export default Overview;