const router = require("express").Router();
const pool = require("../../config/database");

//Get Categories

const getCategoriesRouter = async (req, res, next) => {
  
  const connection = await pool.promise().getConnection();

  try {  

    const sqlGetCategories = "select id, categoryName from category";

    const [result] = await connection.query(sqlGetCategories);
    connection.release();

    res.status(200).send(result);
  } catch (error) {
    connection.release();
    next(error);
  }
};

router.get("/", getCategoriesRouter);

module.exports = router;