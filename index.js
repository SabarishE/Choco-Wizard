const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
// --routers--

const userRouter = require("./routes/accounts.js");
const orderRouter = require("./routes/orders.js");
const productRouter = require("./routes/products.js");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Choco-wizard backend test success");
});

const url = process.env.MONGODB_URI || "mongodb://localhost/chocowizardDB";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const con = mongoose.connection;

con.on("open", () => console.log("MongoDB is connected"));

app.use("/accounts", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

app.listen(PORT, () => console.log("server is 🚀 on", PORT));
