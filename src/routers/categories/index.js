const express = require("express");
const router = express.Router();

const getCategoriesRouter =  require('./get.categories.js')

router.use(getCategoriesRouter)


module.exports = router;