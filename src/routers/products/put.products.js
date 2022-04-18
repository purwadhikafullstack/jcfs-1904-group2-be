const router = require("express").Router();
const {mysql2} = require("../../config/database");

const putDeleteRouter =  async (req, res, next) => {

    try {
        const connection = await mysql2.promise().getConnection()

        const sqlDelete = `UPDATE products SET isDeleted = 1 WHERE id = ${req.body.id}`;

       

        try {
           const result =  await connection.query(sqlDelete) 
           
            res.status(201).send({
                message: `Produk berhasil di soft delete`,
                
            });

        } catch (error) {
            next(error)
        } 
    } catch (error) {
        next(error);
    }
};

const putUndeleteRouter =  async (req, res, next) => {

    try {
        const connection = await mysql2.promise().getConnection()

        const sqlUndelete = `UPDATE products SET isDeleted = 0 WHERE id = ${req.body.id}`;
        
       
        try {
           const result =  await connection.query(sqlUndelete) 
           
            res.status(201).send({
                message: `Produk berhasil di un-delete`,
                
            });

        } catch (error) {
            next(error)
        } 
    } catch (error) {
        next(error);
    }
};


const putUpdateProductRouter =  async (req, res, next) => {

    try {
        const connection = await mysql2.promise().getConnection()

        const sqlUpdateProduct = `UPDATE products SET ? WHERE id = ?`;
        
        
        const dataUpdateProduct = [req.body.updatedProduct, req.body.params.id]
        try {
           const result =  await connection.query(sqlUpdateProduct, dataUpdateProduct) 
           
            res.status(201).send({
                message: `Produk berhasil di update`,
                
            });

        } catch (error) {
            next(error)
        } 
    } catch (error) {
        next(error);
    }
};


router.put("/undelete", putUndeleteRouter)
router.put("/:productsId", putUpdateProductRouter)
router.put("/", putDeleteRouter)


module.exports = router