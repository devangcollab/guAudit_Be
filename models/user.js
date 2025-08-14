const mongoose = require("mongoose");
const sequencing = require("./sequencing");

const userSchema = mongoose.Schema(
  {
    compId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      trim: true,
    },
    locId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "location",
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
    },
    password: { type: String, trim: true },
    isDelete: {
      type: Number,
      enum: [1, 0],
      default: 0,
      trim: true,
    },
    // role: {
    //   type: String,
    //   enum: ["SA", "A", "U"],
    //   required: true,
    // },
    role:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "role"
    },
    otp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("user", userSchema);
