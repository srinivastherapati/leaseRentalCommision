import { Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as React from 'react';
import Sidebar from './Sidebar';
import { getAllStatuses, getStatusesByOwner, updateStatus } from './ServerRequests';

function UpdateStatus() {
  const columns = ["apartmentNumber", "flatNumber", "status", "appliedBy"];
  const [updatedData, setUpdatedData] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  React.useEffect(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (role === 'owner') {
      getStatusesByOwner(userId)
        .then(data => setUpdatedData(data))
        .catch(error => console.error('Failed to fetch owner statuses:', error));
    } else {
      getAllStatuses()
        .then(data => setUpdatedData(data))
        .catch(error => console.error('Failed to fetch all statuses:', error));
    }
  }, []);

  const handleClickUser = (index) => {
    const record = {
      name: updatedData[index].userName,
      email: updatedData[index].email,
      phone: updatedData[index].phoneNumber,
      income: updatedData[index].income
    };
    setSelectedUser(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChangeStatus = (event, index) => {
    const updatedStatus = event.target.value;
    const newData = [...updatedData];
    const { flatNumber, apartmentNumber } = updatedData[index];

    updateStatus(flatNumber, apartmentNumber, updatedStatus)
      .then(() => {
        alert("Status updated successfully");
        newData[index] = { ...newData[index], status: updatedStatus };
        setUpdatedData(newData);
      })
      .catch(error => console.error('Failed to update status:', error));
  };

  return (
    <div className="dflex ai-stretch">
      <Sidebar userName={localStorage.getItem("fullName")} />
      <div className="dflex jc-around" style={styles.mainContent}>
        <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
          <h2>Lease Statuses</h2>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column, columnIndex) => (
                    <TableCell sx={{ fontWeight: "bold" }} key={columnIndex}>
                      {column === "status" ? (
                        <Select
                          value={row[column]}
                          onChange={(event) => handleChangeStatus(event, index)}
                          size="small"
                        >
                          <MenuItem value="applied">Applied</MenuItem>
                          <MenuItem value="underReview">Under Review</MenuItem>
                          <MenuItem value="partiallyApproved">Partially Approved</MenuItem>
                          <MenuItem value="verified">Verified</MenuItem>
                          <MenuItem value="approved">Approved</MenuItem>
                          <MenuItem value="rejected">Declined</MenuItem>
                        </Select>
                      ) : (
                        column === "appliedBy" ? (
                          <a style={{ cursor: "pointer", color: "blue" }} onClick={() => handleClickUser(index)}>
                            {row["userName"]}
                          </a>
                        ) : row[column]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog sx={{ width: "100%" }} open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
              {selectedUser && (
                <div>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Income:</strong> {selectedUser.income}</p>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </Paper>
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

export default UpdateStatus;
