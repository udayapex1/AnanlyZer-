import express from "express";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_DB_URI,
            {

            }
        )
        console.log('\x1b[32m%s\x1b[0m', '✅ MongoDB Connected Successfully!');
        console.log(`📡 Host: ${connectionInstance.connection.host}`);
        console.log(`🛢️  DB Name: ${connectionInstance.connection.name}`);
        console.log(`🔌 Port: ${connectionInstance.connection.port || 'default'}`);
        console.log('--------------------------------------------');
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;