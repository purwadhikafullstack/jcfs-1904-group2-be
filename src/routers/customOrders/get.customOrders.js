const router = require("express").Router();
const pool = require("../../config/database");


const getCustomOrderRouter =  async (req, res, next) => {

  const connection = await pool.promise().getConnection()

    try {
     
      const sqlGetOrder = `select * from custom_order ${req.query.status} ${req.query.sort} ${req.query.pages}`;
      const sqlCountOrder = `SELECT COUNT(*) AS count FROM custom_order ${req.query.status}`
  
      const [result] = await connection.query(sqlGetOrder);
      const [count] = await connection.query(sqlCountOrder)
     
      connection.release();
  
      res.status(200).send({result, count});
    } catch (error) {
      connection.release();
      next(error)
    }
  };


  const getCustomOrderByIdRouter =  async (req, res, next) => {

    const connection = await pool.promise().getConnection()

    try {
      
      const sqlGetOrder = `select * from custom_order where id = ${req.params.orderId};`;
      
  
      const [result] = await connection.query(sqlGetOrder );
     
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      connection.release();
      next(error)
    }
  };


  const getCustomOrderByUserIdRouter =  async (req, res, next) => {

    const connection = await pool.promise().getConnection()

    try {
        

      const sqlGetOrder = `select * from custom_order where user_id = ${req.params.userId} ${req.query.selectedStatus} ${req.query.sort} ${req.query.pages} ;`;
      const sqlCountOrder = `SELECT COUNT(*) AS count FROM custom_order where user_id = ${req.params.userId} ${req.query.selectedStatus}`
  
      const [result] = await connection.query(sqlGetOrder);
      const [count] = await connection.query(sqlCountOrder)
      connection.release();
  
      res.status(200).send({result, count});
    } catch (error) {
      connection.release();
      next(error)
    }
  };






router.get("/user/:userId", getCustomOrderByUserIdRouter)
router.get("/:orderId", getCustomOrderByIdRouter )
router.get("/", getCustomOrderRouter )

module.exports = router;