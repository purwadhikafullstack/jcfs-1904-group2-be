const express = require("express");
const router = express.Router();


const postCustomOrderRouter = require("./post.customOrders")
const getCustomOrderRouter = require("./get.customOrders")
const putCustomOrderRouter = require("./put.customOrders")




router.use(getCustomOrderRouter)
router.use(putCustomOrderRouter)
router.use(postCustomOrderRouter)

module.exports = router;