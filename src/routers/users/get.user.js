require("dotenv").config();
const router = require("express").Router();
const { verify } = require("../../services/token");
const pool = require("../../config/database");

const getUserRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetAllUser =
      "select id, username, gender, email, password, role from users;";

    const [result] = await connection.query(sqlGetAllUser);
    connection.release();

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const getVerifyRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const verifiedToken = verify(req.query.token);

    const sqlUpdateVerify = "UPDATE users SET isVerified = true WHERE id = ?";
    const dataVerify = verifiedToken.id;

    const [result] = await connection.query(sqlUpdateVerify, dataVerify);
    connection.release();

    res.status(200).send(`<h1> Verification Success </h1>`);
  } catch (error) {
    next(error);
  }
};

//Get User by Id
const getUserByIdRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();
    const sqlGetUserById =
      "SELECT id, username, fullName, age, gender, address, email, photo from users WHERE id = ?";
    const [result] = await connection.query(sqlGetUserById, req.params.id);
    connection.release();

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const getUserbyIdRouterAdmin = async (req, res, next) => {
  try {
    const connection = await mysql2.promise().getConnection();

    const sqlGetUserById = `select id, username, name, gender, photo, email, password, role from users where id = ?;`;

    const sqlGetTransactionByUserId = `select id, invoice, user_id, transactionStatus, totalPrice, created_at from transaction where user_id = ?`;

    const [result] = await connection.query(sqlGetUserById, req.params.UserId);

    const [transaction] = await connection.query(
      sqlGetTransactionByUserId,
      result[0].id
    );

    connection.release();

    res.status(200).send({ result, transaction });
  } catch (error) {
    next(error);
  }
};

router.get("/", getUserRouter);
router.get("/verify", getVerifyRouter);
router.get("/:id", getUserByIdRouter);
// router.get("/:UserId", getUserbyIdRouterAdmin)

module.exports = router;
