const express = require("express");
const router = express.Router();

const getStocksRouter = require("./get.stocks")
const postStocksRouter = require("./post.stocks")
const putUpdateStocksRouter = require('./put.stocks')

router.use(putUpdateStocksRouter)
router.use(getStocksRouter)
router.use(postStocksRouter)

module.exports = router;