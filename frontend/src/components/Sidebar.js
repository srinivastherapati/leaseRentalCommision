import React from 'react';
import { Link } from 'react-router-dom'; 

const userData = JSON.parse(localStorage.getItem('userData'));

const Sidebar = ({ userName }) => {
  // var isAdmin = userData.isAdmin ;
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  var isAdmin = localStorage.getItem('role')!=='customer' && localStorage.getItem('role')!=='owner' ;
  const isOwner= localStorage.getItem('role')==='owner' ;
  const loginUserName=localStorage.getItem('fullName');


  const logoutUser = ()=>{
    localStorage.clear();
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.userInfo}>
        <p>Welcome, {loginUserName}</p>
      </div>
      <div style={styles.menu}>
        <ul style={styles.menuList}>
          
          <li style={styles.menuItem}>
            <Link to="/home" style={styles.link}>Search Property</Link>
          </li>

          { !isAdmin && !isOwner &&
            <li style={styles.menuItem}>
              <Link to="/status" style={styles.link}>Check Status</Link>
            </li>
          }
          {
            (isAdmin || isOwner) &&
            <li style={styles.menuItem}>
              <Link to="/update-status" style={styles.link}>Update Status</Link>
            </li>
          }

{ !isAdmin && !isOwner &&
  <li style={styles.menuItem}>
    <Link to="/your-payments" style={styles.link}>Payments</Link>
  </li>
}

          { (isAdmin || isOwner) && 
            <li style={styles.menuItem}>
              <Link to="/update-payments" style={styles.link}>Update Payments</Link>
            </li>
          }
          {isAdmin && 
  <li style={styles.menuItem}>
    <Link to="/approve-owners" style={styles.link}>Approve Owners</Link>
  </li>
}

          
          
          { isAdmin || isOwner && 
          <li style={styles.menuItem}>
            <Link to="/fix-complaints" style={styles.link}>Fix Complaints</Link>
          </li>
          }
          { (!isAdmin && !isOwner) && 
          <li style={styles.menuItem}>
            <Link to="/raise-complaints" style={styles.link}>Raise Complaints</Link>
          </li>
          }

          { !isAdmin && !isOwner&& 
            <li style={styles.menuItem}>
              <Link to="/your-lease" style={styles.link}>Your Lease</Link>
            </li>
          }
          { isAdmin && 
            <li style={styles.menuItem}>
              <Link to="/lease-list" style={styles.link}>Given Leases</Link>
            </li>
          }
          <li style={styles.menuItem}>
            <a onClick={()=> logoutUser()}href ="#">
            <Link to="/login" style={styles.link}> Logout </Link>
            </a>
          </li>
          { // Implement Docs Page
          /* <li style={styles.menuItem}>
            <Link to="/docs" style={styles.link}> Documents</Link>
          </li> */
          }
        </ul>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: '#333',
    color: '#fff',
    width: '200px',
    height: '100vh',
    paddingTop: '20px',
    paddingLeft: '20px',
    position : 'fixed',
    fontSize : '18px',
    fontWeight : 'semibold'
  },
  userInfo: {
    marginBottom: '40px'
  },
  menu: {
    marginLeft: '10px',
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    color : 'blue',
    marginBottom: '40px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
};

export default Sidebar;
