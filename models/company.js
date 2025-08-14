const mongoose = require("mongoose");
const sequencing = require("./sequencing");

const companySchema = mongoose.Schema(
  {
    compLogo: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    isDelete: {
      type: Number,
      enum: [1, 0],
      default: 0,
      trim: true,
    },
    dateField: {
      type: String,
      // trim: true,
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
    createdBy: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
    deletedBy: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("company", companySchema);