const router = require("express").Router();
const {mysql2} = require("../../config/database");




const putCustomOrderRouter =  async (req, res, next) => {

    try {
        const connection = await mysql2.promise().getConnection();
        
        const sqlRejected = `UPDATE custom_order SET status = 'rejected' WHERE id = ${req.body.params.id}`;
        const sqlApproved = `UPDATE custom_order SET status = 'approved' WHERE id = ${req.body.params.id}`;

        if (!req.body.params.isApproved) {
            const [result] = await connection.query(sqlRejected,  );
            connection.release();
            res.status(200).send(result);
            
        } else {
            const [result] = await connection.query(sqlApproved );
            connection.release();
            res.status(200).send(result);
            
        }
      
  
      
    } catch (error) {
      next(error)
    }
   
};



router.put("/:orderId", putCustomOrderRouter)

module.exports = router;