import * as React from 'react';

import Sidebar from './Sidebar';
import { Paper, Button, TextField } from '@mui/material';
import Carousel from './Carousel';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useParams } from 'react-router-dom';
import { fetchApartmentDetails, submitLeaseApplication, fetchOwnerApartments } from './ServerRequests';

function ViewApartment() {
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');

  const [data, setData] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchDetails() {
      try {
        if (userRole === 'owner') {
          const ownerData = await fetchOwnerApartments(userId);
          const selectedApartment = ownerData.find((apt) => apt._id === id);
          setData(selectedApartment);
        } else {
          const response = await fetchApartmentDetails(id);
          setData(response);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchDetails();
  }, [id, userRole, userId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitLease = async (payload) => {
    const response = await submitLeaseApplication(userId, payload);
    alert(response.message);
  };

  return (
    <div className="dflex ai-stretch">
      <Sidebar userName="Chakradhar" />
      <div className="dflex jc-around" style={styles.mainContent}>
        {data !== null && (
          <Paper elevation={5} sx={{ width: '80%', padding: '32px' }}>
            <Carousel images={data.images} />
            <h2>
              Apartment {data.apartmentNumber} - {data.flatNumber}
            </h2>
            <p>Price: $ {data.pricePerMonth}/month</p>
            <p>Bedrooms: {data.bedrooms} | Bathrooms: {data.bathrooms}</p>
            <p>Description: {data.description}</p>

            <p>
              Address: {data.apartmentNumber}-{data.flatNumber}, <br />
              {data.address.lane}, <br />
              {data.address.city}, {data.address.state} <br />
              {data.address.zip}
            </p>
            <p>Owner Name: {data.ownerName}</p>
            <p>Owner Contact: {data.ownerContact}</p>

            <div className="w100 tcenter dflex jc-around">
              <Button
                variant="outlined"
                onClick={handleClickOpen}
                disabled={userRole === 'owner' || userRole === 'admin'}
              >
                Apply Now!
              </Button>

              <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                  component: 'form',
                  onSubmit: (event) => {
                    event.preventDefault();
                    const payload = {
                      apartmentDetailsId: data._id,
                    };
                    submitLease(payload);
                    handleClose();
                  },
                }}
              >
                <DialogTitle>Enter Your Details</DialogTitle>
                <DialogContent>
                  <TextField required margin="dense" name="fullname" label="Full Name" fullWidth variant="standard" />
                  <TextField required margin="dense" name="email" label="Email" fullWidth variant="standard" />
                  <TextField required margin="dense" name="income" label="Income" fullWidth variant="standard" />
                  <TextField required margin="dense" name="people" label="No. of People" fullWidth variant="standard" />
                  <TextField
                    required
                    margin="dense"
                    name="current-addr"
                    label="Current Address"
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </DialogActions>
              </Dialog>
            </div>
          </Paper>
        )}
      </div>
    </div>
  );
}

const styles = {
  mainContent: {
    flex: 1,
    marginLeft: '200px',
    padding: '30px',
  },
};

export default ViewApartment;
