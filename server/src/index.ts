import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import problemRoutes from "./routes/problemRoutes";
import testCaseRoutes from "./routes/testCaseRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import contestRoutes from "./routes/contestRoutes";

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());



app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems",problemRoutes);
app.use("/api/problems",testCaseRoutes);
app.use("/api/submissions",submissionRoutes);
app.use("/api/contests",contestRoutes);


app.get("/",(req,res)=>{
    res.send("Backend running");
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})