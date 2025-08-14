const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
    },
    activityName: {
      type: String,
      trim: true,
    },
    isDelete: {
      type: Number,
      enum: [1, 0],
      default: 0,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("log", logSchema);
