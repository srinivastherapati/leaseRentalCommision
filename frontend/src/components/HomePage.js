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

    const updateFilter = async (date, type) => {
        try {
            const response = await fetchAvailableApartments(date); // pass only date for now
            let filtered = response;
    
            // If type filtering is needed client-side
            if (type) {
                filtered = response.filter(item => item['bedrooms'] === type);
            }
    
            setData(filtered);
            setFilterDate(date);
            setFilterType(type);
        } catch (error) {
            console.error("Error fetching filtered data:", error);
        }
    };
    

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName={localStorage.getItem("fullName")}/>
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