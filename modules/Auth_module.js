import mongoose from 'mongoose';


const Auth = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 13
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 15,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 10
    },
    profileimage: {
        type: String,

    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    });

export default mongoose.model("auth", Auth)