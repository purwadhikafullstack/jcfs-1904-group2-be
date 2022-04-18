const express = require("express");
const router = express.Router();


const getTransactionDetailRouter = require("./get.transactionDetails")



router.use(getTransactionDetailRouter)



module.exports = router;