import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = (props) => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {
        const response = await fetch('../assets/OilSpillData.json');
        const data = await response.json();
        // console.log(data[0]);
        setData(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={[Data, setData]}>
        {props.children}
        </DataContext.Provider>
    )

}