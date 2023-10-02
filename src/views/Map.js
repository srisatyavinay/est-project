import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader"

export const Map = () => {
    let map;
    const [savedMap, setSavedMap] = useState(null);

    useEffect(() => {
        const additionalOptions = {};
        const position = { lat: -25.344, lng: 131.031 };

        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            version: "weekly",
            ...additionalOptions,
        });

        const citymap = {
            chicago: {
                center: { lat: -25.344, lng: 136.031 },
                population: 2714856,
            },
            newyork: {
                center: { lat: 40.714, lng: -74.005 },
                population: 8405837,
            },
            losangeles: {
                center: { lat: 34.052, lng: -118.243 },
                population: 3857799,
            },
            vancouver: {
                center: { lat: 49.25, lng: -123.1 },
                population: 603502,
            },
        };

        const contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
            '<div id="bodyContent">' +
            "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
            "sandstone rock formation in the southern part of the " +
            "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
            "south west of the nearest large town, Alice Springs; 450&#160;km " +
            "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
            "features of the Uluru - Kata Tjuta National Park. Uluru is " +
            "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
            "Aboriginal people of the area. It has many springs, waterholes, " +
            "rock caves and ancient paintings. Uluru is listed as a World " +
            "Heritage Site.</p>" +
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
            "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
            "(last visited June 22, 2009).</p>" +
            "</div>" +
            "</div>";

        const func = async () => {
            const google = await loader.load();
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

            map = new Map(document.getElementById("right-panel"), {
                zoom: 4,
                center: position,
                mapId: "DEMO_MAP_ID",
                mapTypeId: 'hybrid'
            });

            setSavedMap(map);

            const marker = new AdvancedMarkerElement({
                map: map,
                position: position,
                title: "Uluru",
            });

            const infowindow = new google.maps.InfoWindow({
                content: contentString,
                ariaLabel: "Uluru",
            });

            marker.addListener("click", () => {
                infowindow.open({
                    anchor: marker,
                    map,
                });
            });

            for (const city in citymap) {
                const cityCircle = new google.maps.Circle({
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                    map,
                    center: citymap[city].center,
                    radius: Math.sqrt(citymap[city].population) * 100,
                });
            }
        }
        func();
    }, []);

    return (
        <div id="right-panel">
            Map
        </div>
    );
}