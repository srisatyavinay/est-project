import React from "react";
import { LeftPanel } from "./LeftPanel";
import { Map } from "./Map";

export const Dashboard = () => {
    return (
        <div id="container">
            <LeftPanel/> 
            <Map/>
        </div>
    );
};
