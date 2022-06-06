require("dotenv").config()
const express = require("express")
const app = express();

app.use(express.json());

const userRouter = require("./routes/user");
const transactionRouter = require("./routes/transaction");

app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
