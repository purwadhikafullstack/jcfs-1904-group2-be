const express = require("express");
const router = express.Router();


const getTransactionRouter = require("./get.transaction")
const getCompletedTransactiontodayRouter = require("./get.transaction")
const postTransactionRouter = require("./post.transaction")


router.use(postTransactionRouter)
router.use(getTransactionRouter)
router.use(getCompletedTransactiontodayRouter)


module.exports = router;