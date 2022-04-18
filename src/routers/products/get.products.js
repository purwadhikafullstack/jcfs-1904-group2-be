const router = require("express").Router();
const pool = require("../../config/database");

//Get All Product

const getProductRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetProducts = `select id, category_id, productName, productDetails, productIMG, isLiquid, price from products where isDeleted = 0 ${req.query.keyword} ${req.query.sort} ${req.query.pages}`;
    const sqlCountProducts = `SELECT COUNT(*) AS count FROM products where isDeleted = 0;`;
    const sqlGetProductsCategory = `select id, category_id, productName, productDetails, productIMG, isLiquid, price from products where category_id = ? && isDeleted = 0 ${req.query.keyword}${req.query.sort} ${req.query.pages}`;
    const sqlCountProductsCategory = `SELECT COUNT(*) AS count FROM products where category_id = ? && isDeleted = 0`;
    const category_id = req.query.category;

    if (category_id) {
      const [result] = await connection.query(
        sqlGetProductsCategory,
        category_id
      );
      const [count] = await connection.query(
        sqlCountProductsCategory,
        category_id
      );
      connection.release();
      res.status(200).send({ result, count });
    } else {
      const [result] = await connection.query(sqlGetProducts);
      const [count] = await connection.query(sqlCountProducts);
      connection.release();
      res.status(200).send({ result, count });
    }
  } catch (error) {
    next(error);
  }
};

//Get Product By id
const getProductByIdRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetProductsById = `select id, category_id, productName, productDetails, productIMG, isLiquid, price from products WHERE id = ${req.params.productsId}`;

    const [result] = await connection.query(sqlGetProductsById);
    connection.release();

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// get Deleted Product

const getDeletedProductRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetDeletedProducts = `select id, category_id, productName, productDetails, productIMG, isLiquid, isDeleted, price from products where isDeleted = 1 ${req.query.pages}`;
    const sqlCountDeletedProducts = `SELECT COUNT(*) AS count FROM products where isDeleted = 1;`;

    const [result] = await connection.query(sqlGetDeletedProducts);
    const [count] = await connection.query(sqlCountDeletedProducts);
    connection.release();

    res.status(200).send({ result, count });
  } catch (error) {
    next(error);
  }
};

//get Sold Product

const getSoldProductRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetSoldProducts = `select product_id, productCategory, productName, sum(quantity) as total_bought from transactiondetail where statusTransactionDetail = "complete" ${req.query.keyword} group by product_id, productCategory, productName ${req.query.sortedItem} ${req.query.pages}`;
    const sqlCountSoldProducts = `SELECT COUNT(*) AS count FROM transactiondetail where statusTransactionDetail = "complete" group by product_id , productCategory, productName`;

    const [result] = await connection.query(sqlGetSoldProducts);
    const [count] = await connection.query(sqlCountSoldProducts);

    connection.release();

    res.status(200).send({ result, count });
  } catch (error) {
    next(error);
  }
};

router.get("/sold", getSoldProductRouter);
router.get("/deleted", getDeletedProductRouter);
router.get("/:productsId", getProductByIdRouter);
router.get("/", getProductRouter);

module.exports = router;
