import React, { useContext, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Autocomplete, TextField, Button } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
    AppTasks,
    AppNewsUpdate,
    AppOrderTimeline,
    AppCurrentVisits,
    AppWebsiteVisits,
    AppTrafficBySite,
    AppWidgetSummary,
    AppCurrentSubject,
    AppConversionRates,
} from '../sections/@dashboard/app';
import { DataContext } from "../contexts/DataContext";
import { contDict, stausDict, zonalOfficeDict, companyDict, facilityDict, causeDict, initContMesDict, habitatDict, statesDict } from "../utils/dictionaries";

export const LeftPanel = () => {
    const theme = useTheme();
    const [SrcData, setSrcData, Data, setData, filterOptions, setFilterOptions] = useContext(DataContext);
    const [filterCriteria, setFilterCriteria] = React.useState({});

    // const filterOptions = {
    //     years: [...new Set(SrcData.map((item) => new Date(item.incidentdate).getFullYear()))],
    //     habitats: [...new Set(SrcData.map((item) => item.spillareahabitat))],
    //     companies: [...new Set(SrcData.map((item) => item.company))],
    //     causes: [...new Set(SrcData.map((item) => item.cause))],
    // };

    useEffect(() => {
        if (filterOptions) {
            console.log(filterOptions);
        }
    }, [filterOptions]);


    const handleFilterChange = (event, name, value) => {
        setFilterCriteria({ ...filterCriteria, [name]: value });
    };

    const handleApplyFilters = () => {
        applyFilters(filterCriteria);
    };

    const applyFilters = (criteria) => {
        setFilterCriteria(criteria);

        const filteredIncidents = SrcData.filter((incident) => {
            // Check if each incident meets all filter criteria
            for (const key in criteria) {

                // if (criteria[key] && !criteria[key].includes(incident[key])) {
                //     return false;
                // }

                // If year key is undefined or it is empty then filter by 2022 year
                if (key === 'year' && (!criteria[key] || criteria[key].length === 0)) {
                    if (new Date(incident.incidentdate).getFullYear() !== 2022) {
                        return false;
                    }
                }

                // If some key has an empty list, then ignore that key
                if (criteria[key] && criteria[key].length === 0) {  
                    continue;
                }

                // If key is year, check if the incident year is in the selected years
                if (key === 'year') {
                    if (criteria[key] && !criteria[key].includes(new Date(incident.incidentdate).getFullYear())) {
                        return false;
                    }
                }

                // If key is habitat, check if the incident habitat is in the selected habitats. For incident habitat, split the string by comma and check if any of the habitats is in the selected habitats. Even if one of it exists it is fine.
                if (key === 'habitat') {
                    // if (criteria[key] && !criteria[key].some((habitat) => incident.spillareahabitat.split(",").some((item) => item === habitat))) {
                    //     return false;
                    // }
                    // Do not filter if habitat is undefined
                    if (criteria[key] && !criteria[key].some((habitat) => incident.spillareahabitat && incident.spillareahabitat.split(",").some((item) => item === habitat))) {
                        return false;
                    }
                }

                // If key is cause, check if the incident cause is in the selected causes. For incident cause, split the string by comma and check if any of the causes is in the selected causes. Even if one of it exists it is fine.
                if (key === 'cause') {
                    // if (criteria[key] && !criteria[key].some((cause) => incident.cause.split(",").some((item) => item === cause))) {
                    //     return false;
                    // }

                    // Do not filter if cause is undefined
                    if (criteria[key] && !criteria[key].some((cause) => incident.cause && incident.cause.split(",").some((item) => item === cause))) {
                        return false;
                    }
                }

                // If key is company, just check if the incident company is in the selected companies
                if (key === 'company') {
                    if (criteria[key] && !criteria[key].includes(incident.company)) {
                        return false;
                    }
                }
            }
            return true; // Include the incident if it meets all criteria
        });

        setData(filteredIncidents);
    };

    const VolumeCalculator = (Data) => {
        let volume = 0;
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].estimatedquantity && isNaN(Number(Data[i].estimatedquantity)) === false)
                volume += Number(Data[i].estimatedquantity);
        }
        return volume;
    }

    const CompanyCalculator = (Data) => {
        let company = {};
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].company && company[Data[i].company] === undefined)
                company[Data[i].company] = 1;
            else if (Data[i].company && company[Data[i].company] !== undefined)
                company[Data[i].company] += 1;
        }

        let max = 0;
        let maxCompany = "";
        for (const [key, value] of Object.entries(company)) {
            if (value > max) {
                max = value;
                maxCompany = key;
            }
        }
        console.log(company);
        console.log(companyDict[maxCompany]);
        return companyDict[maxCompany];
    }

    const TopThreeCompanies = (Data) => {
        let company = {};
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].company && company[Data[i].company] === undefined)
                company[Data[i].company] = 1;
            else if (Data[i].company && company[Data[i].company] !== undefined)
                company[Data[i].company] += 1;
        }

        // sort the company object according to values in descending order
        const sorted = Object.fromEntries(
            Object.entries(company).sort(([, a], [, b]) => b - a)
        );

        // get the top three companies
        let topThree = {};
        let count = 0;
        let remaining = 0;
        for (const [key, value] of Object.entries(sorted)) {
            if (count < 3) {
                topThree[key] = value;
                count++;
            }
            else {
                remaining += value;
            }
        }
        if (count >= 3) {
            topThree["Others"] = remaining;
        }

        // return topThree;
        // change topThree into the following format {[label: "Company Name", value: 123]}
        let topThreeArray = [];
        for (const [key, value] of Object.entries(topThree)) {
            if (companyDict[key] === undefined)
                topThreeArray.push({ label: key, value: value });
            else
                topThreeArray.push({ label: companyDict[key], value: value });
        }

        return topThreeArray;
    }

    const TopThreeCauses = (Data) => {
        let causes = {};
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].cause) {
                let causeList = Data[i].cause.split(",");
                for (let j = 0; j < causeList.length; j++) {
                    if (causes[causeList[j]] === undefined)
                        causes[causeList[j]] = 1;
                    else
                        causes[causeList[j]] += 1;
                }
            }
        }

        // sort the causes object according to values in descending order
        const sorted = Object.fromEntries(
            Object.entries(causes).sort(([, a], [, b]) => b - a)
        );

        // get the top three causes
        let topThree = {};
        let count = 0;
        let remaining = 0;
        for (const [key, value] of Object.entries(sorted)) {
            if (count < 3) {
                topThree[key] = value;
                count++;
            }
            else {
                remaining += value;
            }
        }
        if (count >= 3) {
            topThree["Others"] = remaining;
        }

        // return topThree;
        // change topThree into the following format {[label: "Cause", value: abc]}
        let topThreeArray = [];
        for (const [key, value] of Object.entries(topThree)) {
            if (causeDict[key] === undefined)
                topThreeArray.push({ label: key, value: value });
            else
                topThreeArray.push({ label: causeDict[key], value: value });
        }

        return topThreeArray;
    }

    const TopThreeSpillAreaHabitats = (Data) => {
        // item.spillareahabitat
        let habitats = {};
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].spillareahabitat) {
                let habitatList = Data[i].spillareahabitat.split(",");
                for (let j = 0; j < habitatList.length; j++) {
                    if (habitats[habitatList[j]] === undefined)
                        habitats[habitatList[j]] = 1;
                    else
                        habitats[habitatList[j]] += 1;
                }
            }
        }

        // sort the habitats object according to values in descending order
        const sorted = Object.fromEntries(
            Object.entries(habitats).sort(([, a], [, b]) => b - a)
        );

        // get the top three habitats
        let topThree = {};
        let count = 0;
        let remaining = 0;
        for (const [key, value] of Object.entries(sorted)) {
            if (count < 5) {
                topThree[key] = value;
                count++;
            }
            else {
                remaining += value;
            }
        }
        if (count >= 5) {
            topThree["Others"] = remaining;
        }

        // return topThree;
        // change topThree into the following format {[label: "Company Name", value: 123]}
        let topFiveArray = [];
        for (const [key, value] of Object.entries(topThree)) {
            if (habitatDict[key] === undefined)
                topFiveArray.push({ label: key, value: value });
            else
                topFiveArray.push({ label: habitatDict[key], value: value });
        }

        return topFiveArray;

    }

    const OilSpillVolumeMonthWise = (Data) => {
        let volume = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 };
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].estimatedquantity && isNaN(Number(Data[i].estimatedquantity)) === false) {
                let month = new Date(Data[i].incidentdate).getMonth();
                if (volume[month] === undefined)
                    volume[month] = Number(Data[i].estimatedquantity);
                else
                    volume[month] += Number(Data[i].estimatedquantity);
            }
        }
        console.log(volume);
        // From the values in the volume object, create an array of values with the floor function and convert it into a natural number using parseInt
        console.log(Object.values(volume).map((item) => parseInt(Math.round(item), 10)))
        return Object.values(volume).map((item) => parseInt(Math.round(item).toString(), 10));

    }

    const RecoveredOilSpillVolumeMonthWise = (Data) => {
        let volume = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 };
        for (let i = 0; i < Data.length; i++) {
            if (Data[i].quantityrecovered && isNaN(Number(Data[i].quantityrecovered)) === false) {
                let month = new Date(Data[i].incidentdate).getMonth();
                if (volume[month] === undefined)
                    volume[month] = Number(Data[i].quantityrecovered);
                else
                    volume[month] += Number(Data[i].quantityrecovered);
            }
        }
        return Object.values(volume);
    }

    return (
        <div id="left-panel">
            <Container maxWidth="xl">
                <Typography variant="h3" sx={{ mb: 5 }}>
                    Oil Spill Monitor
                </Typography>

                {Data ? <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Volume of oil spills in barrels(~160l)" total={VolumeCalculator(Data)} number={true} color="error" icon={'openmoji:oil-spill'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="No.of incidents" total={Data.length} number={true} color="info" icon={'carbon:summary-kpi'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Most spills caused by" total={CompanyCalculator(Data)} number={false} color="warning" icon={'mdi:company'} />
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid> */}

                    <Grid item xs={12} md={6} lg={8}>
                        <AppWebsiteVisits
                            title="Oill Spills Graph"
                            chartLabels={[
                                '01/01/2022',
                                '02/01/2022',
                                '03/01/2022',
                                '04/01/2022',
                                '05/01/2022',
                                '06/01/2022',
                                '07/01/2022',
                                '08/01/2022',
                                '09/01/2022',
                                '10/01/2022',
                                '11/01/2022',
                            ]}
                            // TODO: Change Labels (Remove hardcoding)
                            chartData={[
                                {
                                    name: 'Oil Spilled (bbl)',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: OilSpillVolumeMonthWise(Data),
                                },
                                {
                                    name: 'Oil Recovered (bbl)',
                                    type: 'line',
                                    fill: 'solid',
                                    data: RecoveredOilSpillVolumeMonthWise(Data),
                                },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentVisits
                            title="Companies with most spills"
                            chartData={TopThreeCompanies(Data)}
                            chartColors={[
                                theme.palette.error.main,
                                theme.palette.warning.main,
                                theme.palette.primary.main,
                                theme.palette.info.main,
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppConversionRates
                            title="Spill Area Habitats"
                            chartData={TopThreeSpillAreaHabitats(Data)}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentVisits
                            title="Major Spill Causes"
                            chartData={TopThreeCauses(Data)}
                            chartColors={[
                                theme.palette.error.main,
                                theme.palette.warning.main,
                                theme.palette.primary.main,
                                theme.palette.info.main,
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <Autocomplete
                            multiple
                            id="year-filter"
                            options={filterOptions.years}
                            onChange={(event, value) => handleFilterChange(event, 'year', value)}
                            renderInput={(params) => <TextField {...params} label="Year" variant="outlined" />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Autocomplete
                            multiple
                            id="habitat-filter"
                            options={filterOptions.habitats}
                            onChange={(event, value) => handleFilterChange(event, 'habitat', value)}
                            renderInput={(params) => <TextField {...params} label="Habitat" variant="outlined" />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Autocomplete
                            multiple
                            id="company-filter"
                            options={filterOptions?.companies || []}
                            onChange={(event, value) => handleFilterChange(event, 'company', value)}
                            renderInput={(params) => <TextField {...params} label="Company" variant="outlined" />}
                        />

                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Autocomplete
                            multiple
                            id="cause-filter"
                            options={filterOptions.causes}
                            onChange={(event, value) => handleFilterChange(event, 'cause', value)}
                            renderInput={(params) => <TextField {...params} label="Cause" variant="outlined" />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                    </Grid>


                </Grid> : <p>Loading...</p>}
            </Container>
        </div>
    );
}