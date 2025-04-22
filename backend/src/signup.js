
import User from "./modules/userModel.js";
import express from "express";
import bodyParser  from 'body-parser';
import Owner from "./modules/OwnerModal.js";

const signupRouter=express.Router();

signupRouter.use(bodyParser.json());

signupRouter.post('/api/register', async (req, res) => {
    try {
        const { firstName,lastName, email, password,phoneNumber,role,currentAddress,annualIncome } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }


        // Create a new user
        const newUser = new User({ firstName,lastName, email, password,phoneNumber,role,currentAddress,annualIncome });
        await newUser.save();
        res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

signupRouter.post('/api/owner/register', async (req, res) => {
    try {
        const { firstName,lastName, email, password,phoneNumber,role,currentAddress,approved } = req.body;

        // Check if user with the same email already exists
        const existingUser = await Owner.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }


        // Create a new user
        const newOwner = new Owner({ firstName,lastName, email, password,phoneNumber,role,currentAddress,approved });
        await newOwner.save();
        res.status(201).json({ message: "Owner signed up successfully,Approval pending from admin" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default signupRouter;