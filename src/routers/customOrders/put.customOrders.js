const router = require("express").Router();
const pool = require("../../config/database");




const putCustomOrderRouter =  async (req, res, next) => {

    const connection = await pool.promise().getConnection();
    
    try {
        
        ;
        const sqlRejected = `UPDATE custom_order SET status = 'rejected', isApproved = 1 WHERE id = ${req.body.params.id}`;
        const sqlApproved = `UPDATE custom_order SET status = 'approved', isApproved = 1 WHERE id = ${req.body.params.id}`;
        const sqlCancel = `UPDATE custom_order SET status = 'waiting', isApproved = 0 WHERE id = ${req.body.params.orderId} `


        if (req.body.params.cancel) {
            const [result] = await connection.query(sqlCancel);
            connection.release();
            res.status(200).send(result);
        } else if (!req.body.params.isApproved) {
            const [result] = await connection.query(sqlRejected);
            connection.release();
            res.status(200).send(result);    
        } else {
            const [result] = await connection.query(sqlApproved);
            connection.release();
            res.status(200).send(result);
        }
      
  
      
    } catch (error) {
        connection.release();
        next(error)
    }
   
};



router.put("/:orderId", putCustomOrderRouter)

module.exports = router;