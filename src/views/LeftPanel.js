import React, { useContext } from "react";
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
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

export const LeftPanel = () => {
    const theme = useTheme();
    const [SrcData, setSrcData, Data, setData] = useContext(DataContext);

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

    const VolumeCalculator = (Data) => {
        let volume = 0;
        for (let i = 0; i < Data.length; i++) {
            if(Data[i].estimatedquantity && isNaN(Number(Data[i].estimatedquantity)) === false)
                volume += Number(Data[i].estimatedquantity);
        }
        return volume;
    }

    const CompanyCalculator = (Data) => {
        let company = {};
        for (let i = 0; i < Data.length; i++) {
            if(Data[i].company && company[Data[i].company] === undefined)
                company[Data[i].company] = 1;
            else if(Data[i].company && company[Data[i].company] !== undefined)
                company[Data[i].company] += 1;
        }

        let max = 0;
        let maxCompany = "";
        for (const [key, value] of Object.entries(company)) {
            if(value > max) {
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
            if(Data[i].company && company[Data[i].company] === undefined)
                company[Data[i].company] = 1;
            else if(Data[i].company && company[Data[i].company] !== undefined)
                company[Data[i].company] += 1;
        }

        // sort the company object according to values in descending order
        const sorted = Object.fromEntries(
            Object.entries(company).sort(([,a],[,b]) => b-a)
        );

        // get the top three companies
        let topThree = {};
        let count = 0;
        let remaining = 0;
        for (const [key, value] of Object.entries(sorted)) {
            if(count < 3) {
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

        return topThree;
    }

    const TopThreeCauses = (Data) => {
        let causes = {};
        for (let i = 0; i < Data.length; i++) {
            if(Data[i].cause) {
                let causeList = Data[i].cause.split(",");
                for (let j = 0; j < causeList.length; j++) {
                    if(causes[causeList[j]] === undefined)
                        causes[causeList[j]] = 1;
                    else
                        causes[causeList[j]] += 1;
                }
            }
        }

        // sort the causes object according to values in descending order
        const sorted = Object.fromEntries(
            Object.entries(causes).sort(([,a],[,b]) => b-a)
        );

        // get the top three causes
        let topThree = {};
        let count = 0;
        let remaining = 0;
        for (const [key, value] of Object.entries(sorted)) {
            if(count < 3) {
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

        return topThree;
    }

    const TopThreeSpillAreaHabitats = (Data) => {
        // item.spillareahabitat
        let habitats = {};
        for (let i = 0; i < Data.length; i++) {
            if(Data[i].spillareahabitat) {
                let habitatList = Data[i].spillareahabitat.split(",");
                for (let j = 0; j < habitatList.length; j++) {
                    if(habitats[habitatList[j]] === undefined)
                        habitats[habitatList[j]] = 1;
                    else
                        habitats[habitatList[j]] += 1;
                }
            }
        }

        // sort the habitats object according to values in descending order
        const sorted = Object.fromEntries(
            Object.entries(habitats).sort(([,a],[,b]) => b-a)
        );

        // get the top three habitats
        let topThree = {};
        let count = 0;
        let remaining = 0;
        for (const [key, value] of Object.entries(sorted)) {
            if(count < 3) {
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

        return topThree;

    }

    const OilSpillVolumeMonthWise = (Data) => {
        let volume = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0 ,8:0, 9:0, 10:0, 11:0, 12:0};
        for (let i = 0; i < Data.length; i++) {
            if(Data[i].estimatedquantity && isNaN(Number(Data[i].estimatedquantity)) === false) {
                let month = new Date(Data[i].incidentdate).getMonth();
                if(volume[month] === undefined)
                    volume[month] = Number(Data[i].estimatedquantity);
                else
                    volume[month] += Number(Data[i].estimatedquantity);
            }
        }
        return volume;
    }

    const RecoveredOilSpillVolumeMonthWise = (Data) => {
        let volume = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0 ,8:0, 9:0, 10:0, 11:0, 12:0};
        for (let i = 0; i < Data.length; i++) {
            if(Data[i].quantityrecovered && isNaN(Number(Data[i].quantityrecovered)) === false) {
                let month = new Date(Data[i].incidentdate).getMonth();
                if(volume[month] === undefined)
                    volume[month] = Number(Data[i].quantityrecovered);
                else
                    volume[month] += Number(Data[i].quantityrecovered);
            }
        }
        return volume;
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
                            title="Website Visits"
                            subheader="(+43%) than last year"
                            chartLabels={[
                                '01/01/2003',
                                '02/01/2003',
                                '03/01/2003',
                                '04/01/2003',
                                '05/01/2003',
                                '06/01/2003',
                                '07/01/2003',
                                '08/01/2003',
                                '09/01/2003',
                                '10/01/2003',
                                '11/01/2003',
                            ]}
                            chartData={[
                                {
                                    name: 'Team A',
                                    type: 'column',
                                    fill: 'solid',
                                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                                },
                                {
                                    name: 'Team B',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                                },
                                {
                                    name: 'Team C',
                                    type: 'line',
                                    fill: 'solid',
                                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                                },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentVisits
                            title="Current Visits"
                            chartData={[
                                { label: 'America', value: 4344 },
                                { label: 'Asia', value: 5435 },
                                { label: 'Europe', value: 1443 },
                                { label: 'Africa', value: 4443 },
                            ]}
                            chartColors={[
                                theme.palette.primary.main,
                                theme.palette.info.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppConversionRates
                            title="Conversion Rates"
                            subheader="(+43%) than last year"
                            chartData={[
                                { label: 'Italy', value: 400 },
                                { label: 'Japan', value: 430 },
                                { label: 'China', value: 448 },
                                { label: 'Canada', value: 470 },
                                { label: 'France', value: 540 },
                                { label: 'Germany', value: 580 },
                                { label: 'South Korea', value: 690 },
                                { label: 'Netherlands', value: 1100 },
                                { label: 'United States', value: 1200 },
                                { label: 'United Kingdom', value: 1380 },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentSubject
                            title="Current Subject"
                            chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
                            chartData={[
                                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                            ]}
                            chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                        />
                    </Grid>

                    {/* <Grid item xs={12} md={6} lg={8}>
                        <AppNewsUpdate
                            title="News Update"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: faker.name.jobTitle(),
                                description: faker.name.jobTitle(),
                                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                                postedAt: faker.date.recent(),
                            }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppOrderTimeline
                            title="Order Timeline"
                            list={[...Array(5)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: [
                                    '1983, orders, $4220',
                                    '12 Invoices have been paid',
                                    'Order #37745 from September',
                                    'New order placed #XF-2356',
                                    'New order placed #XF-2346',
                                ][index],
                                type: `order${index + 1}`,
                                time: faker.date.past(),
                            }))}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTrafficBySite
                            title="Traffic by Site"
                            list={[
                                {
                                    name: 'FaceBook',
                                    value: 323234,
                                    icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                                },
                                {
                                    name: 'Google',
                                    value: 341212,
                                    icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                                },
                                {
                                    name: 'Linkedin',
                                    value: 411213,
                                    icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                                },
                                {
                                    name: 'Twitter',
                                    value: 443232,
                                    icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                                },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppTasks
                            title="Tasks"
                            list={[
                                { id: '1', label: 'Create FireStone Logo' },
                                { id: '2', label: 'Add SCSS and JS files if required' },
                                { id: '3', label: 'Stakeholder Meeting' },
                                { id: '4', label: 'Scoping & Estimations' },
                                { id: '5', label: 'Sprint Showcase' },
                            ]}
                        />
                    </Grid> */}
                </Grid> : <p>Loading...</p>}
            </Container>
        </div>
    );
}