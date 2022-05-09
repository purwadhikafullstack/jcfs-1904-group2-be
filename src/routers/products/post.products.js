const router = require("express").Router();
const pool = require("../../config/database");
const upload = require("../../services/upload");

//Post Product
const postProductRouter = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    await connection.beginTransaction();
    
    try {
      const sqlPostProduct = "INSERT INTO products SET ?";
      
      const dataProduct = [
        {
          category_id: req.body.newProduct.category_id,
          productName: req.body.newProduct.productName,
          productDetails: req.body.newProduct.productDetails,
          productIMG: req.body.newProduct.productIMG,
          isLiquid: req.body.newProduct.isLiquid,
          isDeleted: req.body.newProduct.isDeleted,
          price: req.body.newProduct.price,
        },
      ];

      const [result] = await connection.query(sqlPostProduct, dataProduct);

      const sqlPostStocks = "INSERT INTO stocks SET ?";

      const dataStock = [
        {
          product_id: result.insertId,
          qtyBoxAvailable: req.body.newStock.qtyBoxAvailable,
          qtyBoxTotal: req.body.newStock.qtyBoxTotal,
          qtyBottleAvailable: req.body.newStock.qtyBottleAvailable,
          qtyBottleTotal: req.body.newStock.qtyBottleTotal,
          qtyMlAvailable: req.body.newStock.qtyMlAvailable,
          qtyMlTotal: req.body.newStock.qtyMlTotal,
          qtyStripsavailable: req.body.newStock.qtyStripsavailable,
          qtyStripsTotal: req.body.newStock.qtyStripsTotal,
          qtyMgAvailable: req.body.newStock.qtyMgAvailable,
          qtyMgTotal: req.body.newStock.qtyMgTotal,
        },
      ];

      const stockLiquid =
        parseInt(req.body.newStock.qtyBottleAvailable) +
        parseInt(req.body.newStock.qtyBoxAvailable * 10);
      const stockNonLiquid =
        parseInt(req.body.newStock.qtyStripsavailable) +
        parseInt(req.body.newStock.qtyBoxAvailable * 10);

      const sqlPostLog = "INSERT INTO data_logging SET ?";
      const dataLogLiquid = [
        {
          user_id: `${req.body.userId}`,
          username: `${req.body.username}`,
          product_id: result.insertId,
          stock_in: stockLiquid,
          status: "add",
        },
      ];

      const dataLoqNonLiquid = [
        {
          user_id: `${req.body.data}`,
          username: `${req.body.username}`,
          product_id: result.insertId,
          stock_in: stockNonLiquid,
          status: "add",
        },
      ];

      
      if (req.body.newProduct.isLiquid) {
        await connection.query(sqlPostLog, dataLogLiquid);
      } else {
        await connection.query(sqlPostLog, dataLoqNonLiquid);
      }

      await connection.query(sqlPostStocks, dataStock);

      connection.commit();
      res.send("Input Product success");
    } catch (error) {
      connection.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//Upload Photo
const multerUploadSingle = upload.uploadProductPhoto.single("productPhoto");

const postProductPhotoRouter = async (req, res) => {
  let finalImageURL =
    req.protocol +
    "://" +
    req.get("host") +
    "/productPicture/" +
    req.file.filename;

  res.json({ status: "success", image: finalImageURL });
};

router.post("/", postProductRouter);
router.post("/upload", multerUploadSingle, postProductPhotoRouter);

module.exports = router;
