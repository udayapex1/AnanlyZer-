import express from "express";
import dotenv from 'dotenv';
import connectDB from "./dataBase/db.js";
import cors from "cors"
import analysisRoutes from "./routes/anaysis.routes.js"
const app = express();
dotenv.config();

// MiddleWares :
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);




//DataBase connection:
connectDB();


// Cookie parser:


//Defining Routes:
app.use("/api/analysis", analysisRoutes);






app.listen(process.env.PORT, () => {
    console.log(`Running on https://localhost:${process.env.PORT}`);
})