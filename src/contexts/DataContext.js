import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = (props) => {
    const [SrcData, setSrcData] = useState(null);
    const [Data, setData] = useState(null);

    const fetchData = () => {
        fetch('https://oilspillmonitor.ng/api/spill-data.php?dataset=nosdra&format=json') // Replace with the correct relative path or URL
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setSrcData(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={[SrcData, setSrcData, Data, setData]}>
        {props.children}
        </DataContext.Provider>
    )

}