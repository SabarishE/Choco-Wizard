const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  orderid: { type: String, required: true },
  totalprice: { type: Number, required: true },
  dispatch: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  summary: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
