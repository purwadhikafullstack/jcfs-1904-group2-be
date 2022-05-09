require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.API_PORT;
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const stocksRouter = require("./src/routers/stocks");
const userRouter = require("./src/routers/users");
const productRouter = require("./src/routers/products");
const categoriesRouter = require("./src/routers/categories");
const transactionRouter = require("./src/routers/transaction");
const transactiondetailRouter = require("./src/routers/transactionDetails");
const customordersRouter = require("./src/routers/customOrders/");
const dataLogRouter = require("./src/routers/dataLog")
const cartRouter = require("./src/routers/cart")
const addressRouter = require("./src/routers/address")
const paymentRouter = require("./src/routers/payment")
const rajaOngkirRouter = require("./src/routers/rajaOngkir")

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));


app.use("/rajaongkir", rajaOngkirRouter )
app.use("/transaction", transactionRouter);
app.use("/payment", paymentRouter)
app.use("/customorders", customordersRouter);
app.use("/transactiondetails", transactiondetailRouter);
app.use("/stocks", stocksRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productRouter);
app.use("/datalog", dataLogRouter)
app.use("/users", userRouter);
app.use("/cart", cartRouter)
app.use("/address", addressRouter)
app.get("/", (req, res) => {
  res.status(200).send("API IS RUNNING");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send({
    status: "ERROR",
    message: error.message,
    data: error,
  });
});

app.listen(port, (err) => {
  if (err) return cosole.log({ err });

  console.log(`API IS RUNNING AT PORT ${port}`);
});
