import {Schema, model} from 'mongoose';
import apartmentDetails from './apartmentDetailsModule.js';


const leaseInfoSchema = new Schema({
    apartmentDetails: {
        type: Schema.Types.ObjectId,
        ref: 'apartmentDetails', // Reference to the ApartmentDetails model
        required: true
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    status:{
        type:String
    },
    ssn:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
        
    },
    yearsOfExperience:{
        type:Number,
        required:true
        
    },
    officeNumber:{
        type:String,
        required:true
        
    },
    income:{
        type:Number,
        required:true
        
    },
    position:{
        type:String,
        required:true
        
    },
    members:{
        type:[String]
    }
});

// Define a model for the response
const leaseInfo = model('leaseInfo', leaseInfoSchema);

export default leaseInfo;
