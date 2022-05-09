const router = require("express").Router();
const pool = require("../../config/database");
const upload = require("../../services/upload");




const postCustomOrderRouter = async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection();
        
      

      const sqlPostStocks = "INSERT INTO custom_order SET ?";
  
      const data = req.body.formState;
  
      try {
        const result = await connection.query(sqlPostStocks, data);
  
        res.status(201).send({
          message: `Order Has been submited`,
        });
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  };
  





const multerUploadSingle = upload.uploadPrescription.single("prescription");

const postPrescriptionRouter = async (req, res) => {
  let finalImageURL =
    req.protocol +
    "://" +
    req.get("host") +
    "/prescription/" +
    req.file.filename;

  res.json({ status: "success", image: finalImageURL });
};




router.post("/", postCustomOrderRouter)
router.post("/upload", multerUploadSingle, postPrescriptionRouter);

module.exports = router;