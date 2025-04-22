import Sidebar from './Sidebar';
import {Paper, Button } from '@mui/material'
import LinearProgress from '@mui/joy/LinearProgress';
import  React  from 'react';

import { getStatus } from './ServerRequests';

function Status(){

    const handleApply = function(){
        window.location.href = '/home'
    }

    const [data, setData] = React.useState('');

    React.useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        getStatus(userId).then(data => {
            setData(data);
        }).catch(error => console.error('Failed to fetch status :', error));
    }, []);

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Chakradhar"/>
            <div className="dflex jc-around" style={ styles.mainContent}>
                <Paper elevation={5} sx={{width : "80%", padding : "32px"}}>
                    { !data['hasApplied']  ? 
                        <div className="w100 tcenter">
                            <h3> You have not applied to any Apartments.  </h3>
                        </div>

                        : 
                        //Conditional Rendering
                        <div>
                            <div className="dflex jc-around w100">
                                <img src="https://atlas-content-cdn.pixelsquid.com/assets_v2/158/1581395264726373462/jpeg-600/G03.jpg" width="400px" height="300px"></img>
                            </div>
                            <h4> Status : {data.status} </h4>
                            <LinearProgress
                                color={data.status!="Rejected" ? "primary" : "danger"}
                                determinate={true}
                                size="lg"
                                value={ data.progress}
                                variant="solid"
                            />

                            {/* Displaying more information incase of the rejection  */}
    
                            { data.status == "Rejected" && 
                            
                                <p> Additional Info : {data.additionalInfo} </p>
                            }

                            <h4> Application Details : </h4>
                            <p> Apartment Number : {data.apartmentDetails.apartmentNumber} </p>
                            <p> Flat Number : { data.apartmentDetails.flatNumber } </p>
                            <p> Owner Name : { data.apartmentDetails.ownerName} </p>
                            <p> Owner Contact : {data.apartmentDetails.ownerContact}</p>
                            {/* <div className="dflex">
                                <Button variant="outlined" > View Apartment Details </Button>
                            </div> */}
                            <Button variant="outlined" onClick={ handleApply }> Apply to Other Apartments</Button>
                        </div>
                    }
                </Paper>
            </div>
        </div>
    )
}

const styles = {
    mainContent : {
        flex : 1,
        marginLeft : '200px',
        padding : '30px'
    }
}

export default Status;