import React, { useEffect, useState, useContext } from "react";
import { Loader } from "@googlemaps/js-api-loader"
import { DataContext } from "../contexts/DataContext";
import {contDict, stausDict, zonalOfficeDict, companyDict, facilityDict, causeDict, initContMesDict, habitatDict, statesDict} from "../utils/dictionaries";

export const Map = () => {
    let map;
    const [SrcData, setSrcData, Data, setData] = useContext(DataContext);
    const [savedMap, setSavedMap] = useState(null);

    const [MapsLibrary, setMapsLibrary] = useState(null);
    const [MarkerLibrary, setMarkerLibrary] = useState(null);
    const [Google, setGoogle] = useState(null);
    const [Markers, setMarkers] = useState([]);

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

            // remove all the markers from the map
            Markers.forEach((item) => {
                item.setMap(null);
            });
            // clear the markers array
            setMarkers([]);
            
            // mark the points on the map
            filteredData.forEach((item) => {
                if (!isNaN(Number(item.latitude)) && !isNaN(Number(item.longitude))) {
                    const position = { lat: Number(item.latitude), lng: Number(item.longitude) };
                    const marker = new AdvancedMarkerElement({
                        map: savedMap,
                        position: position,
                        // title: item.incidentnumber,
                    });

                    setMarkers((prev) => [...prev, marker]);

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