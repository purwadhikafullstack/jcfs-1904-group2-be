const router = require("express").Router();
const pool = require("../../config/database");




const putAddressRouter =  async (req, res, next) => {  
    try {
        const connection = await pool.promise().getConnection();
       
        const sqlInputAddress = `UPDATE transaction SET address_id = ${req.body.firstAddress.id} where id = ${req.params.transactionId}`;

        const [result] = await connection.query(sqlInputAddress);
        connection.release();
        res.status(200).send(result);
         
    } catch (error) {
      next(error)
    }
};



const putTransactionStatusRouter =  async (req, res, next) => {  
  try {
      const connection = await pool.promise().getConnection();
     
      const sqlInputAddress = `UPDATE transaction SET transactionStatus = '${req.body.params.status}' where id = ${req.params.transactionId}`;

      const [result] = await connection.query(sqlInputAddress);
      connection.release();
      res.status(200).send(result);
       
  } catch (error) {
    next(error)
  }
};


const putTransactionRejectRouter =  async (req, res, next) => {  
  try {
      const connection = await pool.promise().getConnection();

      const sqlGetTransactionDetail = ` select * from transactiondetail where transaction_id = ${req.params.transactionId} `
      const sqlRejectRouter = `UPDATE transaction SET transactionStatus = '${req.body.params.status}' where id = ${req.params.transactionId}`;

      const [result] = await connection.query(sqlRejectRouter);
      const [detail] = await connection.query(sqlGetTransactionDetail)

      detail.forEach(async(item) => {
        const sqlUpdateLog = `UPDATE data_logging SET ? WHERE id = ${item.log_id}`
        const sqlGetStocks = `select * from stocks WHERE product_id = ${item.product_id};`
        const sqlUpdateStocks = `UPDATE stocks SET ? WHERE product_id = ${item.product_id}`;

        const dataFailed = [{
          progress: 0,
          status: 'failed',
          }]

          try {
            const [log] = await connection.query(sqlUpdateLog, dataFailed)
            const [stock] = await connection.query(sqlGetStocks);

            const {qtyBoxAvailable, qtyBoxTotal, qtyBottleAvailable, qtyBottleTotal, qtyMlAvailable, qtyMlTotal, qtyStripsavailable, qtyStripsTotal, qtyMgAvailable, qtyMgTotal } = stock[0]
              
              let calculatedStock = 0
                if (item.isLiquid) {
                   calculatedStock = qtyBottleAvailable + (qtyBoxAvailable * 10)  
                }else{
                  calculatedStock = qtyStripsavailable + (qtyBoxAvailable * 10)
                }

                calculatedStock =  (calculatedStock + item.quantity)

                try {

                  var box = (Math.floor(calculatedStock / 10))
                  var qty = (calculatedStock - (box * 10))

                  if (item.isLiquid) {
                    stockData = [ 
                      {
                        qtyBoxAvailable: box,
                        qtyBottleAvailable: qty
                      }
                    ]

                   const [stock] = await connection.query(sqlUpdateStocks, stockData)
                  
                    
                  } else {
                    stockData = [ 
                      {
                        qtyBoxAvailable: box,
                        qtyStripsavailable: qty
                      }
                    ]  
                    const [stock] = await connection.query(sqlUpdateStocks, stockData)  
                     
                  }
                  
                } catch (error) {
                  
                }
            

          } catch (error) {
            
          }
      

      })


      connection.release();
      res.status(200).send(result);
       
  } catch (error) {
    next(error)
  }
};


const putTransactionSendRouter =  async (req, res, next) => {  
  try {
      const connection = await pool.promise().getConnection();
      const sqlGetTransactionDetail = ` select * from transactiondetail where transaction_id = ${req.params.transactionId} `
      const sqlGetTransaction = `select * from transaction where id = ${req.params.transactionId} `
      const sqlPutTransaction = `UPDATE transaction SET transactionStatus = '${req.body.params.status}' where id = ${req.params.transactionId}`;


      const [detail] = await connection.query(sqlGetTransactionDetail)
      const [result] = await connection.query(sqlPutTransaction);
      const [transaction] = await connection.query(sqlGetTransaction)
      
      const isByPrescription = transaction[0].isByPresciption
     


      detail.forEach( async(item) => {
       
       
        const sqlUpdateLog = `UPDATE data_logging SET ? WHERE id = ${item.log_id}`
        const sqlGetStocks = `select * from stocks WHERE product_id = ${item.product_id};`
        const sqlUpdateTransactionDetail = `UPDATE transactiondetail SET statusTransactionDetail = 'complete' where id = ${item.id}`
        const sqlUpdateStocks = `UPDATE stocks SET ? WHERE product_id = ${item.product_id}`;

        const [detail] = await connection.query(sqlUpdateTransactionDetail)
        
            
            try {

              if (isByPrescription) {
                const dataCustom = [{
                  stock_out: item.quantity,
                  progress: 0,
                  status: 'custom',
                  }]
          
                  const [log] = await connection.query(sqlUpdateLog, dataCustom)
                
              } else {
                const dataBought = [{
                  stock_out: item.quantity,
                  progress: 0,
                  status: 'bought',
                  }]
                  const [log] = await connection.query(sqlUpdateLog, dataBought)
                
              }
         
              const [stock] = await connection.query(sqlGetStocks);

              const {qtyBoxAvailable, qtyBoxTotal, qtyBottleAvailable, qtyBottleTotal, qtyMlAvailable, qtyMlTotal, qtyStripsavailable, qtyStripsTotal, qtyMgAvailable, qtyMgTotal } = stock[0]
              
              let calculatedStock = 0
                if (item.isLiquid) {
                   calculatedStock = qtyBottleTotal + (qtyBoxTotal * 10)  
                }else{
                  calculatedStock = qtyStripsTotal + (qtyBoxTotal * 10)
                }

                calculatedStock =  (calculatedStock - item.quantity)

                if (calculatedStock >= 0) {
                  try {

                    var box = (Math.floor(calculatedStock / 10))
                    var qty = (calculatedStock - (box * 10))

                    if (item.isLiquid) {
                      stockData = [ 
                        {
                          qtyBoxTotal: box,
                          qtyBottleTotal: qty
                        }
                      ]

                     const [stock] = await connection.query(sqlUpdateStocks, stockData)
                     
                      
                    } else {
                      stockData = [ 
                        {
                          qtyBoxTotal: box,
                          qtyStripsTotal: qty
                        }
                      ]  
                      const [stock] = await connection.query(sqlUpdateStocks, stockData)  
                        
                    }
                    
                  } catch (error) {
                    
                  }
                  
                } else {
                  
                }

            } catch (error) {
              
            }
      })

     
     
      connection.release();
      res.status(200).send();
       
  } catch (error) {
    next(error)
  }
};


router.put("/reject/:transactionId", putTransactionRejectRouter)
router.put("/send/:transactionId", putTransactionSendRouter)
router.put("/status/:transactionId", putTransactionStatusRouter)
router.put("/:transactionId", putAddressRouter)

module.exports = router;