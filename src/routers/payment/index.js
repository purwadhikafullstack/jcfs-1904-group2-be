const express = require("express");
const router = express.Router();




const getPaymentRouter = require('./get.payment')
const postPaymentRouter = require('./post.payment')

router.use(getPaymentRouter)
router.use(postPaymentRouter)

module.exports = router;