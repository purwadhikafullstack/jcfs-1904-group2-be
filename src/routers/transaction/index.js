const express = require("express");
const router = express.Router();

const getTransactionRouter = require("./get.transaction");
const postTransactionRouter = require("./post.transaction");
const putTransactionRotuer = require("./put.transaction")

router.use(postTransactionRouter);
router.use(getTransactionRouter);
router.use(putTransactionRotuer)
module.exports = router;
