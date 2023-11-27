import express from 'express';
import Auth_module from '../modules/Auth_module.js';
import bcrypt from 'bcrypt';

const authrouter = express.Router();

// register user

authrouter.post("/register", async (req, res, next) => {
    const { username, email, password, profileimage, followers, following } = req.body;

    console.log(req.body, 'req.body')
    try {


        const Existuseremail = await Auth_module.findOne({ email })
        const Existusername = await Auth_module.findOne({ username })


        if (Existuseremail || Existusername) {
            return res.status(404).json("Email or User name alredy exist")
        }
        else {            
            const registeruser = new Auth_module({
                username, email, password, profileimage, followers, following
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

export default authrouter;