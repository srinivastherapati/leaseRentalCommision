

import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default:"customer"
    },
    currentAddress:{
        type:String,
        required:true
    },
    annualIncome:{
        type:Number,
        required:true
    }
});

const User = model('User', UserSchema);

export default User;
