const router = require("express").Router();
const pool = require("../../config/database");
const upload = require("../../services/upload");




const postPaymentProof =  async (req, res, next) => {
    try {
        const connection = await pool.promise().getConnection();

        const sqlPostCart = "INSERT INTO payment_proof SET ?";

        const dataPayment = [
            {
                transaction_id: req.body.transactionId,
                paymentPhoto: req.body.formState.paymentPhoto,
             
            },
          ];
    
    
        const [result] = await connection.query(sqlPostCart, dataPayment);
      
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      next(error)
    }
  };



const multerUploadSingle = upload.uploadPaymentProof.single("paymentProof");

const postPaymentPhotoRouter = async (req, res) => {
  let finalImageURL =
    req.protocol +
    "://" +
    req.get("host") +
    "/paymentProof/" +
    req.file.filename;

  res.json({ status: "success", image: finalImageURL });
};




router.post("/", postPaymentProof)
router.post("/upload", multerUploadSingle, postPaymentPhotoRouter);
 
module.exports = router;