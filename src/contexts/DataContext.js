import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = (props) => {
  const [SrcData, setSrcData] = useState(null);
  const [Data, setData] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});

  const fetchData = () => {
    fetch('https://oilspillmonitor.ng/api/spill-data.php?dataset=nosdra&format=json') // Replace with the correct relative path or URL
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((jsonData) => {
        setSrcData(jsonData);
        const srcData = jsonData.filter((item) => new Date(item.incidentdate).getFullYear() === 2022);
        setData(srcData);
        setFilterOptions({
          years: [...new Set(jsonData.map((item) => new Date(item.incidentdate).getFullYear()))],
          // habitats: [...new Set(jsonData.map((item) => item.spillareahabitat))],
          // split spillarea habitat on comma and get unique values only if it is defined
          habitats: [...new Set(jsonData.map((item) => item.spillareahabitat).filter((item) => item).map((item) => item.split(',')).flat())],
          // do the same for causes
          causes: [...new Set(jsonData.map((item) => item.cause).filter((item) => item).map((item) => item.split(',')).flat())],
          companies: [...new Set(jsonData.map((item) => item.company).filter((item) => item))],
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={[SrcData, setSrcData, Data, setData, filterOptions, setFilterOptions]}>
      {props.children}
    </DataContext.Provider>
  )

}