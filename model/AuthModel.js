import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username :{
        type :String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address' ]
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
    }
});

const User = new mongoose.model("User",UserSchema);

export default User;