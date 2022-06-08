const router = require("express").Router();
const pool = require("../../config/database");




//Update quantity
const putUpdateQuantityRouterByProduct =  async (req, res, next) => {

  const connection = await pool.promise().getConnection()

    try {    
       
      const totalPrice = ( req.body.params.price * req.body.params.productQuantity)

      const sqlPutQuantity = `UPDATE cart SET productQuantity = ${req.body.params.productQuantity}, totalPrice = ${totalPrice} WHERE id = ${req.body.params.id}`;
      
     
      const [result] = await connection.query(sqlPutQuantity);
      
      connection.release();
        
      res.status(200).send(result);
    } catch (error) {
      connection.release();
      next(error)
    }
  };


  const putDeleteRouterByProduct =  async (req, res, next) => {

    const connection = await pool.promise().getConnection()

    try {
        
      const sqlPutDelete = `UPDATE cart SET isActive = 0 WHERE id = ${req.body.params.id}`;
     
      const [result] = await connection.query(sqlPutDelete);
      
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      connection.release();
      next(error)
    }
  };


  const putEmptyCartRouter =  async (req, res, next) => {

    const connection = await pool.promise().getConnection()

    try {    

        
      const sqlPutDelete = `UPDATE cart SET isActive = 0 WHERE user_id = ${req.body.params.userId}`;
     
      const [result] = await connection.query(sqlPutDelete);
      
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      connection.release();
      next(error)
    }
  };

  router.put("/delete", putEmptyCartRouter)
  router.put("/quantity/:id", putUpdateQuantityRouterByProduct)
  router.put("/delete/:id", putDeleteRouterByProduct)
  module.exports = router;