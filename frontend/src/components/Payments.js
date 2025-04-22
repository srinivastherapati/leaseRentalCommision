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
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { getPastPayments, getFuturePayments } from "./ServerRequests";

function Payments() {
  const hasApplied = true;
  const [pastPayments, setPastPayments] = React.useState([]);
  const [futurePayments, setFuturePayments] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [paymentType, setPaymentType] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [cvv, setCvv] = React.useState("");

  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    getPastPayments(userId)
      .then((data) => {
        setPastPayments(data.payments);
      })
      .catch((error) => console.error("Failed to fetch past payments:", error));

    getFuturePayments(userId)
      .then((data) => {
        setFuturePayments(data.payments);
      })
      .catch((error) =>
        console.error("Failed to fetch future payments:", error)
      );
  }, []);

  const handleClickOpen = (paymentType) => {
    setOpen(true);
    setPaymentType(paymentType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "cardNumber") {
      setCardNumber(value);
    } else if (name === "expiryDate") {
      setExpiryDate(value);
    } else if (name === "cvv") {
      setCvv(value);
    }
  };

  const handlePay = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      alert("Please enter all payment details.");
      return;
    }

    try {
      // Simulating payment processing
      const response = await fetch(`/api/updatePayment/${paymentType}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bankNumber: cardNumber,
          routerNumber: cvv,
          amount: futurePayments.find((payment) => payment._id === paymentType)
            ?.amount,
          description: futurePayments.find(
            (payment) => payment._id === paymentType
          )?.description,
          status: "Paid",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Payment Successful !");

        window.location.reload();

        // // Refresh future payments after successful payment
        // const userId = localStorage.getItem("userId");
        // const updatedPayments = await getFuturePayments(userId);
        // setFuturePayments(updatedPayments.payments);

        // // Close the dialog
        // setOpen(false);
      } else {
        alert("Payment Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        "An error occurred while processing the payment. Please try again."
      );
    }
  };

  const renderTable = (payments, title) => (
    <>
      <h3>{title}</h3>

      {payments.length != 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label={`${title} table`}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Status
                </TableCell>
                {title === "Past Payments" && (
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Paid Date
                  </TableCell>
                )}
                {title === "Future Payments" && (
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Due Date
                  </TableCell>
                )}
                {title === "Future Payments" && (
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Pay Now
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {payment.description}
                  </TableCell>
                  <TableCell align="right">${payment.amount}</TableCell>
                  <TableCell
                    sx={{
                      color: payment.status === "Paid" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                    align="right"
                  >
                    {payment.status}
                  </TableCell>
                  {title === "Past Payments" && (
                    <TableCell align="right">
                      {new Date(payment.paidDate).toDateString()}
                    </TableCell>
                  )}
                  {title === "Future Payments" && (
                    <TableCell align="right">
                      {new Date(payment.dueDate).toDateString()}
                    </TableCell>
                  )}
                  {title === "Future Payments" && payment.status !== "Paid" && (
                    <TableCell align="right">
                      <Button onClick={() => handleClickOpen(payment._id)}>
                        Pay Now
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {payments.length == 0 && (
        <div style={{ display: "flex", width: "100%" }}>
          <p
            style={{
              justifyContent: "space-around",
            }}
          >
            No payments at this time
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="dflex ai-stretch">
      <Sidebar userName="Chakradhar" />
      <div className="dflex jc-around" style={styles.mainContent}>
        <Paper elevation={5} sx={{ width: "80%", padding: "32px" }}>
          {!hasApplied ? (
            <div className="w100 tcenter">
              <h3> You have not applied to any Apartments. </h3>
            </div>
          ) : (
            <div>
              <h2>Lease Payments</h2>
              {renderTable(pastPayments ? pastPayments : [], "Past Payments")}
              {futurePayments && renderTable(futurePayments, "Future Payments")}
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="cardNumber"
                    name="cardNumber"
                    label="Card Number"
                    type="text"
                    fullWidth
                    onChange={handleInputChange}
                  />
                  <TextField
                    margin="dense"
                    id="expiryDate"
                    name="expiryDate"
                    label="Expiry Date (MM/YY)"
                    type="text"
                    fullWidth
                    onChange={handleInputChange}
                  />
                  <TextField
                    margin="dense"
                    id="cvv"
                    name="cvv"
                    label="CVV"
                    type="text"
                    fullWidth
                    onChange={handleInputChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    onClick={handlePay}
                    disabled={!cardNumber || !expiryDate || !cvv}
                    color="primary"
                  >
                    Pay
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
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

export default Payments;
