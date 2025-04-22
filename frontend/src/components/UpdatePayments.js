import * as React from "react";
import Sidebar from "./Sidebar";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { updatePaymentStatus, addPayment } from "./ServerRequests";

function AdminPayments() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = React.useState(false);
  const [transactionDetails, setTransactionDetails] = React.useState("");
  const [paymentStatus, setPaymentStatus] = React.useState("");
  const [allUsers, setAllUsers] = React.useState([]);
  const [payments, setPayments] = React.useState([]);
  const role = localStorage.getItem("role"); 

  const [newPayment, setNewPayment] = React.useState({
    name: "",
    description: "",
    amount: "",
    userId: "", // Set a default empty value
  });
  const handleDateChange = (date) => {
    setNewPayment({ ...newPayment, dueDate: date });
  };

  React.useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`/api/getAllRequiredPayments`);
        const data = await response.json();
        setPayments(data.payments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getAllUsers");
        const users = await response.json();
        // console.log(users);
        setAllUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
    fetchPayments();
  }, []);

  const handleAddPaymentOpen = () => {
    setOpenAddPaymentDialog(true);
  };

  const handleAddPaymentClose = () => {
    setOpenAddPaymentDialog(false);
  };

  const handleAddPaymentChange = (event) => {
    const { name, value } = event.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleAddPaymentSubmit = async () => {
    try {
      const response = await addPayment(newPayment);
      if (response.ok) {
        const updatedPayments = await response.json();
        // setPayments(updatedPayments.payments);
        alert("Payment added successfully!");
        this.fetchPayments();
      } else {
        alert("Failed to add payment.");
      }
    } catch (error) {
      console.error("Failed to add payment:", error);
    } finally {
      handleAddPaymentClose();
    }
  };

  return (
    <div className="dflex ai-stretch">
      <Sidebar userName="Admin" />
      <div className="dflex jc-around" style={styles.mainContent}>
        <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
          <h2>Payments</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPaymentOpen}
          >
            Add New Payment
          </Button>
          <TableContainer>
            <Table>
            <TableHead>
  <TableRow>
    <TableCell>Description</TableCell>
    <TableCell align="right">Amount</TableCell>
    {role === "admin" && <TableCell align="right">Commission</TableCell>}
    <TableCell align="right">Status</TableCell>
    <TableCell align="right">Transaction Details</TableCell>
    <TableCell align="right">User</TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {payments
    .filter((payment) => {
      // If owner, hide "Application Fee" records
      if (role === "owner") {
        return !payment.description.toLowerCase().includes("application");
      }
      return true; // for admin or others, show all
    })
    .map((payment, index) => {
      const isApplicationFee = payment.description.toLowerCase().includes("application");
      const commission = isApplicationFee ? payment.amount : (payment.amount * 0.05);
      const ownerAmount = isApplicationFee ? 0 : payment.amount - commission;

      return (
        <TableRow key={index}>
          <TableCell>{payment.description}</TableCell>
          <TableCell align="right">
            {role === "owner"
              ? `$${ownerAmount.toFixed(2)}`
              : `$${payment.amount.toFixed(2)}`}
          </TableCell>

          {role === "admin" && (
            <TableCell align="right">
              {isApplicationFee
                ? `$${payment.amount.toFixed(2)}`
                : `$${commission.toFixed(2)}`}
            </TableCell>
          )}

          <TableCell align="right">{payment.status}</TableCell>
          <TableCell align="right">{payment.transactionId}</TableCell>
          <TableCell align="right">{payment.user.email}</TableCell>
        </TableRow>
      );
    })}
</TableBody>


            </Table>
          </TableContainer>

          {/* Add Payment Dialog */}

          <Dialog
            open={openAddPaymentDialog}
            onClose={handleAddPaymentClose}
            aria-hidden="false"
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DialogTitle>Add New Payment</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Payment Name"
                  type="text"
                  fullWidth
                  onChange={handleAddPaymentChange}
                />
                <TextField
                  margin="dense"
                  name="description"
                  label="Payment Description"
                  type="text"
                  fullWidth
                  onChange={handleAddPaymentChange}
                />
                <TextField
                  margin="dense"
                  name="amount"
                  label="Amount"
                  type="number"
                  fullWidth
                  onChange={handleAddPaymentChange}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>User</InputLabel>
                  <Select
                    name="userId"
                    value={newPayment.userId}
                    onChange={handleAddPaymentChange}
                  >
                    {allUsers.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.email}
                      </MenuItem>
                    ))}
                  </Select>
                  <DatePicker
                    label="Due Date"
                    value={newPayment.dueDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} margin="dense" fullWidth />
                    )}
                  />
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAddPaymentClose}>Cancel</Button>
                <Button onClick={handleAddPaymentSubmit} color="primary">
                  Add
                </Button>
              </DialogActions>
            </LocalizationProvider>
          </Dialog>
        </Paper>
      </div>
    </div>
  );
}

const styles = {
  mainContent: {
    flex: 1,
    marginLeft: "200px",
    padding: "30px",
  },
};

export default AdminPayments;
