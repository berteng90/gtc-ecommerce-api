const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
app.use(cors());
app.use("/gtc/user", userRouter);
app.use("/gtc/products", productRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
