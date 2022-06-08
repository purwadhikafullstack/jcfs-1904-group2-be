const router = require("express").Router();
const pool = require("../../config/database");

//Get all transaction
const getTransactionRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try { 
    
    const sqlGetTransaction = `select id, invoice, user_id, transactionStatus, totalPrice, created_at from transaction ${req.query.date} ${req.query.status} ${req.query.keywordTransaction} ${req.query.isCustom} ${req.query.sortTransactions} ${req.query.pages}`;
    const sqlCountTransaction = `SELECT COUNT(*) AS count FROM transaction ${req.query.date} ${req.query.status} ${req.query.keywordTransaction} ${req.query.isCustom} ${req.query.sortTransactions} `;

    const [result] = await connection.query(sqlGetTransaction);
    const [count] = await connection.query(sqlCountTransaction);
    connection.release();
    res.status(200).send({ result, count });
  } catch (error) {
    connection.release();
    next(error);
  }
};

//Get Completed transaction
const getSumCompletedTransactionRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try {

    const sqlGetTotalPrice = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete"`;

    const sqlGetTotalPriceThirty = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete" and created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`;

    const sqlGetTotalPriceSeven = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete" and created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);`;

    const sqlGetTotalPriceToday = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete" and created_at >= CURDATE();`;

    const sqlGetDetailTransactionMonth = `select year(created_at) as year, MONTH(created_at) As month , sum(totalPrice) as total_revenue from transaction where transactionStatus = "complete" and created_at >= DATE_SUB(CURDATE(), INTERVAL ? month) group by year, month;`;

    const sqlGetDetailTransactionYear = `select year(created_at) as year, MONTH(created_at) As month , sum(totalPrice) as total_revenue from transaction where transactionStatus = "complete" and year(created_at) = ? group by year, month;`;

    month = req.query.month;
    year = req.query.yeardata;

    const [sumResultAll] = await connection.query(sqlGetTotalPrice);
    const [sumResultThirty] = await connection.query(sqlGetTotalPriceThirty);
    const [sumResultSeven] = await connection.query(sqlGetTotalPriceSeven);
    const [sumResultToday] = await connection.query(sqlGetTotalPriceToday);

    if (year) {
      const [detailTransactionMonth] = await connection.query(
        sqlGetDetailTransactionYear,
        year
      );
      connection.release();
      res
        .status(200)
        .send({
          sumResultAll,
          sumResultThirty,
          sumResultSeven,
          sumResultToday,
          detailTransactionMonth,
        });
    } else {
      const [detailTransactionMonth] = await connection.query(
        sqlGetDetailTransactionMonth,
        month
      );
      connection.release();
      res
        .status(200)
        .send({
          sumResultAll,
          sumResultThirty,
          sumResultSeven,
          sumResultToday,
          detailTransactionMonth,
        });
    }
  } catch (error) {
    connection.release();
    next(error);
  }
};

const getTransactionByIdRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();
  try {
    
    const sqlGetTransaction = `select id, invoice, user_id, transactionStatus, totalPrice, address_id, isByPresciption, created_at from transaction where id = ${req.params.transactionId}`;

    const [result] = await connection.query(sqlGetTransaction);
    
    sqlGetTransactionDetail = `select * from transactiondetail where transaction_id = ? ;`
    sqlGetCourier = `select * from courier where transaction_id = ?`
    sqlGetUser = `select * from users where id = ?`;
    sqlGetAddress = `select * from address where id = ?`
    

    const [transactiondetail] = await connection.query(sqlGetTransactionDetail, result[0].id)
    const [courier] = await connection.query(sqlGetCourier, result[0].id)
    const [user] = await connection.query(sqlGetUser, result[0].user_id);

   
   
    if (result[0].address_id) {
      const [address] = await connection.query(sqlGetAddress, result[0].address_id)
      connection.release();
      res.status(200).send({ result, user, address, transactiondetail, courier });
    } else {
      connection.release();
      res.status(200).send({ result, user, transactiondetail, courier});
    }
  
    
  } catch (error) {
    connection.release();
    next(error);
  }
};

// get transaction by Date
const getTransactionByDateRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try {

    const sqlGetTransactionByDate = `select sum(totalPrice) AS total_revenue from transaction ${req.query.date} and transactionStatus = 'complete' `;
    const sqlGetTransactionByMonth = `select sum(totalPrice) AS total_revenue, MONTH(created_at) As month, YEAR(created_at) As year from transaction ${req.query.date} and transactionStatus = 'complete' group by month order by created_at desc;`;

    const [result] = await connection.query(sqlGetTransactionByDate);
    const [month] = await connection.query(sqlGetTransactionByMonth);
    connection.release();

    res.status(200).send({ result, month });
  } catch (error) {
    connection.release();
    next(error);
  }
};

// Get transaction by year

const getTransactionByYearRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try {  

    const sqlGetTransactionTotal = `select sum(totalPrice) AS total_revenue from transaction ${req.query.year} and transactionStatus = 'complete' `;
    const sqlGetTransactionByYear = `select sum(totalPrice) AS total_revenue, YEAR(created_at) As year from transaction ${req.query.year} and transactionStatus = 'complete' group by year; `;

    const [result] = await connection.query(sqlGetTransactionByYear);
    const [total] = await connection.query(sqlGetTransactionTotal);
    connection.release();

    res.status(200).send({ result, total });
  } catch (error) {
    connection.release();
    next(error);
  }
};


//Get Transaction by user id

const getTransactionByUserIdRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try {
    
    const sqlGetTransaction = `select id, invoice, user_id, transactionStatus, totalPrice, address_id, isByPresciption, created_at from transaction where user_id = ${req.params.userId} ${req.query.keyword} ${req.query.status} ${req.query.sort} ${req.query.pages} `;
    const sqlCountTransaction = `SELECT COUNT(*) AS count FROM transaction where user_id = ${req.params.userId} ${req.query.keyword} ${req.query.status}`
    const [result] = await connection.query(sqlGetTransaction);
    const [count] = await connection.query(sqlCountTransaction)

    connection.release();

    res.status(200).send({result, count});
  
  
    
  } catch (error) {
    connection.release();
    next(error);
  }
};


router.get("/year", getTransactionByYearRouter);
router.get("/date", getTransactionByDateRouter);
router.get("/completed", getSumCompletedTransactionRouter);
router.get("/user/:userId", getTransactionByUserIdRouter)
router.get("/:transactionId", getTransactionByIdRouter);
router.get("/", getTransactionRouter);

module.exports = router;