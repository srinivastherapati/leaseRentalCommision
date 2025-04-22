// login.js

import express  from 'express';

import Admin from '../modules/adminModel.js';
import Owner from '../modules/OwnerModal.js';

const adminRouter =express.Router();



adminRouter.get('/api/admin/pending-owners', async (req, res) => {
    try {
        console.log("Fetching pending owners");
        const pendingOwners = await Owner.find({ approved: false });
        res.status(200).json(pendingOwners);
    } catch (error) {
        console.error('Error fetching pending owners:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: Approve owner by ID
adminRouter.post('/api/admin/approve-owner/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const owner = await Owner.findById(userId);
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        owner.approved = true;
        await owner.save();

        res.status(200).json({ message: 'Owner approved successfully' });
    } catch (error) {
        console.error('Error approving owner:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default adminRouter;
