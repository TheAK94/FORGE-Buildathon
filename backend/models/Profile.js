
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    personal: {
      fullName: { type: String, trim: true },
      dateOfBirth: { type: Date },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other", ""],
        default: ""
      },
      phone: { type: String, trim: true },
      email: { type: String, trim: true }
    },

    address: {
      house: { type: String, trim: true },
      street: { type: String, trim: true },
      village: { type: String, trim: true },
      district: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true }
    },

    family: {
      fatherName: { type: String, trim: true },
      motherName: { type: String, trim: true }
    },

    occupation: { type: String, trim: true },
    annualIncome: { type: Number, min: 0 },
    education: { type: String, trim: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Profile", profileSchema);
