const jwt = require('jsonwebtoken');
const { addOrder, getOrder, deleteOrder, updateorder, getordersrecordWithLimit } = require("../Models/orderModel");

const placeOrderController = async(req,res)=>{
     
    try{
        //console.log(req.body);
      const token = req.headers['access_token'];
      const decoded = jwt.verify(token,process.env.SecretKey);

        await addOrder(req.body,decoded.userId);
        res.status(201).json({ message: 'Order Placed Successfully' });
    }
    catch(err){
      res.status(500).json({ error: `Failed to add order ${err.message}` });
    }
}
const getOrderController = async(req,res)=>{
      
     try{ 
        const id = parseInt(req.query.customer_id);
        const order = await getOrder(id);
        if(order.length!==0){
            res.status(201).json(order);
        }
        else{
            res.status(201).json({ message: 'Order data fetched Successfully, No Orders Found '});
        }
    }catch(err){
            res.status(500).json({ error: `Failed to fetch order data ${err.message}` });
    }
    
}

const deleteOrderController =async(req,res)=>{
  try{
      const id = parseInt(req.params.id);
      await deleteOrder(id);
      res.status(201).send('Order deleted Successfully');
    
}catch(err){
        res.status(500).json({ error: `Failed to delete order data ${err.message}` });
}
}

const updateOrdersStatus = async(req,res)=>{
  try{
    const {order_id,status} = req.body;
    
     updateorder(order_id,status);
    res.status(201).send('Order status updated');
  
  }catch(err){
      res.status(500).json({ error: `Failed to update order status ${err.message}` });
 }
}
const getOrdersRecordWithLimit =async(req,res)=>{
   
    try{

        const start =parseInt(req.query._start);
        const limit =parseInt(req.query._limit);
        const {totalOrders,data} = await getordersrecordWithLimit(start,limit);
        res.status(200).json({totalOrders,data});
      
      }catch(err){
          res.status(500).json({ error: `Failed to update order status ${err.message}` });
     }
}

module.exports = {
        placeOrderController,
        getOrderController,
        getOrdersRecordWithLimit,
        deleteOrderController,
        updateOrdersStatus
};