const router = require("express").Router();
const {mysql2} = require("../../config/database");




const getStocksRouter =  async (req, res, next) => {
    try {
        const connection = await mysql2.promise().getConnection()
  
      const sqlGetStocks = "select * from stocks WHERE product_id = ?";
  
     
      const [result] = await connection.query(sqlGetStocks, req.params.productsId);
      connection.release();

      const {qtyBoxAvailable, qtyBoxTotal, qtyBottleAvailable, qtyBottleTotal, qtyMlAvailable, qtyMlTotal, qtyStripsavailable, qtyStripsTotal, qtyMgAvailable, qtyMgTotal } = result[0]

      const stockLiquid = qtyBottleAvailable + (qtyBoxAvailable * qtyBottleTotal)
      const stockNonLiquid = qtyStripsavailable + (qtyBoxAvailable * qtyStripsTotal)

      calculatedStock = {stockLiquid, stockNonLiquid}

      res.status(200).send({calculatedStock, result});
    } catch (error) {
      next(error)
    }
  };


  

  router.get("/:productsId", getStocksRouter, )

  module.exports = router;