const router = require("express").Router();
const pool = require("../../config/database");




const getPaymentRouter =  async (req, res, next) => {
    try {
        const connection = await pool.promise().getConnection()

  
      const sqlGetAddress = `select * from payment `
   
      const [result] = await connection.query(sqlGetAddress);
    
      
      connection.release();
  
      res.status(200).send(result );
    } catch (error) {
      next(error)
    }
  };

  const getSelectedPaymentRouter =  async (req, res, next) => {
    try {

        const connection = await pool.promise().getConnection()

  
      const sqlGetAddress = `select * from payment where bank like '%${req.query.selected}%'`

    
   
      const [result] = await connection.query(sqlGetAddress);
    
      
      connection.release();
  
      res.status(200).send(result );
    } catch (error) {
      next(error)
    }
  };



  const getPaymentProofRouter =  async (req, res, next) => {
    try {

    

      const connection = await pool.promise().getConnection()

  
      const sqlGetPaymentProof = `select * from payment_proof where transaction_id = ${req.query.transactionId} `
   
      const [result] = await connection.query(sqlGetPaymentProof);
    
      
      connection.release();
  
      res.status(200).send(result );
    } catch (error) {
      next(error)
    }
  };

  router.get("/paymentproof/:transactionId", getPaymentProofRouter)
  router.get("/selected", getSelectedPaymentRouter)
  router.get("/", getPaymentRouter)
 
  module.exports = router;

