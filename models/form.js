const mongoose = require("mongoose");

const formSchema = mongoose.Schema(
  {
    compId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    locId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "location",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    questionId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "question",
    },
    assignUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["assigned", "completed"],
      default: "assigned",
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      trim: true,
    },
    formData: [
      {
        question: {
          type: String,
          trim: true,
        },
        // text: {
        //   type: String,
        //   required: true,
        //   trim: true,
        // },
        type: {
          type: String,
          enum: ["Options", "Descriptive", "Yes/No", "multiplechoice"],
          default: "Descriptive",
        },

        prefAns: {
          type: Array,
          // trim: true,
        },
        options: [String],
        answer: [String],
        attachment: {
          type: String,
          trim: true,
        },
        remark: {
          type: String,
          trim: true,
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    isDelete: {
      type: Number,
      enum: [1, 0],
      default: 0,
      trim: true,
    },
    dateField: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("form", formSchema);
