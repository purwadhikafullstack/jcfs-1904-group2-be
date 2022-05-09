const express = require("express");
const router = express.Router();

const getCartRouter =  require('./get.cart')
const putCartRouter = require('./put.cart')
const postCartRouter = require('./post.cart')

router.use(getCartRouter)
router.use(putCartRouter)
router.use(postCartRouter)

module.exports = router;