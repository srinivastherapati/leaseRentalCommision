import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

import { createApartment, updateApartment,deleteApartment } from './ServerRequests';

const containerStyle = {
    width: "100%",
    marginTop: "80px"
};

const newAptBtn = {
    width : "100%",
    display : "flex",
    justifyContent : "space-around"
}

function LeaseOptions(props) {

    
    const isAdmin = localStorage.getItem('role')==='owner' ;

    const [openDialog, setOpenDialog] = useState(false);
    const [currentApartment, setCurrentApartment] = useState(null);
    const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
    const [apartments, setApartments] = useState(props.arr);
    
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const isOwner = localStorage.getItem('role') === 'owner';
    
        if (isOwner) {
            const filtered = props.arr.filter(apartment => apartment.ownerId === userId);
            setApartments(filtered);
        } else {
            setApartments(props.arr);
        }
    }, [props.arr]);
    

    const handleOpenDialog = (index, mode) => {
        setDialogMode(mode);
        console.log(apartments)
        setCurrentApartment(apartments[index]);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentApartment(null);
    };


    const handleDelete = async (apartmentId) => {

        try {
            const response = await deleteApartment(apartmentId);
            if (response.status === 200) {
                setApartments(apartments.filter(apartment => apartment.apartmentDetails._id !== apartmentId));
                alert("Apartment deleted successfully");
            } else {
                alert("Error: " + response.message);
            }
        } catch (error) {
            console.error("Failed to delete apartment:", error);
            alert("Failed to delete apartment.");
        }
    };

    const handleApply = (id)=>{
        if( props.fromPage === "Main"){
            window.location.href = '/login';
        }
        else{
            window.location.href = '/apartment/'+id;
        }
    }

    const handleSave = async (apartmentData) => {
        try {
            // Get ownerId from localStorage
            const ownerId = localStorage.getItem('userId'); 
    
            // Attach ownerId to apartmentData
            const dataToSend = { ...apartmentData, ownerId };
    
            const response = dialogMode === 'add' 
                ? await createApartment(dataToSend) 
                : await updateApartment(currentApartment._id, dataToSend);
    
            if (response.status === 201) {
                setApartments(dialogMode === 'add' 
                    ? [response.apartment, ...apartments] 
                    : apartments.map(apartment => 
                        apartment.apartmentDetails._id === currentApartment._id 
                            ? response.apartment 
                            : apartment
                      )
                );
                handleCloseDialog();
            } else {
                alert("Error: " + response.message);
            }
        } catch (error) {
            console.error("Failed to save apartment:", error);
            alert("Failed to save apartment.");
        }
    };
    

    return (
        <div style={containerStyle}>
            <h1 className="tcenter">AVAILABLE LEASES</h1>
            {isAdmin && (
                <div style={newAptBtn}>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog({}, 'add')}>
                        + New Apartment
                    </Button>
                </div>
            )}
            <div className="dflex jc-around ai-center fwrap">
                {apartments!=null && apartments.map((object, i) => (
                    <Paper key={i} elevation={5} sx={{ position: 'relative', display: "flex", flexDirection: "column", textAlign: 'left', margin: '32px', padding: "48px" }}>
                        { isAdmin && (
                            <>
                                <Button style={{ position: 'absolute', top: '10px', left: '10px' }} onClick={() => handleDelete(object.apartmentDetails._id)}>×</Button>
                                <Button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={() => handleOpenDialog(i, 'edit')}>Edit</Button>
                            </>
                        )}
                        <div className="w100 dflex jc-around">
                            <img src={require('./../images/' + 'sample-1.avif')} width="160px" height="160px" alt="Apartment"></img>
                        </div>
                        <p>Apartment Number: {apartments[i]['apartmentNumber']}</p>
                        <p>Flat Number: {apartments[i]['flatNumber']}</p>
                        <p>Bedrooms: {apartments[i]['bedrooms']}</p>
                       
                        <p>Price: $ {apartments[i]['pricePerMonth']}/month</p>
                        <p>Available From: {new Date(apartments[i]['availableFrom']).toLocaleDateString()}</p>
                        <Button style={{ marginBottom: "10px" }} variant="outlined" onClick={() => handleApply(apartments[i]["_id"])}>Apply Now!</Button>
                        <Button variant="outlined"><a href={"mailto:admin@gmail.com?subject=Apartment%20Enquiry&body=Hi%20Team%20I%20want%20to%20know%20about%20Apartment%20" + object['apt-number'] + "%20" + object['flat-number']}>Contact Us</a></Button>
                    </Paper>
                ))}
            </div>
            <ApartmentDialog open={openDialog} mode={dialogMode} apartment={currentApartment} onClose={handleCloseDialog} onSave={handleSave} />
</div>
);
}

export default LeaseOptions;

function ApartmentDialog({ open, onClose, onSave, apartment, mode }) {
    // Initialize form state with empty or existing apartment data
    const [formData, setFormData] = useState({
        'apartmentNumber': '',
        'flatNumber': '',
        'bedrooms': '',
        'bathrooms': '',
        'pricePerMonth': '',
        'description': '',
        'address': '',
        'ownerName': '',
        'ownerContact': '',
        'amenities': '',
        'images': '',
        'availableFrom' : ''
    });

    // Update form data when apartment data changes
    useEffect(() => {
        if (apartment && mode === 'edit') {
            setFormData({
                'apartmentNumber': apartment['apartmentNumber'] || '',
                'flatNumber': apartment['flatNumber'] || '',
                'bedrooms': apartment['bedrooms'] || '',
                'bathrooms': apartment['bathrooms'] || '',
                'pricePerMonth': apartment['pricePerMonth'] || '',
                'description': apartment['description'] || '',
                'address': '',
                'availableFrom' : apartment['availableFrom'],
                'ownerName': apartment['ownerName'] || '',
                'ownerContact': apartment['ownerContact'] || '',
                'amenities': apartment['amenities'] ? apartment['amenities'].join(', ') : '', // Assuming amenities is an array
                'images': apartment['images'] ? apartment['images'].join(', ') : '' // Assuming images is an array
            });
        } else {
            // Reset form when opening for adding new apartment
            setFormData({
                'apartmentNumber': '',
                'flatNumber': '',
                'bedrooms': '',
                'bathrooms': '',
                'pricePerMonth': '',
                'description': '',
                'address': '',
                'availableFrom' : '',
                'ownerName': '',
                'ownerContact': '',
                'amenities': '',
                'images': ''
            });
        }
    }, [apartment, mode]); // React to changes in apartment or mode

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        // Convert amenities and images from comma-separated strings to arrays if needed
        const dataToSave = {
            ...formData,
            amenities: formData.amenities.split(',').map(item => item.trim()),
            images: formData.images.split(',').map(item => item.trim())
        };
        onSave(dataToSave, mode);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{mode === 'add' ? 'Add New Apartment' : 'Edit Apartment Details'}</DialogTitle>
            <DialogContent>
                {Object.keys(formData).map((key) => (
                    <TextField
                        key={key}
                        sx={{ marginBottom: "12px" }}
                        label={key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        fullWidth
                        multiline={key === 'description'}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}