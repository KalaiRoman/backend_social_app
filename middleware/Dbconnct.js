
import mongoose from "mongoose";
const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MOGODB_URL)
        console.log("DB Connected")
    } catch (error) {
        console.log("DB Error")

    }
}

export default ConnectDb;