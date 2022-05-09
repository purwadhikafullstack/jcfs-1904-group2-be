const express = require("express");
const router = express.Router();

const getDataLogRouter = require("./get.dataLog");



router.use(getDataLogRouter);

module.exports = router;