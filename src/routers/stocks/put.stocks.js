const router = require("express").Router();
const pool = require("../../config/database");

const putUpdateStocksRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();
    await connection.beginTransaction();

    try {
      const sqlUpdateProduct = `UPDATE stocks SET ? WHERE product_id = ?`;

      const dataUpdateProduct = [req.body.updatedStocks, req.body.params.id];
      const result = await connection.query(
        sqlUpdateProduct,
        dataUpdateProduct
      );

      res.status(201).send({
        message: `Stock berhasil di update`,
      });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    connection.rollback();
    next(error);
  }
};

router.put("/:productsId", putUpdateStocksRouter);

module.exports = router;
