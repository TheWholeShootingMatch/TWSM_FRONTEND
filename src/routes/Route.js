import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from "../components/main/MainPage";
import TctWorkflow from "../components/tct/workflow_tab/TctWorkflow";


function Router() {
    return (
        <BrowserRouter>
        <>
            <Switch>
            <Route exact path="/">
                <MainPage />
            </Route>
            <Route path="/TctWorkflow"><TctWorkflow/></Route>
            </Switch>
        </>
        </BrowserRouter>
    );
}

export default Router;
