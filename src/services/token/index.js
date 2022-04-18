// Agat dapat mengakses variable pada file.env
require("dotenv").config();
const jwt = require("jsonwebtoken");
const key = process.env.JWT_KEY;

const sign = (data) => {
  const token = jwt.sign(data, key);
  return token;
};

const verify = (data) => {
  const verifyToken = jwt.verify(data, key);
  return verifyToken;
};

module.exports = { sign, verify };
