const express = require("express");
const router = express.Router();




const getAddressRouter = require('./get.address')
const postAddressRouter = require('./post.address')


router.use(postAddressRouter)
router.use(getAddressRouter)

module.exports = router;