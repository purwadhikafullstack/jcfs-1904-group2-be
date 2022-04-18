const router = require("express").Router();
const pool = require("../../config/database");

const getTransactionDetailRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetTransactionDetail = "select * from transactiondetail";

    const sqlTotalSold = `select sum(quantity) AS total_sold from transactiondetail where statusTransactionDetail = "complete";`;

    const [result] = await connection.query(sqlGetTransactionDetail);

    const [totalSold] = await connection.query(sqlTotalSold);

    connection.release();

    res.status(200).send({ result, totalSold });
  } catch (error) {
    next(error);
  }
};

// get transaction detail by category

const getTransactionDetailCategoryRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlCategoryDetail = `select productCategory, sum(quantity) as total_bought from transactiondetail where statusTransactionDetail ="complete" group by productCategory ${req.query.sortedCategory} ${req.query.pages};`;
    const sqlCategoryCount = `SELECT COUNT(*) AS count FROM transactiondetail where statusTransactionDetail = 'complete' group by productCategory;`;
    const [categoryDetail] = await connection.query(sqlCategoryDetail);
    const [count] = await connection.query(sqlCategoryCount);
    connection.release();

    res.status(200).send({ categoryDetail, count });
  } catch (error) {
    next(error);
  }
};

/// transaction detail by id

const getTransactionDetailByIdRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetTransactionDetail = `select * from transactiondetail where transaction_id = ${req.params.transactionId} group by id;`;

    const [result] = await connection.query(sqlGetTransactionDetail);

    connection.release();

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// transaction detail by product

const getTransactionDetailByIdProduct = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetTransactionDetail = `select * from transactiondetail where product_id = ${req.params.productId} ${req.query.date} ${req.query.sort} ${req.query.pages} `;

    const sqlgetQuantity = `select sum(quantity) as total_bought, sum(totalPrice) as total_amount from transactiondetail where product_id = ${req.params.productId} ${req.query.date}`;

    const sqlTransactionCount = `SELECT COUNT(*) AS count FROM transactiondetail where product_id = ${req.params.productId} ${req.query.date};`;

    const [count] = await connection.query(sqlTransactionCount);
    const [result] = await connection.query(sqlGetTransactionDetail);
    const [total] = await connection.query(sqlgetQuantity);

    const sqlGetCategoryName = `select categoryName from category where id = ${result[0].productCategory}`;
    const sqlGetProductDetail = `select id, category_id, productName, productDetails, productIMG, isLiquid, price from products where id = ${result[0].product_id}`;

    const [category] = await connection.query(sqlGetCategoryName);
    const [product] = await connection.query(sqlGetProductDetail);
    connection.release();
    res.status(200).send({ result, category, total, product, count });
  } catch (error) {
    next(error);
  }
};

router.get("/product/:productId", getTransactionDetailByIdProduct);
router.get("/category", getTransactionDetailCategoryRouter);
router.get("/:transactionId", getTransactionDetailByIdRouter);
router.get("/", getTransactionDetailRouter);

module.exports = router;
