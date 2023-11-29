import mongoose from "mongoose";


export const Post_shema = new mongoose.Schema({
    postImageUrl: {
        type: String,
        required: true
    },
    userCommand: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth'
    }
},
    {
        timestamps: true
    });


export default mongoose.model("post", Post_shema);