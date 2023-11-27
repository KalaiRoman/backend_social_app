import Mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from "morgan";
import express from 'express';
import ConnectDb from "./middleware/Dbconnct.js";
import authrouter from "./routers/Auth.js";

dotenv.config();

// db connect


ConnectDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("common"));


// apis

app.use("/auth", authrouter)

// listing db

app.listen(8800, () => {
    console.log("running")
})
