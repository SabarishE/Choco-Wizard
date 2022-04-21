const express = require("express");

const Product = require("../models/productmodel.js");
const productRouter = express.Router();

// --- adding new product---

productRouter.post("/newproduct", async (req, res) => {
  console.log("body is >>>", req.body);

  try {
    const newproduct = new Product({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
    });

    await newproduct.save();
    res
      .status(200)
      .send({ newproduct, msg: "product added successfully !!!", flag: true });
  } catch (err) {
    res.status(500).send({ err, msg: "product addition failed", flag: false });
    console.log("error in adding new product", err);
  }
});

// ----updating existing product----

productRouter.patch("/updateproduct/:id", async (req, res) => {
  console.log("body is >>>", req.body);

  const { name, image, price, description } = req.body;

  Product.findOneAndUpdate(
    { _id: req.params.id },
    { name, image, price, description },
    { new: true, useFindAndModify: false }
  )

    .then((m) => {
      if (!m) {
        console.log("Error in updating product");
        return res
          .status(500)
          .send({ msg: "Error in updating product", flag: false });
      } else {
        res.send({
          msg: "product updated successfully !!!",
          afterupdate: m,
          flag: true,
        });
        console.log("product updated successfully !!!", m);
      }
    })
    .catch((err) => {
      console.log("Error in updating product >>>", err);
      return res
        .status(500)
        .send({ msg: "Error in updating product", error: err, flag: false });
    });
});

// ----deleting existing product----

productRouter.delete("/deleteproduct/:id", async (req, res) => {
  Product.findOneAndDelete({ _id: req.params.id })

    .then((m) => {
      if (!m) {
        console.log("Error in deleting product");
        return res
          .status(500)
          .send({ msg: "Error in deleting product", flag: false });
      } else {
        res.send({
          msg: "product deleted successfully !!!",
          DeletedProduct: m,
          flag: true,
        });
        console.log("product deleted successfully !!!", m);
      }
    })
    .catch((err) => {
      console.log("Error in deleting product >>>", err);
      return res
        .status(500)
        .send({ msg: "Error in deleting product", error: err, flag: false });
    });
});

// ---- fetching all products by ADMIN -----

productRouter.get("/allproducts/:email", async (req, res) => {
  try {
    if (req.params.email === "admin@chocowizard.com") {
      Product.find().then((result) =>
        res.status(200).send({
          msg: "all products are fetched successfully !!!",
          allproducts: result,
          flag: true,
        })
      );
    } else {
      res
        .status(500)
        .send({ flag: false, msg: "error in fetching all products !!!" });
    }
  } catch (err) {
    console.log("Error in fetching all product >>>", err);
    return res
      .status(500)
      .send({ msg: "Error in fetching all product", error: err, flag: false });
  }
});

module.exports = productRouter;
