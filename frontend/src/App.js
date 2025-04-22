import './App.css';

import MainPage from './components/MainPage'
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import StatusPage from './components/Status';
import RegisterComplaint from './components/RegisterComplaint';
import ViewComplaints from './components/ViewComplaints';
import ViewApartment from './components/ViewApartment';
import LeaseDetail from './components/LeaseDetail';
import Payments from './components/Payments';
import UpdateStatus from './components/UpdateStatus';
import FixComplaints from './components/FixComplaints';
import UpdatePayments from './components/UpdatePayments';
import GivenLeases from './components/GivenLeases';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApproveOwners from './components/ApproveOwners';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <MainPage/> }></Route>
        <Route path="/home" element={ <HomePage/> }></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/status" element = { <StatusPage/> }></Route>
        <Route path="/raise-complaints" element= { <RegisterComplaint/> }></Route>
        <Route path="/view-complaints" element = { <ViewComplaints/> }></Route>
        <Route path="/your-lease" element = { <LeaseDetail/> }></Route>
        <Route path="/apartment/:id" element={ <ViewApartment/> }></Route>
        <Route path="/your-payments" element= { < Payments/> } ></Route>
        <Route path="/update-status" element= { < UpdateStatus/> } ></Route>
        <Route path="/fix-complaints" element= { < FixComplaints/> } ></Route>
        <Route path="/update-payments" element= { < UpdatePayments/> } ></Route>
        <Route path="/lease-list" element= { < GivenLeases/> } ></Route>
        <Route path="/approve-owners" element= { < ApproveOwners/> } ></Route>
      </Routes>
    </Router>
  );
}

export default App;
