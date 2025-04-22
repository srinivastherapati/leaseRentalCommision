// login.js

import express  from 'express';
import bcrypt  from 'bcryptjs';
import sign  from 'jsonwebtoken';
import User from "./modules/userModel.js";
import Owner from './modules/OwnerModal.js';

const loginRouter =express.Router();

loginRouter.post('/api/login', async (req, res) => {
  try {
    console.log("Login request received");
    const { email, password } = req.body;

    // First, check if user exists in User (customer)
    let user = await User.findOne({ email });
    let userType = 'customer';

    // If not found in User, check in Owner
    if (!user) {
      user = await Owner.findOne({ email });
      userType = 'owner';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (userType === 'owner' && !user.approved) {
      return res.status(403).json({ message: 'Owner account not approved by admin yet.' });
    }

    // Success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        isAdmin: userType === 'owner' // or however you define admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


loginRouter.get('/api/getAllUsers', async (req, res) => {
    try {
        // Fetch all users from the User table
        const allUsers = await User.find({}, { _id: 1, firstName: 1, email: 1 , });

        // Return the list of all users with only name and email fields
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET: List of all pending owners
// loginRouter.get('/api/pending-owners', async (req, res) => {
//     try {
//         console.log("Fetching pending owners");
//         const pendingOwners = await Owner.find({ approved: false });
//         res.status(200).json(pendingOwners);
//     } catch (error) {
//         console.error('Error fetching pending owners:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// // POST: Approve owner by ID
// loginRouter.post('/api/approve-owner/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const owner = await Owner.findById(userId);
//         if (!owner) {
//             return res.status(404).json({ message: 'Owner not found' });
//         }

//         owner.approved = true;
//         await owner.save();

//         res.status(200).json({ message: 'Owner approved successfully' });
//     } catch (error) {
//         console.error('Error approving owner:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

export default loginRouter;
