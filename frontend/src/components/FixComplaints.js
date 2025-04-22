import * as React from 'react';
import Sidebar from './Sidebar';
import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { updateComplaints, fetchComplaints, fetchComplaintsByOwner } from './ServerRequests.js';

function FixComplaints() {
    const [data, setData] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedComplaint, setSelectedComplaint] = React.useState(null);
    const [comment, setComment] = React.useState('');
    const [status, setStatus] = React.useState('');
    const [estimatedDate, setEstimatedDate] = React.useState('');

    const role = (localStorage.getItem('role')); 
    const userId = (localStorage.getItem('userId')); 

    React.useEffect(() => {
        const getComplaints = async () => {
            let response;
            if (role === 'owner') {
                response = await fetchComplaintsByOwner(userId);
            } else {
                response = await fetchComplaints(); // Admin fetches all complaints
            }
            setData(response);
        };
        getComplaints();
    }, [role, userId]);

    const handleOpenDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setOpenDialog(true);
        setComment(complaint.commentFromOwner || '');
        setStatus(complaint.status);
        setEstimatedDate(complaint.expectedDateToSolve || '');
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSaveChanges = async () => {
        const updatedComplaints = data.map(complaint =>
            complaint._id === selectedComplaint._id
                ? {
                      ...complaint,
                      commentFromOwner: comment,
                      status: status,
                      expectedDateToSolve: estimatedDate,
                  }
                : complaint
        );

        const payload = {
            expectedDateToSolve: estimatedDate,
            status,
            commentFromOwner: comment,
        };

        await updateComplaints(selectedComplaint._id, payload);
        alert('Updated the complaint successfully');
        setData(updatedComplaints);
        handleCloseDialog();
    };

    const renderComplaintDetails = (complaint) => (
        <div>
            <p>Description: {complaint.complaintDescription}</p>
            <p>Status: {complaint.status}</p>
            <p>Issue Raised: {complaint.raisedTime}</p>
            <p>
                Raised By: {complaint.raisedByName} ({complaint.raisedByEmail})
            </p>
            {role === 'owner' && (
                <p>
                    Apartment: {complaint.aptNumber}, Flat: {complaint.flatNumber}
                </p>
            )}
            {role === 'owner' && <Button onClick={() => handleOpenDialog(complaint)}>Edit</Button>}
        </div>
    );

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName={role === 'admin' ? 'Admin' : 'Owner'} />
            <div style={styles.mainContent}>
                <h2>Fix Complaints</h2>
                <div>
                    <h3>Open Complaints:</h3>
                    {data && data.filter(c => c.status !== 'Resolved').length === 0 && (
                        <h4>There are No Open Complaints Right now.</h4>
                    )}
                    {data &&
                        data.filter(c => c.status !== 'Resolved').map((complaint, index) => (
                            <Accordion key={index}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <h4>{complaint.complaintTitle}</h4>
                                </AccordionSummary>
                                <AccordionDetails>{renderComplaintDetails(complaint)}</AccordionDetails>
                            </Accordion>
                        ))}
                </div>

                <div>
                    <h3>Closed Complaints:</h3>
                    {data && data.filter(c => c.status === 'Resolved').length === 0 && (
                        <h4>There are no Closed Complaints Right now.</h4>
                    )}
                    {data &&
                        data.filter(c => c.status === 'Resolved').map((complaint, index) => (
                            <Accordion key={index}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <h4>{complaint.complaintTitle}</h4>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <p>Description: {complaint.complaintDescription}</p>
                                    <p>Status: {complaint.status}</p>
                                    <p>Issue Raised: {complaint.raisedTime}</p>
                                    <p>Issue Solved: {complaint.expectedDateToSolve}</p>
                                    <p>Comment: {complaint.commentFromOwner}</p>
                                    <p>
                                        Raised By: {complaint.raisedByName} ({complaint.raisedByEmail})
                                    </p>
                                    {role === 'owner' && (
                                        <p>
                                            Apartment: {complaint.aptNumber}, Flat: {complaint.flatNumber}
                                        </p>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                </div>

                {/* Dialog Box */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Complaint</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Edit the comment, status, and estimated date for the complaint.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="comment"
                            label="Comment"
                            type="text"
                            fullWidth
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <FormControl fullWidth sx={{ marginTop: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <Select value={status} onChange={e => setStatus(e.target.value)}>
                                <MenuItem value="Received">Received</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Resolved">Resolved</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="estimatedDate"
                            label="Estimated Date to Solve"
                            type="date"
                            fullWidth
                            value={estimatedDate}
                            onChange={e => setEstimatedDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveChanges} color="primary">
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

const styles = {
    mainContent: {
        flex: 1,
        marginLeft: '200px',
        padding: '32px',
    },
};

export default FixComplaints;
