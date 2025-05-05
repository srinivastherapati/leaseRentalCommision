import * as React from 'react';
import { useNavigate ,navigate} from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import { TextField, Button, Container, Typography, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { loginUser, registerUser,registerOwner } from './ServerRequests';

const useStyles = {
  form: {
    width: '50%',
  },
  submit: {
    marginTop: '5%',
    marginBottom: '5%',
  },
};

function LoginPage() {
  const navigate = useNavigate();

  if (localStorage.getItem('isLoggedIn')) {
    window.location.href = '/home';
  }

  const [type, setType] = React.useState('login');
  const toggleButton = () => setType(type === 'login' ? 'register' : 'login');

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [role, setRole] = React.useState('customer');
  const [dob, setDob] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState(''); 
  const [state, setState] = React.useState('');
  const [zipcode, setZipCode] = React.useState('');

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(userEmail, password);
      if (response.message === "Login successful") {
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('userId', response.user.userId);
        localStorage.setItem('fullName', response.user.fullName);
        navigate('/home');
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("An error occurred during login:", error);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    const payload = {
      firstName,
      lastName,
      email: userEmail,
      password,
      role,
      phoneNumber: mobileNumber,
      city: city,
      zipcode:zipcode,
      state:state,
      street:street
    };
  
    try {
      let response;
      if (role === 'customer') {
        payload.annualIncome = '000'; // backend requires this field
        response = await registerUser(payload);
      } else if (role === 'owner') {
        payload.approved = false; // backend requires this field
        response = await registerOwner(payload);
      }
  
      alert(response.message);
  
      if (response.message.includes("signed up successfully")) {
        setType('login'); // Switch back to login form
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
      console.error(err);
    }
  };
  

  return (
    <>
      <Header hasLoginBtn={false} />
      {type === 'login' ? (
        <Box className="w100 tcenter">
          <h1>Login</h1>
          <Box className="dflex jc-around">
            <form style={useStyles.form} onSubmit={handleLoginSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" color="primary" style={useStyles.submit}>
                Sign In
              </Button>
            </form>
          </Box>
          <a href="#" className="mx-4" onClick={toggleButton}>
            Don't have an Account? Register
          </a>
        </Box>
      ) : (
        <Box className="w100 tcenter">
          <h1>Register</h1>
          <Box className="dflex jc-around">
            <form style={useStyles.form} onSubmit={handleRegisterSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="First Name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Last Name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Mobile Number"
                autoComplete="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />  
            
               <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
               <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Zipcode"
                value={zipcode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Register As</InputLabel>
                <Select
                  labelId="role-label"
                  value={role}
                  label="Register As"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="owner">Owner</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" color="primary" style={useStyles.submit}>
                Register
              </Button>
            </form>
          </Box>
          <a href="#" className="mx-4" onClick={toggleButton}>
            Already have an Account? Login
          </a>
        </Box>
      )}
      <Footer />
    </>
  );
}

export default LoginPage;
