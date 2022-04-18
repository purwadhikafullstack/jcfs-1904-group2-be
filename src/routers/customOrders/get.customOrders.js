const router = require("express").Router();
const {mysql2} = require("../../config/database");



const getCustomOrderRouter =  async (req, res, next) => {
    try {
        const connection = await mysql2.promise().getConnection()
  
      const sqlGetOrder = `select * from custom_order where status = 'waiting';`;
      
  
      const [result] = await connection.query(sqlGetOrder);
     
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      next(error)
    }
  };


  const getCustomOrderByIdRouter =  async (req, res, next) => {
    try {
        const connection = await mysql2.promise().getConnection()
  
      const sqlGetOrder = `select * from custom_order where id = ${req.params.orderId};`;
      
  
      const [result] = await connection.query(sqlGetOrder );
     
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      next(error)
    }
  };





  router.get("/:orderId", getCustomOrderByIdRouter )
router.get("/", getCustomOrderRouter )

module.exports = router;