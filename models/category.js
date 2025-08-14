const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required:true
    },

     isDelete: {
      type: Number,
      enum: [1, 0],
      default: 0,
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

module.exports = mongoose.model("category", categorySchema);
