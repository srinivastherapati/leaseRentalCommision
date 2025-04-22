import * as React from 'react';

import Sidebar from './Sidebar';
import data from './../components-data/ComplaintsData'

import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import { TextField , Paper} from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { addComplaint, fetchUserComplaints} from './ServerRequests'; 


function RegisterComplaint(){

    React.useEffect(() => {
        const userId = localStorage.getItem('userId');  // Replace with actual user ID fetched from authentication context or similar
        fetchUserComplaints(userId).then(response => {
            setData(response);
        }).catch(error => {
            console.error('Error fetching complaints:', error);
            alert('Failed to load complaints');
        });
    }, []);


    const [data, setData] = React.useState(null);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNewComplaint = ( payload ) => {
        var copy = data;
        copy.push(payload);
        setData(copy);

        const userId = localStorage.getItem('userId');
    
        const response = addComplaint( userId, payload);
        if( response.status === 200 ){
            alert("Complaint raised successfully !")
        }
    }

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Chakradhar"/>
            <div style={ styles.mainContent}>
                <div className="w100 dflex jc-around tcenter">
                    <Button onClick={handleClickOpen} variant="outlined"> + Create a New Complaint </Button>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const title = formJson.title;
                            const desc = formJson.description;
                            const dateTime = new Date();
                            const status = "Reported";
                            const payload = {
                                complaintNumber : "133",
                                complaintTitle : title,
                                status : status,
                                raisedTime : String(dateTime),
                                complaintDescription : desc
                            };
                            handleNewComplaint(payload);
                            console.log(data);
                            handleClose();
                        },
                        }}
                    >
                        <DialogTitle>New Complaint</DialogTitle>
                        <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="complaint-title"
                            name="title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="complaint-desc"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            multiline
                            rows={4}
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit"> Submit </Button>
                        </DialogActions>
                    </Dialog>

                </div>
                <h2>
                    Current Complaints :
                </h2>
                
                    { data != null && data.filter(object => object.status !== 'Resolved').map( (object,index)=>(
                        <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                            >
                           <h3> { object.complaintTitle} </h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            
                            Description : { object.complaintDescription}
                            <p> Status : {object.status}</p>
                            <p> Issue Raised : {object.raisedTime} </p>

                        </AccordionDetails>
                      </Accordion>
                    )) 
                    }
                    {
                        data != null && data.filter(object => object.status !== 'Resolved').length==0 &&

                        <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
                            <h4> You don't have any active complaints</h4>
                        </Paper>
                    }
                <h2> Previous Complaints : </h2>
                { data != null && data.filter(object => object.status === "Resolved").map( (object,index)=>(
                        <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                            >
                           <h3> { object.complaintTitle} </h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            
                            Description : { object.complaintDescription}
                            <p> Status : {object.status}</p>
                            <p> Issue Raised : {object.raisedTime}  </p>
                            <p> Issue Solved : {object.expectedDateToSolve} </p>
                            <p> Comment : {object.commentFromOwner}</p>
                        </AccordionDetails>
                      </Accordion>
                    )) 
                }
                {
                    data != null && data.filter(object => object.status == 'Resolved').length==0 &&
                    <Paper elevation={5} sx={{ width: "95%", padding: "32px" }}>
                        <h4> You don't have any resolved complaints</h4>
                    </Paper>
                }
            </div>
        </div>
    )
}

const styles = {
    mainContent : {
        flex : 1,
        marginLeft : '200px',
        padding : '32px'
    }
}

export default RegisterComplaint;