const router = require("express").Router();
const {mysql2} = require("../../config/database");


const postStocksRouter =  async (req, res, next) => {

    try {
        const connection = await mysql2.promise().getConnection()

        const sqlPostStocks = "INSERT INTO stocks SET ?";

        const data = req.body


        try {
           const result =  await connection.query(sqlPostStocks, data,) 
           
            res.status(201).send({
                message: `Data Stock  berhasil ditambahkan`,
                
            });

     
        } catch (error) {
            next(error)
        } 
    } catch (error) {
        next(error);
    }
};


router.post("/", postStocksRouter)


module.exports = router