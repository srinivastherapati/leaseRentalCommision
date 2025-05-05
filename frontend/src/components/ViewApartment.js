import * as React from 'react';

import Sidebar from './Sidebar';
import {Paper, Button, TextField} from '@mui/material';
import Carousel from './Carousel';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import {useParams} from 'react-router-dom';
import {fetchApartmentDetails, submitLeaseApplication, fetchOwnerApartments} from './ServerRequests';

function ViewApartment() {
    const {id} = useParams();
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');

    const [data,
        setData] = React.useState(null);
    const [open,
        setOpen] = React.useState(false);
   
    const [error,
        setError] = React.useState(false);
        const [formData, setFormData] = React.useState({
          ssn: '',
          yoe: '',
          companyName: '',
          position: '',
          income: '',
          officeNumber: '',
          people: ''
        });
        
       
        
      
        
        const formatSSN = (value) => {
          const digits = value.replace(/\D/g, ''); // remove non-digits
          let formatted = digits;
      
          if (digits.length > 3 && digits.length <= 5) {
              formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
          } else if (digits.length > 5) {
              formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
          }
      
          return formatted;
      };
      

      const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "ssn") {
            const formatted = formatSSN(value);
            const isValid = /^\d{3}-\d{2}-\d{4}$/.test(formatted);
            setError(!isValid && formatted.length === 11); // show error only if full length but invalid
            setFormData((prev) => ({ ...prev, ssn: formatted }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    

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

    const submitLease = async(payload) => {
        const response = await submitLeaseApplication(userId, payload);
        alert(response.message);
    };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Chakradhar"/>
            <div className="dflex jc-around" style={styles.mainContent}>
                {data !== null && (
                    <Paper
                        elevation={5}
                        sx={{
                        width: '80%',
                        padding: '32px'
                    }}>
                        <Carousel images={data.images}/>
                        <h2>
                            Apartment {data.apartmentNumber}
                            - {data.flatNumber}
                        </h2>
                        <p>Price: $ {data.pricePerMonth}/month</p>
                        <p>Bedrooms: {data.bedrooms}
                            | Bathrooms: {data.bathrooms}</p>
                        <p>Description: {data.description}</p>

                        <p>
                            Address: {data.apartmentNumber}-{data.flatNumber},
                            <br/> {data.address.lane},
                            <br/> {data.address.city}, {data.address.state}
                            <br/> {data.address.zip}
                        </p>
                        <p>Owner Name: {data.ownerId
                                ?.ownerName}</p>
                        <p>Owner Contact: {data.ownerId
                                ?.ownerContact}</p>

                        <div className="w100 tcenter dflex jc-around">
                            <Button
                                variant="outlined"
                                onClick={handleClickOpen}
                                disabled={userRole === 'owner' || userRole === 'admin'}>
                                Apply Now!
                            </Button>

                            <Dialog
  open={open}
  onClose={handleClose}
  PaperProps={{
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();

      const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
      if (!ssnRegex.test(formData.ssn)) {
        setError(true);
        return;
      }
      setError(false);

      const payload = {
        apartmentDetailsId: data._id,
        ssn: formData.ssn,
        yearsOfExperience: formData.yoe,
        companyName: formData.companyName,
        position: formData.position,
        income: formData.income,
        officeNumber: formData.officeNumber,
      
      };

      submitLease(payload);
      handleClose();
    }
  }}
>
  <DialogTitle>Enter Your Details</DialogTitle>
  <DialogContent>
    <TextField
      required
      margin="dense"
      name="ssn"
      label="Enter SSN"
      fullWidth
      variant="standard"
      value={formData.ssn}
      onChange={handleChange}
      error={error}
      helperText={error ? "Enter a valid SSN (e.g., 123-45-6789)" : ""}
    />
    <TextField
      required
      margin="dense"
      name="yoe"
      label="Years of Experience"
      fullWidth
      variant="standard"
      value={formData.yoe}
      onChange={handleChange}
    />
    <TextField
      required
      margin="dense"
      name="companyName"
      label="Company Name"
      fullWidth
      variant="standard"
      value={formData.companyName}
      onChange={handleChange}
    />
    <TextField
      required
      margin="dense"
      name="position"
      label="Position at work"
      fullWidth
      variant="standard"
      value={formData.position}
      onChange={handleChange}
    />
    <TextField
      required
      margin="dense"
      name="income"
      label="Income"
      fullWidth
      variant="standard"
      value={formData.income}
      onChange={handleChange}
    />
    <TextField
      required
      margin="dense"
      name="officeNumber"
      label="Office Number"
      fullWidth
      variant="standard"
      value={formData.officeNumber}
      onChange={handleChange}
    />
    <TextField
      required
      margin="dense"
      name="people"
      label="No. of People"
      fullWidth
      variant="standard"
      value={formData.people}
      onChange={handleChange}
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
        padding: '30px'
    }
};

export default ViewApartment;
