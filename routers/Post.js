import express from 'express';
import Post_shema from '../modules/Post_modeuls.js';
import { verifyToken } from './../middleware/verifyToken.js';
import Auth_module from '../modules/Auth_module.js';

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



postrouter.put("/like/:id", verifyToken, async (req, res, next) => {
    const { userid } = req.body;
    try {

        if (req.userid === userid) {
            const responsePost = await Post_shema.findById(req.params.id);
            if (responsePost.likes.includes(userid)) {
                await responsePost.updateOne({ $pull: { likes: userid } })
                res.status(201).json({ message: "Post Dislike " })
            }
            else {
                await responsePost.updateOne({ $push: { likes: userid } })
                res.status(200).json({ message: "Post Liked" })
            }
        }
        else {
            res.status(404).json({ message: "Your Not Allowed Post Delete" })
        }

    } catch (error) {
        res.status(404).json({ message: error })

    }
})



postrouter.put("/command/:id", verifyToken, async (req, res, next) => {
    const { userid, desc } = req.body;
    try {

        if (req.userid === userid) {
            const responsePost = await Post_shema.findById(req.params.id);
            if (responsePost) {
                await responsePost.updateOne({
                    $push: {
                        postcommands: {
                            desc: desc,
                            user: userid
                        }
                    }
                })
                res.status(201).json({ message: "Post Command user" })
            }
            else {
                res.status(200).json({ message: "Un authorized user" })
            }
        }
        else {
            res.status(404).json({ message: "Your Not Allowed Post Delete" })
        }

    } catch (error) {
        res.status(404).json({ message: error })

    }
})


postrouter.post("/command/delete/:id", verifyToken, async (req, res, next) => {
    const { userid, commandid } = req.body;

    console.log(req.body, 'l')
    try {

        if (req.userid === userid) {

            const post = await Post_shema.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $pull: { postcommands: { _id: commandid } },
                },
                { new: true }
            );

        }
        else {
            res.status(404).json({ message: "Your Not Allowed Post Delete" })
        }

    } catch (error) {
        res.status(404).json({ message: error })

    }
})

postrouter.put("/follow/:id", verifyToken, async (req, res, next) => {
    const { userid } = req.body;

    try {

        if (req?.params?.id === userid) {

            res.status(404).json({ message: "You Not Follow You" })


        }
        else {

            const user = await Auth_module.findById(req.params.id);
            const currentuser = await Auth_module.findById(userid);

            if (user?.followers?.includes(user)) {
                res.status(404).json({ message: "User already followed this user" })

            }
            else {
                await user?.updateOne({ $push: { followers: userid } })
                await currentuser?.updateOne({ $push: { followers: userid } })
                res.status(201).json({ message: "You Follow this user" })

            }


        }

    } catch (error) {
        res.status(404).json({ message: error })

    }
})


// all users


postrouter.get("/getallusers", verifyToken, async (req, res, next) => {
    try {
        const user = await Auth_module.find();

        console.log(user,'user')
        await res.status(200).json(user)

    } catch (error) {
        res.status(404).json(error);
    }
})

export default postrouter;