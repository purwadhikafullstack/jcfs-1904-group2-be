const router = require("express").Router();
const pool = require("../../config/database");



const postTransactionRouter = async (req, res, next) => {

    try {
      const connection = await pool.promise().getConnection();
  
      await connection.beginTransaction();
      
      try {
        const sqlPostTransaction = "INSERT INTO transaction SET ?";
        
        const dataTransaction = [
          {
            invoice:"INV//" + Date.now(),
            user_id: req.body.userId,
            transactionStatus: 'waiting',
            totalPrice: req.body.subTotal,
            isByPresciption: 1,
          },
        ];
        
        
        const [result] = await connection.query(sqlPostTransaction, dataTransaction);
        

        req.body.cart.forEach( async (item)=>{
                
            const sqlPostTransactionDetail = "INSERT INTO transactiondetail SET ?";
            const sqlGetStocks = `select * from stocks WHERE product_id = ${item.product_id};`
            const sqlUpdateProduct = `UPDATE stocks SET ? WHERE product_id = ${item.product_id}`;
            const transaction_id = result.insertId

            try {
              
              const [result] = await connection.query(sqlGetStocks);
              
              const {qtyBoxAvailable, qtyBoxTotal, qtyBottleAvailable, qtyBottleTotal, qtyMlAvailable, qtyMlTotal, qtyStripsavailable, qtyStripsTotal, qtyMgAvailable, qtyMgTotal } = result[0]
             
              const transactionDetailData = [
                {
                    transaction_id: transaction_id,
                    product_id: item.product_id,
                    productCategory: item.category_id,
                    productName: item.productName,
                    productDescription: item.productDetails,
                    productImg: item.productIMG,
                    price: item.price,
                    quantity: item.productQuantity,
                    totalPrice: item.totalPrice,
                    statusTransactiondetail: 'waiting',
                }
            ]
              let calculatedStock = 0
                if (item.isLiquid) {
                   calculatedStock = qtyBottleAvailable + (qtyBoxAvailable * 10)  
                }else{
                  calculatedStock = qtyStripsavailable + (qtyBoxAvailable * 10)
                }

                calculatedStock =  (calculatedStock - item.productQuantity)

                if (calculatedStock >= 0) {
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

                     const [stock] = await connection.query(sqlUpdateProduct, stockData)
                     
                      
                    } else {
                      stockData = [ 
                        {
                          qtyBoxAvailable: box,
                          qtyStripsavailable: qty
                        }
                      ]  
                      const [stock] = await connection.query(sqlUpdateProduct, stockData)  
                                      
                    }
    
                    const [detail] = await connection.query(sqlPostTransactionDetail, transactionDetailData);
                   
                    
                  } catch (error) {
                    next(error);
                  }
                  
                }
             
            } catch (error) {
              
            }
            
        });

        try {

            const deleteCartSql = `DELETE FROM cart WHERE user_id = ${req.body.userId} and isActive = 1`;
            const [result] = await connection.query(deleteCartSql)
            
        } catch (error) {
            next(error);
        }
  
        connection.commit();
        res.send("input transaction success");
      } catch (error) {
        connection.rollback();
        next(error);
      }
    } catch (error) {
      next(error);
    }
  };


  router.post("/", postTransactionRouter);

module.exports = router;
