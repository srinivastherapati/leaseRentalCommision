import React, { useState, useEffect } from 'react';
import { Paper, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Sidebar from './Sidebar';
import Carousel from './Carousel';

import {addMemberToLease, removeMemberFromLease } from './ServerRequests';

function LeaseDetail() {
    const [leaseMembers, setLeaseMembers] = useState([]);
    const [newMember, setNewMember] = useState('');
    const [allUsers, setAllUsers] = useState([]);

    const [data, setData] = React.useState(null);

    const hasLease = false;

    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        
        const fetchLeaseDetail = async (userId) => {
            try {
                const response = await fetch(`/api/getUserLeaseDetails/${userId}`);
                const data = await response.json();
                if (response.status === 404 || response.status == 500) {
                    hasLease = false;
                    setData({});
                    return;
                }
                return data;
            } catch (error) {
                console.error('Failed to fetch lease details:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/getAllUsers');
                const users = await response.json();
                setAllUsers(users);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                alert('Failed to load user data');
            }
        };
        fetchLeaseDetail(userId).then(data => {
            if (data) {
                setData(data);
                setLeaseMembers([ data.User.email,...data.members]);
            }
        });
        fetchUsers();
    }, []);

    const handleChange = (event) => {
        setNewMember(event.target.value);
    };

    const handleAddMember = async () => {
        if (newMember && !leaseMembers.includes(newMember)) {
            setLeaseMembers([...leaseMembers, newMember]);
            var reqId = allUsers.filter( user => user.email == newMember);
            console.log(reqId);
            const response = await addMemberToLease(userId, reqId);
            alert(`${newMember} has been added to the lease.`);
            setNewMember('');
        } else {
            alert("Member already exists in the lease");
        }
    };

    const handleRemoveMember = async (member) => {
        const updatedMembers = leaseMembers.filter(m => m !== member);
        setLeaseMembers(updatedMembers);
        console.log(member);
        // const response = await removeMemberFromLease(userId, member);
        alert(`${member} has been removed from the lease.`);
    };

    return (
        <div className="dflex ai-stretch">
            <Sidebar userName="Chakradhar"/>
            <div className="dflex jc-around" style={styles.mainContent}>
                { data == null && <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
                    <h2>No Lease found on your account. Please Apply or Check Status</h2>
                </Paper>

                }
                { data!==null && <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
                    <Carousel images={data.apartmentDetails.images} />
                    <h4>Your Lease Details:</h4>
                    <p>Apartment Number: {data.apartmentDetails.apartmentNumber}</p>
                    <p>Flat Number: {data.apartmentDetails.flatNumber}</p>
                    <p> Bedrooms : {data.apartmentDetails.bedrooms}, Bathrooms : {data.apartmentDetails.bathrooms}</p>
                    <p> Amenities : {data.apartmentDetails.amenities.join(",")}</p>
                    <p>Lease Start Date: 05/25/2025</p>
                    <p>Lease End Date: 05-24-2026</p>
                    <div className="dflex">
                        <p>Current Lease Members:</p>
                    </div>
                    <div className="dflex ai-center jc-between">
                        <FormControl sx={{width : "85%"}}>
                            <InputLabel id="add-member-label">Add Member</InputLabel>
                            <Select
                                labelId="add-member-label"
                                id="add-member"
                                value={newMember}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select Member</MenuItem>
                                {allUsers
  .filter((user) => user.firstName.toLowerCase() !== "admin")
  .map((user) => (
    <MenuItem key={user.email} value={user.email}>
      {user.firstName}
    </MenuItem>
))}

                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleAddMember}>Add Member</Button>
                    </div>
                    <ol>
                        {leaseMembers.map((member, index) => (
                            <li key={index}>
                                <span style={{ marginRight: "32px" }}>
                                    {member}
                                </span>
                                <a href="#" onClick={() => handleRemoveMember(member)}>Remove</a>
                            </li>
                        ))}
                    </ol>
                </Paper>
                }
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

export default LeaseDetail;
