const mongoose = require("mongoose");

const Schema = mongoose.Schema;


//define schema
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "What is the name of this transaction?"
    },
    value: {
      type: Number,
      required: "Enter the amount this transaction came to"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

//Create model from schema
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
