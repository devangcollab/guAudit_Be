const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    // compId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "company",
    //   required: true,
    //   trim: true,
    // },
    // locId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "location",
    //   required: true,
    //   trim: true,
    // },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique : true
    },
    questions: [
      {
        question: { type: String, required: true },
        type: {
          type: String,
          enum: ["Options", "Descriptive", "Yes/No", "multiplechoice"],
          required: true,
        },
        prefAns: [String],
        options: [String],
      },
    ],
    // status: {
    //   type: String,
    //   enum: ["unassigned", "assigned", "completed"],
    //   default: "unassigned",
    // },
    dateField: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      trim: true,
    },
    assignedTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        status: {
          type: String,
          enum: ["unassigned", "assigned", "completed"],
          default: "assigned",
        },
        statusUpdatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
      trim: true,
    },
    isDelete: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("question", questionSchema);
