const mongoose = require("mongoose");
const sequencing = require("./sequencing");

const locationSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      trim: true,
    },  
    locName: {
      type: String,
      trim: true,
    },
    locationCode: {
      type: String,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    postCode: {
      type: String,
      trim: true,
    },
    toMail: {
      type: String,
      trim: true,
    },
    ccMail: {
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

locationSchema.pre("save", function (next) {
  sequencing
    .getSequenceNextValue("location_counter")
    .then((counter) => {
      this.count = counter;
      next();
    })
    .catch((error) => next(error));
});

module.exports = mongoose.model("location", locationSchema);
