const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const transactionRouter = require("./routes/transactionRoute");
const paymentRouter = require("./routes/paymentRoutes");

app.use(cors());
app.use(express.json());
app.use("/gtc/user", userRouter);
app.use("/gtc/products", productRouter);
app.use("/gtc/transact", transactionRouter);
app.use("/gtc/payment", paymentRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
