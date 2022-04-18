const express = require("express");
const router = express.Router();

const getCustomOrderRouter = require("./get.customOrders")
const putCustomOrderRouter = require("./put.customOrders")




router.use(getCustomOrderRouter)
router.use(putCustomOrderRouter)

module.exports = router;