const router = require("express").Router();
const {mysql2} = require("../../config/database");


const putUpdateStocksRouter =  async (req, res, next) => {

    try {
        const connection = await mysql2.promise().getConnection()

        const sqlUpdateProduct = `UPDATE stocks SET ? WHERE product_id = ?`;

        
        console.log(req.body.updatedProduct);
        const dataUpdateProduct = [req.body.updatedStocks, req.body.params.id]
        try {
           const result =  await connection.query(sqlUpdateProduct, dataUpdateProduct) 
           
            res.status(201).send({
                message: `Stock berhasil di update`,
                
            });

        } catch (error) {
            next(error)
        } 
    } catch (error) {
        next(error);
    }
};



router.put("/:productsId", putUpdateStocksRouter)


module.exports = router