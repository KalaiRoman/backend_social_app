import express from 'express';
import Post_shema from '../modules/Post_modeuls.js';
import { verifyToken } from './../middleware/verifyToken.js';

const postrouter = express.Router();

postrouter.post("/create", verifyToken, async (req, res, next) => {
    const { postImageUrl, userCommand, userid } = req.body;

    try {

        const responsePost = await new Post_shema({
            postImageUrl,
            userCommand,
            user: userid
        })
        await responsePost.save();
        res.status(201).json(responsePost)
    } catch (error) {
        res.status(404).json({ message: error })

    }
})


postrouter.get("/allposts", verifyToken, async (req, res, next) => {
    try {

        const responsePost = await Post_shema.find().populate("user");
        res.status(200).json({ responsePost })
    } catch (error) {
        res.status(404).json({ message: error })

    }
})

postrouter.get("/single/:id", verifyToken, async (req, res, next) => {
    const id = req.params.id;
    try {
        const responsePost = await Post_shema.find({ user: id }).populate("user");
        res.status(200).json({ responsePost })
    } catch (error) {
        res.status(404).json({ message: error })

    }
})


postrouter.post("/single/delete/", verifyToken, async (req, res, next) => {
    const { postid, userid } = req.body;
    try {

        if (req.userid === userid) {
            const responsePost = await Post_shema.findByIdAndDelete(postid);
            res.status(200).json({ message: "Post Deleted" })
        }
        else {
            res.status(404).json({ message: "Your Not Allowed Post Delete" })
        }

    } catch (error) {
        res.status(404).json({ message: error })

    }
})

export default postrouter;