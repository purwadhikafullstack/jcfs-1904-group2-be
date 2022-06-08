const router = require("express").Router();
const pool = require("../../config/database");




const getStocksRouter =  async (req, res, next) => {

    const connection = await pool.promise().getConnection()

    try {
        
      const sqlGetStocks = "select * from stocks WHERE product_id = ?";
     
      const [result] = await connection.query(sqlGetStocks, req.params.productsId);
    

      const {qtyBoxAvailable, qtyBoxTotal, qtyBottleAvailable, qtyBottleTotal, qtyMlAvailable, qtyMlTotal, qtyStripsavailable, qtyStripsTotal, qtyMgAvailable, qtyMgTotal } = result[0]

      const stockLiquid = qtyBottleAvailable + (qtyBoxAvailable * 10)
      const stockNonLiquid = qtyStripsavailable + (qtyBoxAvailable * 10)

      calculatedStock = {stockLiquid, stockNonLiquid}

      res.status(200).send({calculatedStock, result});
      connection.release();
    } catch (error) {
      connection.release();
      next(error)
    }
  };

// GEt stock detail by id


const getStocksDetailRouter =  async (req, res, next) => {

  const connection = await pool.promise().getConnection()

  try {

    const sqlGetStocks = "select * from stocks WHERE product_id = ?";

    const sqlGetLog = `select * from data_logging where product_id = ${req.params.productsId} ${req.query.filter} ${req.query.date} ${req.query.sort}`

    const sqlGetLogDetail = `select sum(stock_in) as total_stock_in, sum(stock_out) as total_stock_out from data_logging where product_id = ${req.params.productsId} ${req.query.filter} ${req.query.date}`




    const [detail] = await connection.query(sqlGetLogDetail)
    const [data] = await connection.query(sqlGetLog)
    const [result] = await connection.query(sqlGetStocks, req.params.productsId);


    const {qtyBoxAvailable, qtyBoxTotal, qtyBottleAvailable, qtyBottleTotal, qtyMlAvailable, qtyMlTotal, qtyStripsavailable, qtyStripsTotal, qtyMgAvailable, qtyMgTotal } = result[0]

    const stockLiquid = qtyBottleAvailable + (qtyBoxAvailable * 10)
    const stockNonLiquid = qtyStripsavailable + (qtyBoxAvailable * 10)

    calculatedStock = {stockLiquid, stockNonLiquid}

    res.status(200).send({calculatedStock, result, data, detail});
    connection.release();
  } catch (error) {
    connection.release();
    next(error)
  }
};


  
  router.get("/detail/:productsId", getStocksDetailRouter)
  router.get("/:productsId", getStocksRouter, )

  module.exports = router;
