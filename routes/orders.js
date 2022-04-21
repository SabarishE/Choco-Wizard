const express = require("express");
const stripe = require("stripe")(
  "sk_test_51JpwLUSAlzxtYem5dPLsKsY9JlVzRr433hpuB2mydIjwejrewUrUc3t2QgsHWCDe7LcfNBDh6nqMki98vBrf8GgK00rzypY889"
);
const { v4: uuidv4 } = require("uuid");

const auth = require("../middleware/auth.js");
const Order = require("../models/ordermodel.js");
const orderRouter = express.Router();

// ---Making payment with STRIPE---

orderRouter.post("/payment", (req, res) => {
  // ---getting product and token from client
  const { finalCart, token } = req.body;
  const totalprice = finalCart[finalCart.length - 1].totalprice;
  console.log("final finalCart is  >>>", finalCart);
  console.log("token is >>>", token);
  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
      name: token.card.name,
      address: token.address,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: totalprice * 100,
          currency: "inr",
          customer: customer.id,
          description: "your purchase",
        },
        { idempotencyKey }
      );

      res.status(200).send({ flag: true });
    })
    .catch((err) => {
      console.log("error in payment >>>", err);
      res.status(500).send({ flag: false });
    });
});

// ---recording the order in DB after successfull payment---

orderRouter.post("/neworder", async (req, res) => {
  console.log("body is >>>", req.body);

  const body = req.body;

  try {
    const neworder = new Order(body);

    await neworder.save();
    res
      .status(200)
      .send({ neworder, flag: true, msg: "order made successfully !!!" });
  } catch (err) {
    res.status(500).send({ err, msg: "order addition failed", flag: false });
    console.log("error in adding new order", err);
  }
});

// --- dispatching  the product by admin---

orderRouter.patch("/dispatch/:id", async (req, res) => {
  Order.findOneAndUpdate(
    { _id: req.params.id },
    { dispatch: true },
    { new: true, useFindAndModify: false }
  )

    .then((m) => {
      if (!m) {
        console.log("Error in updating order");
        return res
          .status(500)
          .send({ msg: "Error in updating order", flag: false });
      } else {
        res.send({
          msg: "order updated successfully !!!",
          afterupdate: m,
          flag: true,
        });
        console.log("order updated successfully !!!", m);
      }
    })
    .catch((err) => {
      console.log("Error in updating order >>>", err);
      return res
        .status(500)
        .send({ msg: "Error in updating order", error: err, flag: false });
    });
});

// --- accessing individual customer specific  orders using email----

orderRouter.get("/myorders/:email", async (req, res) => {
  try {
    const myorders = await Order.find({ email: req.params.email });

    if (myorders.length > 0) {
      console.log("my orders are fetched ", myorders);
      res.status(200).send({
        myorders,
        msg: "my orders are fetched successfully",
        flag: true,
      });
    } else {
      console.log("no orders were made");
      res.status(200).send({ msg: "no orders were made", flag: true });
    }
  } catch (err) {
    console.log("Error in fetching my orders");
    res
      .status(500)
      .send({ msg: "Error in fetching my orders", Error: err, flag: false });
  }
});

// ----- accessing all orders by ADMIN -----

// orderRouter.get("/allorders/:email", auth, async (req, res) => {

orderRouter.get("/allorders/:email", async (req, res) => {
  try {
    if (req.params.email !== "admin@chocowizard.com") {
      console.log("access denied");
      return res.status(403).send({ msg: "access forbidden" });
    }
    const Allorders = await Order.find();

    if (Allorders.length > 0) {
      console.log("all orders are fetched ", Allorders);
      res.status(200).send({
        Allorders,
        msg: "all orders are fetched successfully",
        flag: true,
      });
    } else {
      console.log("no orders were made");
      res.status(200).send({ msg: "no orders were made", flag: true });
    }
  } catch (err) {
    console.log("Error in fetching all orders");
    res
      .status(500)
      .send({ msg: "Error in fetching all orders", Error: err, flag: false });
  }
});

module.exports = orderRouter;
