import * as React from 'react';
import Sidebar from './Sidebar';
import LeaseOptions from './LeaseOptions';
import FilterBox from './FilterBox';

import {fetchAvailableApartments} from './ServerRequests'; 

import leaseOptions from './../components-data/LeaseOptionsData';

const filterBoxStyle = {
    marginTop : "24px"
}

 function HomePage(){

    const [dataCopy, setDataCopy] = React.useState([]);

    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchAvailableApartments();
                console.log("Got the following response:");
                console.log(response);
                setData(response);
                setDataCopy(response);
                console.log("After setting data : ");
                console.log(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        fetchData();

    }, []);

    React.useEffect(() => {
        console.log("Data Updated : ",data);
    }, [data]);

    const [filterDate, setFilterDate] = React.useState(null)
    const [filterType, setFilterType] = React.useState(null)

    const updateFilter = (date, type)=>{
        const filteredData = dataCopy.filter(item => {
            const itemDate = new Date(item['availableFrom']).getTime();
            const filterDateTime = new Date(date).getTime();
            return itemDate >= filterDateTime && item['bedrooms'] === type;
        });
        setData(filteredData);
        setFilterDate(date);
        setFilterType(type);
    }

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Chakradhar"/>
            <div style={ styles.mainContent}>
                <FilterBox updateFilter={updateFilter}  style={filterBoxStyle}/>
                <LeaseOptions date={filterDate} type={filterType} fromPage={"Home"} arr={data}/>
            </div>
        </div>
    )
}

const styles = {
    mainContent : {
        flex : 1,
        marginLeft : '200px'
    }
}

export default HomePage;