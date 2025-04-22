import * as React from 'react';

import Header from './Header';
import Footer from './Footer';
import LeaseOptions from './LeaseOptions'

import FilterBox from './FilterBox'

import {fetchAvailableApartments} from './ServerRequests'; 

import leaseOptions from './../components-data/LeaseOptionsData';

const headingStyle = {
    fontSize : "64px",
    width : "45%",
    textAlign : "left",
    marginTop : "160px",
    marginLeft : "32px",
    fontWeight : "600"
} 

const searchBoxStyle = {
    position : 'absolute',
    top : '106%',
    left : '30%',
}

function MainPage(){

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
        <div>
            <div className="landing-page">
                <Header hasLoginBtn={true}/>
                <div className="dflex">
                    <h1 className="color--white" style={ headingStyle }>
                        Welcome to Your Dream Home : Find Your Perfect Rental
                    </h1>
                </div>
            </div>
            <FilterBox updateFilter={updateFilter} style={searchBoxStyle}/>
                <LeaseOptions date={filterDate} type={filterType} fromPage={"Main"} arr={data}/>
            <Footer/>
        </div>
    )
}


export default MainPage;