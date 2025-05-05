
import express from 'express';
import availableApartments from './modules/availableApartmentsModel.js';
import apartmentDetails from './modules/apartmentDetailsModule.js';

const availableApartmentsRouter = express.Router();


availableApartmentsRouter.get('/api/apartmentDetails', async (req, res) => {
    const { availableFrom } = req.query;

    try {
        const filter = {};

        if (availableFrom) {
            filter.availableFrom = { $gte: new Date(availableFrom) };
        }

        const apartments = await apartmentDetails.find(filter)
            .populate({
                path: 'ownerId',
                select: 'ownerName ownerContact'
            });

        res.json(apartments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default availableApartmentsRouter;
