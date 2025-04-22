import { Schema, model } from 'mongoose';

const OwnerSchema = new Schema({
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
  role: {
    type: String,
    default: "owner"
  },
  currentAddress: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false  
  },
}, {
  timestamps: true
});

const Owner = model('Owner', OwnerSchema);

export default Owner;
