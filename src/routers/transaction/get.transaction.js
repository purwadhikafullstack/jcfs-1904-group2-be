const router = require("express").Router();
const {mysql2} = require("../../config/database");

//Get all transaction
const getTransactionRouter =  async (req, res, next) => {
    try {
        const connection = await mysql2.promise().getConnection()

      
        const status = (req.query.status)
      
        const sqlGetTransactionByStatus = `select id, invoice, user_id, transactionStatus, totalPrice, created_at from transaction where transactionStatus = ?`
      
        const sqlGetTransaction = `select id, invoice, user_id, transactionStatus, totalPrice, created_at from transaction`;

      if (status) {
        const [result] = await connection.query(sqlGetTransactionByStatus, status);
        connection.release();
        res.status(200).send(result);
        
      } else {
        const [result] = await connection.query(sqlGetTransaction);
        connection.release();
        res.status(200).send(result);
        
      }
      
    } catch (error) {
      next(error)
    }
  };

//Get Completed transaction
  const getSumCompletedTransactionRouter =  async (req, res, next) => {
    try {
        const connection = await mysql2.promise().getConnection()

      const sqlGetTotalPrice = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete"`

      const sqlGetTotalPriceThirty = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete" and created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`

      const sqlGetTotalPriceSeven = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete" and created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);`

      const sqlGetTotalPriceToday = `select sum(totalPrice) AS total_revenue from transaction where transactionStatus = "complete" and created_at >= CURDATE();`

      const sqlGetDetailTransactionMonth = `select year(created_at) as year, MONTH(created_at) As month , sum(totalPrice) as total_revenue from transaction where transactionStatus = "complete" and created_at >= DATE_SUB(CURDATE(), INTERVAL ? month) group by year, month;`;

      const sqlGetDetailTransactionYear = `select year(created_at) as year, MONTH(created_at) As month , sum(totalPrice) as total_revenue from transaction where transactionStatus = "complete" and year(created_at) = ? group by year, month;`
     
      month = req.query.month
      year = req.query.yeardata
      
      

      const [sumResultAll] = await connection.query(sqlGetTotalPrice);
      const [sumResultThirty] = await connection.query(sqlGetTotalPriceThirty)
      const [sumResultSeven] = await connection.query(sqlGetTotalPriceSeven)
      const [sumResultToday] = await connection.query(sqlGetTotalPriceToday)

      if (year) {
        const [detailTransactionMonth] = await connection.query(sqlGetDetailTransactionYear, year)
        connection.release();
        res.status(200).send({sumResultAll, sumResultThirty, sumResultSeven, sumResultToday, detailTransactionMonth});

      } else {
        const [detailTransactionMonth] = await connection.query(sqlGetDetailTransactionMonth, month)
        connection.release();
        res.status(200).send({sumResultAll, sumResultThirty, sumResultSeven, sumResultToday, detailTransactionMonth});
      }

        
     
  
      
    } catch (error) {
      next(error)
    }
  };


  const getTransactionByIdRouter =  async (req, res, next) => {
    try {
        const connection = await mysql2.promise().getConnection()

      
      
        const sqlGetTransaction = `select id, invoice, user_id, transactionStatus, totalPrice, created_at from transaction where id = ?`;

      
        const [result] = await connection.query(sqlGetTransaction, req.params.transactionId);

        // console.log(result[0].user_id);

        sqlGetUser = `select * from users where id = ?`;

        const [user] = await connection.query(sqlGetUser, result[0].user_id )
        connection.release();
        res.status(200).send({result, user});
        
      
      
    } catch (error) {
      next(error)
    }
  };




  


  router.get("/completed", getSumCompletedTransactionRouter)
  router.get("/:transactionId", getTransactionByIdRouter)
  router.get("/", getTransactionRouter)

  module.exports = router;