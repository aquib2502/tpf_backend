import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/, // Indian mobile format
    },
    otp: {
      type: String,
      select: false, // hide in queries by default
    },
    address: {
      house: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String, match: /^\d{6}$/ },
    },

    // 🟢 Membership
    permanentMember: {
      type: Boolean,
      default: false,
    },

    // 🟢 Frequency + Recurring Donation Details
    donationSchedule: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "none"],
        default: "none",
      },
      dayOfWeek: {
        type: String,
        enum: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ],
      }, // applicable only if weekly
      dayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
      }, // applicable only if monthly
      recurringAmount: {
        type: Number,
        default: 0,
      },
    },

    // 🟢 Zakaat contribution with amount
    zakaatContributor: {
      isContributor: { type: Boolean, default: false },
      amount: { type: Number, default: 0 },
    },

    // 🟢 KYC Documents (array of docs)
    kycDocuments: [
      {
        docType: { type: String, required: true }, // e.g. "Aadhaar", "PAN"
        docUrl: { type: String, required: true },
        verified: { type: Boolean, default: false },
      },
    ],
    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" },
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
