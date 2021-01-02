import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from "../components/main/MainPage";


function Router() {
    return (
        <BrowserRouter>
        <>
            <Switch>
            <Route exact path="/">
                <MainPage />
            </Route>
            </Switch>
        </>
        </BrowserRouter>
    );
}

export default Router;