import mongoose from 'mongoose';

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string);
    } catch (err) {
        console.log("Error connecting with database", err)
    }

}

export default connectDB