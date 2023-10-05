import React, { useEffect, useState, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader"
import { DataContext } from "../contexts/DataContext";

export const Map = () => {
    let map;
    const [SrcData, setSrcData, Data, setData] = useContext(DataContext);
    const [savedMap, setSavedMap] = useState(null);

    const contDict = {
        "ch": "chemicals, drilling mud",
        "co": "condensate",
        "cr": "crude oil",
        "ga": "gas",
        "no": "no spill",
        "re": "refined products"
    }

    const stausDict = {
        "confirmed": "spill confirmed",
        "invalid": "mistakenly reported",
        "new": "new report",
        "reviewed": "awaiting confirmation"
    }

    const zonalOfficeDict = {
        "ab": "Abuja",
        "ak": "Akure",
        "by": "Bayelsa",
        "kd": "Kaduna",
        "lg": "Lagos",
        "ph": "Port Harcourt",
        "uy": "Uyo",
        "wa": "Warri"
    }

    const companyDict = {
        "ADDAX": "Addax Petroleum Development Company Nigeria Limited",
        "AENR": "Agip Energy Natural Resources Limited",
        "AGIP": "Agip Energy Natural Resources Limited",
        "ALLIED": "Allied Energy Resources Nigeria Limited",
        "AMNI": "AMNI International Petroleum Development Company Ltd",
        "ANTAN": "ANTAN Exploration and Production Ltd (formaly Addax Petroleum)",
        "Aiteo E&P": "Aiteo Exploration and Production",
        "BRITANIA": "Britania-U Nigeria Ltd",
        "Belema E&P": "Belema Exploration and Production",
        "CHEVPEN": "Chevron/Pennington",
        "CHEVRON": "Chevron Nigeria Limited",
        "CHORUS": "Chorus Energy Limited",
        "Dubri": "Dubri Oil Company Limited",
        "ERL": "Enageed Resource Limited",
        "ESSO": "Esso Exploration and Production Nigeria Limited",
        "EXPRESS": "Express Petroleum and Gas Comany Limited",
        "Eroton E&P": "Eroton Exploration & Production Limited",
        "FIRST": "First Hydrocarbon Nigeria",
        "FOL": "Fronteir Oil Ltd",
        "Heritage": "Heritage Energy Operational Service Limited",
        "KRPC": "Kaduna Refining and Petrochemical Company",
        "MPN": "Mobil Producing Nigeria Unlimited",
        "Midwestern": "Midwestern Oil & Gas Corporation",
        "Millennium O&G": "Millennium Oil & Gas",
        "NAE": "Nigerian Agip Energy",
        "NAOC": "Nigerian Agip Oil Company",
        "NDPR": "Niger Delta Petroleum Resources Limited",
        "NDWEST": "ND Western",
        "NEPL": "NNPC Exploration & Production Ltd",
        "NEPN": "Network Exploration & Production Nigeria Ltd",
        "NPDC": "National Petroleum Development Company",
        "Neconde": "Neconde Energy Limited",
        "NewCross E&P": "NewCross Exploration and Production",
        "ORIENTAL": "Oriental Energy Resources Ltd",
        "PHRC": "Port Harcourt Refining and Petrochemical Company",
        "PHRPC": "Port Harcourt Refining and Petrochemical Company",
        "POOCN": "Pan Ocean Oil Corporation Nigeria Limited",
        "PPMC": "Pipelines and Products Marketing Company",
        "Pillar": "Pillar Oil Limited",
        "Platform": "Platform Petroleum Limited",
        "SAPETRO": "South Atlantic Petroleum",
        "SEEPCO": "Sterling Exploration and Energy Production Company Limited",
        "SEPLAT": "Seplat Petroleum Development Company Limited",
        "SNEPCO": "Shell Nigeria Exploration and Production Company Limited",
        "SPDC": "Shell Petroleum Development Company",
        "STARDEEP": "Star Deep Water Petroleum",
        "Sahara": "Sahara Energy Fields Limited",
        "TOTAL": "Total Exploration and Production",
        "TUPNI": "Total Upstream Nigeria",
        "UERL": "Universal Energy Resources Limited",
        "WALTSMITH": "Walter Smith Petroman Oil Ltd",
        "WRPC": "Warri Refining and Petrochemical Company",
        "nyd": "Not yet determined"
    }

    const facilityDict = {
        "cp": "Compressor plant",
        "fd": "Fuel dispensation station / fuel retail outlet",
        "fl": "Flow line",
        "fp": "FPSO; Floating, Production, Storage and Offloading platform",
        "fs": "Flow station",
        "gl": "Gas line",
        "mf": "Manifold",
        "pl": "Pipeline",
        "ps": "Pumping station",
        "rg": "Rig",
        "st": "Storage tank, surface or underground",
        "tf": "Tank farm",
        "tk": "Tanker",
        "wh": "Well head"
    }

    const causeDict = {
        "cor": "corrosion",
        "eqf": "equipment failure",
        "ome": "operational/maintenance error",
        "sab": "sabotage/theft",
        "ytd": "yet to determine"
    }

    const initContMesDict = {
        bm: "Boom",
        bw: "Bund wall",
        dk: "Dyke",
        nd: "Natural depression",
        pt: "Pit",
        sb: "Sorbents",
        tr: "Trench"
    }

    const habitatDict = {
        co: "Coastland",
        iw: "Inland waters",
        la: "Land",
        ns: "Near shore",
        of: "Offshore",
        ss: "Seasonal swamp",
        sw: "Swamp"
    }

    const statesDict = {
        AB: "Abia",
        AD: "Adamawa",
        AK: "Akwa Ibom",
        AN: "Anambra",
        BA: "Bauchi",
        BE: "Benue",
        BO: "Borno",
        BY: "Bayelsa",
        CR: "Cross River",
        DE: "Delta",
        EB: "Ebonyi",
        ED: "Edo",
        EK: "Ekiti",
        EN: "Enugu",
        FC: "Abuja Federal Capital Territory",
        GO: "Gombe",
        IM: "Imo",
        JI: "Jigawa",
        KD: "Kaduna",
        KE: "Kebbi",
        KN: "Kano",
        KO: "Kogi",
        KT: "Katsina",
        KW: "Kwara",
        LA: "Lagos",
        NA: "Nassarawa",
        NI: "Niger",
        OG: "Ogun",
        ON: "Ondo",
        OS: "Osun",
        OY: "Oyo",
        PL: "Plateau",
        RI: "Rivers",
        SO: "Sokoto",
        TA: "Taraba",
        YO: "Yobe",
        ZA: "Zamfara"
    }

    const [MapsLibrary, setMapsLibrary] = useState(null);
    const [MarkerLibrary, setMarkerLibrary] = useState(null);
    const [Google, setGoogle] = useState(null);

    useEffect(() => {
        const additionalOptions = {};
        const position = { lat: 6.0706872, lng: 7.1283823 };

        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            version: "weekly",
            ...additionalOptions,
        });

        const func = async () => {
            const google = await loader.load();
            setGoogle(google);
            const MapsLibrary = await google.maps.importLibrary("maps");
            const Map = MapsLibrary.Map
            setMapsLibrary(MapsLibrary);
            const MarkerLibrary = await google.maps.importLibrary("marker");
            setMarkerLibrary(MarkerLibrary);
            const AdvancedMarkerElement = MarkerLibrary.AdvancedMarkerElement;

            map = new Map(document.getElementById("right-panel"), {
                zoom: 6,
                center: position,
                mapId: "DEMO_MAP_ID",
                mapTypeId: 'hybrid'
            });

            setSavedMap(map);

            console.log(Data);
            console.log("Hi I am printing once");

        }
        func();
    }, []);

    useEffect(() => {

        if (savedMap && Data !== null && MarkerLibrary && Google) {
            const AdvancedMarkerElement = MarkerLibrary.AdvancedMarkerElement;
            const google = Google;
            // get filtered data from data that has latitude and longitude and the convert incidentdate into date obejct and check if it is 2023
            const filteredData = Data.filter((item) => {
                // return item.latitude !== null && item.longitude !== null && new Date(item.incidentdate).getFullYear() === 2023
                return item.latitude !== null && item.longitude !== null;
            });
            // mark the points on the map
            filteredData.forEach((item) => {
                if (!isNaN(Number(item.latitude)) && !isNaN(Number(item.longitude))) {
                    const position = { lat: Number(item.latitude), lng: Number(item.longitude) };
                    const marker = new AdvancedMarkerElement({
                        map: savedMap,
                        position: position,
                        // title: item.incidentnumber,
                    });

                    let contentString = ``;

                    if(item.incidentnumber) {
                        contentString += `<h1>Incident Number: ${item.incidentnumber}</h1></div>`;
                    }
                    if(item.status) {
                        contentString += `<div><p>Status: ${stausDict[item.status]}</p></div>`;
                    }
                    if(item.zonaloffice) {
                        contentString += `<div><p>Zonal Office: ${item.zonaloffice.split(",").map((item) => zonalOfficeDict[item]).join(", ")}</p></div>`;
                    }
                    if(item.company) {
                        contentString += `<p>Company: ${companyDict[item.company]}</p></div>`;
                    }
                    if(item.incidentnumber) {
                        contentString += `<div><p>Incident Number: ${item.incidentnumber}</p></div>`;
                    }
                    if(item.incidentdate) {
                        contentString += `<div><p>Incident Date: ${item.incidentdate}</p></div>`;
                    }
                    if(item.reportdate) {
                        contentString += `<div><p>Report Date: ${item.reportdate}</p></div>`;
                    }
                    if(item.contaminant) {
                        contentString += `<div><p>Contaminant: ${item.contaminant.split(",").map((item) => contDict[item]).join(", ")}</p></div>`;
                    }
                    if(item.estimatedquantity) {
                        contentString += `<div><p>Estimated Quantity: ${item.estimatedquantity}</p></div>`;
                    }
                    if(item.quantityrecovered) {
                        contentString += `<div><p>Quantity Recovered: ${item.quantityrecovered}</p></div>`;
                    }
                    if(item.typeoffacility) {
                        contentString += `<div><p>Type of Facility: ${item.typeoffacility.split(",").map((item) => facilityDict[item]).join(", ")}</p></div>`;
                    }
                    if(item.cause) {
                        contentString += `<div><p>Cause: ${item.cause.split(",").map((item) => causeDict[item]).join(", ")}</p></div>`;
                    }
                    if(item.initialcontainmentmeasures) {
                        contentString += `<div><p>Initial Containment Measures: ${item.initialcontainmentmeasures.split(",").map((item) => initContMesDict[item]).join(", ")}</p></div>`;
                    }
                    if(item.sitelocationname) {
                        contentString += `<div><p>Site Location Name: ${item.sitelocationname}</p></div>`;
                    }
                    if(item.latitude) {
                        contentString += `<div><p>Latitude: ${item.latitude}</p></div>`;
                    }
                    if(item.longitude) {
                        contentString += `<div><p>Longitude: ${item.longitude}</p></div>`;
                    }
                    if(item.lga) {
                        contentString += `<div><p>LGA: ${item.lga}</p></div>`;
                    }
                    if(item.spillareahabitat) {
                        contentString += `<div><p>Spill Area Habitat: ${item.spillareahabitat.split(",").map((item) => habitatDict[item]).join(", ")}</p></div>`;
                    }
                    if(item.descriptionofimpact) {
                        contentString += `<div><p>Description of Impact: ${item.descriptionofimpact}</p></div>`;
                    }
                    if(item.statesaffected) {
                        contentString += `<div><p>States Affected: ${item.statesaffected.split(",").map((item) => statesDict[item]).join(", ")}</p></div>`;
                    }
                    if(item.jivdate) {
                        contentString += `<div><p>JIV Date: ${item.jivdate}</p></div>`;
                    }
                    if(item.jivpresent) {
                        contentString += `<div><p>JIV Present: ${item.jivpresent}</p></div>`;
                    }
                    if(item.cleanupdate) {
                        contentString += `<div><p>Cleanup Date: ${item.cleanupdate}</p></div>`;
                    }
                    if(item.cleanupcompleteddate) {
                        contentString += `<div><p>Cleanup Completed Date: ${item.cleanupcompleteddate}</p></div>`;
                    }
                    if(item.cleanupmethods) {
                        contentString += `<div><p>Cleanup Methods: ${item.cleanupmethods}</p></div>`;
                    }
                    if(item.postcleanupinspectiondate) {
                        contentString += `<div><p>Post Cleanup Inspection Date: ${item.postcleanupinspectiondate}</p></div>`;
                    }
                    if(item.lastupdatedby) {
                        contentString += `<div><p>Last Updated By: ${item.lastupdatedby}</p></div>`;
                    }
                    // TODO: JIV attachments.


                    const infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        // ariaLabel: "Uluru",
                    });
        
                    marker.addListener("click", () => {
                        infowindow.open({
                            anchor: marker,
                            map,
                        });
                    });

                    // if (item.estimatedspillarea && !isNaN(Number(item.estimatedspillarea))) {
                    //     const cityCircle = new google.maps.Circle({
                    //         strokeColor: "#FF0000",
                    //         strokeOpacity: 0.8,
                    //         strokeWeight: 2,
                    //         fillColor: "#FF0000",
                    //         fillOpacity: 0.35,
                    //         map: savedMap,
                    //         center: position,
                    //         radius: Math.sqrt(Number(item.estimatedspillarea * 1000000)/3.14),
                    //     });
                    //     console.log(Math.sqrt(Number(item.estimatedspillarea * 1000000)/3.14), position)
                    // }

                    //TODO: save these into a list


                }
            });

        }
    }, [savedMap, Data, MarkerLibrary, Google]);

    return (
        <div id="right-panel">
            Map is Loading ...
        </div>
    );
}