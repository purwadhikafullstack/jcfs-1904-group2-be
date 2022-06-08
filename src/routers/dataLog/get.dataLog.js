const router = require("express").Router();
const pool = require("../../config/database");


const getDataLogRouter = async (req, res, next) => {

    const connection = await pool.promise().getConnection();

    try {
      
      const sqlGetDataLog = `select products.id, products.productName, data_logging.stock_in, data_logging.stock_out, data_logging.status, data_logging.created_at, data_logging.username from products inner join data_logging on products.id=product_id ${req.query.filterData} ${req.query.sortData} ${req.query.pages}`;
      const sqlCountDataLog = `SELECT COUNT(*) AS count FROM data_logging `;
  
      const [result] = await connection.query(sqlGetDataLog);
      const [count] = await connection.query(sqlCountDataLog);
      connection.release();
      res.status(200).send({ result, count });
    } catch (error) {
      connection.release();
      next(error);
    }
  };



  router.get("/", getDataLogRouter);

module.exports = router;
