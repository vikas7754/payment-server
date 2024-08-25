const Payment = require("../models/payment");
const PaymentSummary = require("../models/summary");

const addPayment = async (req, res) => {
  try {
    const { name, amount, date, description, rate, type } = req.body;
    const newPayment = new Payment({
      name,
      amount,
      date,
      description,
      user: req.user._id,
      type,
      rate,
    });
    const payment = await newPayment.save();
    const newSummary = new PaymentSummary({
      payment: newPayment._id,
      action: "created",
      user: req.user._id,
      updatedData: newPayment,
    });
    await newSummary.save();
    return res.status(200).json(payment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { name, amount, date, description, status, rate, type } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const query = {};
    if (name) query.name = name;
    if (amount) query.amount = amount;
    if (date) query.date = date;
    if (description) query.description = description;
    if (status) query.status = status;
    if (rate) query.rate = rate;
    if (type) query.type = type;

    const updatedData = await Payment.findByIdAndUpdate(req.params.id, query, {
      new: true,
    });

    const newSummary = new PaymentSummary({
      payment: payment._id,
      action: "updated",
      user: req.user._id,
      previousData: payment,
      updatedData,
    });
    await newSummary.save();

    return res.status(200).json(updatedData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const updatedData = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status: "deleted",
      },
      { new: true }
    );

    const newSummary = new PaymentSummary({
      payment: payment._id,
      action: "deleted",
      user: req.user._id,
      previousData: payment,
      updatedData,
    });
    await newSummary.save();

    return res.status(200).json({ message: "Payment deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const completePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    const updatedData = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
      },
      { new: true }
    );

    const newSummary = new PaymentSummary({
      payment: payment._id,
      action: "completed",
      user: req.user._id,
      previousData: payment,
      updatedData,
    });
    await newSummary.save();

    return res.status(200).json({ message: "Payment completed successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPayments = async (req, res) => {
  const { status } = req.query;
  try {
    const query = {};
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query);

    return res.status(200).json({ payments });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPaymentSummary = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const summaries = await PaymentSummary.find()
      .populate("payment")
      .populate("user")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PaymentSummary.countDocuments();
    return res.status(200).json({ summaries, total });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json(payment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addPayment,
  updatePayment,
  deletePayment,
  completePayment,
  getPayments,
  getPaymentSummary,
  getPaymentById,
};
