const router = require("express").Router();
const pool = require("../../config/database");




const getAddressByIdRouter =  async (req, res, next) => {
    try {

        const connection = await pool.promise().getConnection()

  
      const sqlGetAddress = `select * from address where user_id = ${req.params.userId} `
   
      const [result] = await connection.query(sqlGetAddress);
    
      
      connection.release();
  
      res.status(200).send(result );
    } catch (error) {
      next(error)
    }
  };


  const getSelectedAddressRouter =  async (req, res, next) => {
    try {

        const connection = await pool.promise().getConnection()

        
      const sqlGetAddress = `select * from address where id = ${req.query.value} `
   
      const [result] = await connection.query(sqlGetAddress);
    
      
      connection.release();
  
      res.status(200).send(result );
    } catch (error) {
      next(error)
    }
  };

  router.get("/selected", getSelectedAddressRouter)
  router.get("/:userId", getAddressByIdRouter)
 
  module.exports = router;
