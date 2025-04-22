import React, { useEffect, useState } from 'react';
import { getPendingOwners, approveOwner } from './ServerRequests'; 

import Sidebar from './Sidebar';

const ApproveOwners = () => {
  const [pendingOwners, setPendingOwners] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      const data = await getPendingOwners(); 
      setPendingOwners(data || []);
    };
    fetchPending();
  }, []);

  const handleApprove = async (userId) => {
    const response = await approveOwner(userId);
    alert(response.message);
    setPendingOwners(pendingOwners.filter(owner => owner._id !== userId));
  };

  return (
    <div className="dflex ai-stretch">
      <Sidebar userName="Chakradhar" />
      <div className="dflex jc-around" style={styles.mainContent}>
        <div style={{ width: '80%' }}>
          <h2>Approve Owners</h2>
          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOwners?.map((owner) => (
                <tr key={owner._id}>
                  <td>{owner.firstName} {owner.lastName}</td>
                  <td>{owner.email}</td>
                  <td>{owner.phoneNumber}</td>
                  <td>
                    <button onClick={() => handleApprove(owner._id)}>Approve</button>
                  </td>
                </tr>
              ))}
              {pendingOwners?.length === 0 && (
                <tr>
                  <td colSpan="4">No owner requests pending approval.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainContent: {
    flex: 1,
    marginLeft: '200px',
    padding: '32px'
  }
};

export default ApproveOwners;

