const router = require("express").Router();
const pool = require("../../config/database");


const getCartRouter =  async (req, res, next) => {
  
  const connection = await pool.promise().getConnection()

    try {
  
      const sqlGetCart = `select products.id as product_id, products.productIMG, products.productName, products.category_id, products.productDetails, products.price, products.isLiquid, cart.id, cart.productQuantity, cart.user_id, cart.totalPrice, cart.isCustom, cart.isActive from products inner join cart on products.id=product_id where user_id = ${req.query.userId} and isActive = 1 ${req.query.custom}`
      const sqlCountCart = `SELECT sum(totalPrice) AS subtotal FROM cart  where user_id = ${req.query.userId} and isActive = 1 ${req.query.custom};`
     
      const [result] = await connection.query(sqlGetCart);
      const [count] = await connection.query(sqlCountCart)
      
      connection.release();
  
      res.status(200).send({result , count});
    } catch (error) {
      connection.release();
      next(error)
    }
  };


  router.get("/", getCartRouter)
 
  module.exports = router;
