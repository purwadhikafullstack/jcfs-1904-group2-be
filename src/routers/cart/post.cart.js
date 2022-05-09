const router = require("express").Router();
const pool = require("../../config/database");




const postProductToCart =  async (req, res, next) => {
    try {

        const connection = await pool.promise().getConnection()
       
        const totalPrice = req.body.params.product.price * req.body.params.productQuantity

        const sqlPostCart = "INSERT INTO cart SET ?";

        const dataProduct = [
            {
              user_id: req.body.params.userId,
              product_id: req.body.params.product.id,
              price: req.body.params.product.price,
              productQuantity: req.body.params.productQuantity,
              totalPrice: totalPrice,
              isActive: 1,
              isCustom: req.body.params.isCustom,
            },
          ];
    
     
     
        const [result] = await connection.query(sqlPostCart, dataProduct);
      
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      next(error)
    }
  };



  router.post("/", postProductToCart);


module.exports = router;
