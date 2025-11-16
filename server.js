import connectDb from "./config/db.config.js";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
// Connect to Database
connectDb();
 app.get("/", (req, res) => {
    res.send("True Path Foundation Backend is running");
});

app.use("/api/user", userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

