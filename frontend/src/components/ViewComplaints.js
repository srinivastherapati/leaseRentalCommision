import * as React from 'react';
import Sidebar from './Sidebar';
import data from './../components-data/ComplaintsData'

import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function FixComplaints() {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedComplaint, setSelectedComplaint] = React.useState(null);
    const [comment, setComment] = React.useState('');
    const [status, setStatus] = React.useState('');

    const handleOpenDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setOpenDialog(true);
        setComment(complaint.commentFromOwner);
        setStatus(complaint.complaintStatus);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSaveChanges = () => {
        // Update comment and status for the selected complaint
        const updatedComplaints = data.previousComplaints.map(complaint => {
            if (complaint.complaintNumber === selectedComplaint.complaintNumber) {
                return {
                    ...complaint,
                    commentFromOwner: comment,
                    complaintStatus: status
                };
            }
            return complaint;
        });
        data.previousComplaints = updatedComplaints;
        handleCloseDialog();
    };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Admin" />
            <div style={styles.mainContent}>
                <h2>Fix Complaints</h2>
                {data.previousComplaints.map((complaint, index) => (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <h3>{complaint.complaintTitle}</h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <p>Description: {complaint.complaintDescription}</p>
                                <p>Status: {complaint.complaintStatus}</p>
                                <p>Issue Raised: {complaint.complaintDateTime}</p>
                                {complaint.complaintStatus !== 'Resolved' && (
                                    <div>
                                        <Button onClick={() => handleOpenDialog(complaint)}>Edit</Button>
                                    </div>
                                )}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Complaint</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Edit the comment and status for the complaint.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="comment"
                            label="Comment"
                            type="text"
                            fullWidth
                            value={comment}
                            onChange={handleCommentChange}
                        />
                        <TextField
                            margin="dense"
                            id="status"
                            label="Status"
                            type="text"
                            fullWidth
                            value={status}
                            onChange={handleStatusChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
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
        padding: '32px'
    }
};

export default FixComplaints;
