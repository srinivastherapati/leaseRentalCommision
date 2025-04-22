import Sidebar from './Sidebar';
import {Paper, Button } from '@mui/material'
import LinearProgress from '@mui/joy/LinearProgress';


function Docs(){
    
    const hasApplied = true;

    const payments = {
        Advance: [1000, "Paid"],
        CarParking: [50, "Paid"],
        CleaningFee: [120, "Paid"],
        WaterBill: [30, "Not Paid"],
        ElectricityBill: [30, "Not Paid"],
        MaintenanceFee: [80, "Paid"],
        // Add more payment types as needed
    };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Chakradhar"/>
            <div className="dflex jc-around" style={ styles.mainContent}>
               
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

export default Docs;