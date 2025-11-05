import User from "../models/User.js";

// In-memory store for quick OTP access
const otpStore = new Map();


// #region sendOtp controller
const sendOtp = async (req, res) => {
  try {
    const { mobileNo } = req.body;
    if (!mobileNo)
      return res.status(400).json({ message: "Mobile number required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in memory for 5 minutes
    otpStore.set(mobileNo, { otp, expires: Date.now() + 5 * 60 * 1000 });

    // Create or update user
    let user = await User.findOne({ mobileNo });
    if (!user) {
      user = await User.create({ mobileNo });
    }

    user.otp = otp;
    await user.save();

    console.log(`📲 OTP for ${mobileNo}: ${otp}`); // Replace with actual SMS sending later

    // Auto-remove OTP after 5 minutes
    setTimeout(async () => {
      otpStore.delete(mobileNo);
      await User.updateOne({ mobileNo }, { $unset: { otp: "" } });
    }, 5 * 60 * 1000);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// #endregion

// 🔹 Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { mobileNo, otp, fullName, email } = req.body;
    if (!mobileNo || !otp)
      return res
        .status(400)
        .json({ message: "Mobile number and OTP required" });

    const cached = otpStore.get(mobileNo);
    const user = await User.findOne({ mobileNo });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validOtp = cached?.otp || user.otp;
    const expired = cached && cached.expires < Date.now();

    if (!validOtp) return res.status(400).json({ message: "No OTP found" });
    if (expired) return res.status(400).json({ message: "OTP expired" });
    if (otp !== validOtp) return res.status(400).json({ message: "Invalid OTP" });

    // OTP verified ✅
    otpStore.delete(mobileNo);
    user.otp = undefined;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    await user.save();

    res.json({ message: "OTP verified successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export{
  sendOtp,
  verifyOtp
}