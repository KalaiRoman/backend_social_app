import express from 'express';
import Auth_module from '../modules/Auth_module.js';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/verifyToken.js';

const authrouter = express.Router();

// register user

authrouter.post("/register", async (req, res, next) => {
    const { username, email, password, profileimage, followers, following ,bannerimage} = req.body;
    try {

        const Existuseremail = await Auth_module.findOne({ email })
        const Existusername = await Auth_module.findOne({ username })
        if (Existuseremail || Existusername) {
            return res.status(404).json("Email or User name alredy exist")
        }
        else {

            const hashed = await bcrypt.genSalt(10);
            const changeHashed = await bcrypt.hashSync(password, hashed);
            const registeruser = new Auth_module({
                username, email, password: changeHashed, profileimage, followers, following,bannerimage
            })
            await registeruser.save();
            res.status(201).json({
                data: registeruser
            })
        }
    } catch (error) {
        res.status(404).json(error);
    }
})


// otp section

const otp = Math.floor(1000 + Math.random() * 9000);



// login user
authrouter.post("/login", async (req, res, next) => {

    authrouter.get("/otp/generate", async (req, res, next) => {

        try {
            res.status(200).json({
                otp
            })

        } catch (error) {
            res.status(404).json(error);
        }
    })



    const {
        userNameEmail,
        password
    } = req.body;
    try {

        const user = await Auth_module.findOne({
            $or: [{
                "email": userNameEmail
            }, {
                "username": userNameEmail
            }]
        });

        if (user) {

            const changeHashed = await bcrypt.compare(password, user?.password);
            const token = await jwt.sign({ id: user?._id.toString(), expiresIn: "2h" }, process.env.SECURECODE);
            if (changeHashed) {
                const { password, ...users } = user?._doc;

                res.status(200).json({
                    users,
                    token
                })
            }
            else {
                return res.status(404).json({message:"Wrong Password"})
            }
        }
        else {
            return res.status(404).json({ message: "Email or User name Not exist" })
        }
    } catch (error) {
        res.status(404).json(error);
    }
})





// genrate otp

authrouter.get("/otp/generate", async (req, res, next) => {

    try {
        res.status(200).json({
            otp
        })

    } catch (error) {
        res.status(404).json(error);
    }
})


// check otp

authrouter.post("/otp/ckeck", async (req, res, next) => {

    const { otpuser } = req.body

    try {

        if (otpuser == otp) {
            res.status(200).json({
                data: "Otp Corrected"
            })
        }
        else {
            res.status(404).json({ message: "Invalid Otp" })
        }
    } catch (error) {
        res.status(404).json(error);

    }
})


// get user details

authrouter.get("/getuser/:id", verifyToken, async (req, res, next) => {
    const id = req.params.id;
    try {
        const checkuser = await Auth_module.findById({ _id: id });
        if (id) {
            const { password, ...user } = checkuser?._doc;
            res.status(200).json(user)
        }
        else {
            res.status(404).json("Unauthorized User")
        }
    } catch (error) {
        res.status(404).json(error);
    }
})



export default authrouter;