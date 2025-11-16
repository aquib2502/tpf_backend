import { sendOtp, verifyOtp } from "../controllers/user.controller.js";
import { Router } from "express";

const router = router();

// 🔹 Send OTP
router.post("/send-otp", sendOtp);

// 🔹 Verify OTP
router.get("/verify-otp", verifyOtp);

const userRoutes = router;
export default userRoutes;