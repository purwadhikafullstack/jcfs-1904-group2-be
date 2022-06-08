require("dotenv").config();
const router = require("express").Router();
const { verify } = require("../../services/token");
const pool = require("../../config/database");

const getUserRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();
  
  try {
   

    const sqlGetAllUser =
      "select id, username, gender, email, password, role from users;";

    const [result] = await connection.query(sqlGetAllUser);
    connection.release();

    res.status(200).send(result);
  } catch (error) {
    connection.release();
    next(error);
  }
};

const getVerifyRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try {

    const verifiedToken = verify(req.query.token);

    const sqlUpdateVerify = "UPDATE users SET isVerified = true WHERE id = ?";
    const dataVerify = verifiedToken.id;

    const [result] = await connection.query(sqlUpdateVerify, dataVerify);
    connection.release();

    res.status(200).send(`<h1> Verification Success </h1> <br><a href="http://localhost:3000/login">Log in here</a>`  );
  } catch (error) {
    connection.release();
    next(error);
  }
};

//Get User by Id
const getUserByIdRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try {
   
    const sqlGetUserById =
      "SELECT id, username, name, age, gender, email, photo from users WHERE id = ?";
    const [result] = await connection.query(sqlGetUserById, req.params.id);
    connection.release();

    res.status(200).send(result);
  } catch (error) {
    connection.release();
    next(error);
  }
};


// Get All User
const getUserRouterAdmin =  async (req, res, next) => {

  const connection = await pool.promise().getConnection()

    try {
  
      const sqlGetAllUser = `select row_number() over() as rownumber, id, username, name, gender, email, password, role from users where role = "user" ${req.query.keywordUser} ${req.query.sortUser} ${req.query.pages};`;
      const sqlCountUser = `SELECT COUNT(*) AS user_count FROM users where role = "user";`;
  
      const [result] = await connection.query(sqlGetAllUser);
      const [userCount] = await connection.query(sqlCountUser)
      connection.release();
  
      res.status(200).send({result, userCount});
    } catch (error) {
      connection.release();
      next(error)
    }
  };


  const getUserbyIdRouterAdmin =  async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection()

     
  
      const sqlGetUserById = `select id, username, name, gender, photo, email, password, role from users where id = ${req.params.UserId};`;

      const sqlGetTransactionByUserId = `select id, invoice, user_id, transactionStatus, totalPrice, created_at from transaction where user_id = ? ${req.query.pages}`;
      const sqlCountTransaction = `SELECT COUNT(*) AS count FROM transaction where user_id = ?;`
      const [result] = await connection.query(sqlGetUserById);
      const [count] = await connection.query(sqlCountTransaction, result[0].id)
      const [transaction] = await connection.query(sqlGetTransactionByUserId, result[0].id)
      
      
      connection.release();
  
      res.status(200).send({result, transaction, count});
    } catch (error) {
      connection.release();
      next(error)
    }
  };

  router.get("/", getUserRouter);
  router.get("/verify", getVerifyRouter);
  router.get("/admin", getUserRouterAdmin)
  router.get("/admin/:UserId", getUserbyIdRouterAdmin)
  router.get("/:id", getUserByIdRouter);

  module.exports = router;