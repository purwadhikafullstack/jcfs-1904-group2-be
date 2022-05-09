const router = require("express").Router();
const pool = require("../../config/database");




const postAddress =  async (req, res, next) => {
    try {
        const connection = await pool.promise().getConnection();

        const dataAddress = [
            {
              user_id: req.body.formState.user_id,
              country: req.body.formState.country,
              province_id: req.body.formState.province_id,
              province: req.body.formState.province,
              city_id: req.body.formState.city_id,
              city: req.body.formState.city,
              district: req.body.formState.district,
              zipCode: req.body.formState.zipCode,
              addressDetail: req.body.formState.addressDetail,
            },
          ];
        

     

        const sqlPostAddress = `INSERT INTO address SET ?`;

        
        const [result] = await connection.query(sqlPostAddress, dataAddress);
      
      connection.release();
  
      res.status(200).send(result);
    } catch (error) {
      next(error)
    }
  };




router.post("/", postAddress)

 
module.exports = router;

  
