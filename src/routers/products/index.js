const express = require("express");
const router = express.Router();

const getProductRouter = require("./get.products");
const postProductRouter = require("./post.products");
const putDeleteRouter = require("./put.products");
const putUndeleteRouter = require("./put.products");
const putUpdateProductRouter = require("./put.products");

router.use(putUpdateProductRouter);
router.use(putDeleteRouter);
router.use(putUndeleteRouter);
router.use(getProductRouter);
router.use(postProductRouter);

module.exports = router;
