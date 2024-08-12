const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSummarySchema = new Schema(
  {
    payment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Payment",
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "completed"],
      required: true,
    },
    previousData: {
      type: Object,
      default: null,
    },
    updatedData: {
      type: Object,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PaymentSummary = mongoose.model("PaymentSummary", paymentSummarySchema);
module.exports = PaymentSummary;
