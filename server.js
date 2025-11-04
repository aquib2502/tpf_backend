import connectDb from "./config/db.config.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Connect to Database
connectDb();
 app.get("/", (req, res) => {
    res.send("True Path Foundation Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

