const client = require("../Config/dbconfig");
const logger = require("../Config/logger");
const { getOrderQuery, addOrderQuery, deleteOrderQuery,  getTotalOrdersCount } = require("./Schema/query");

const getOrder = async(id)=>{
   try{
       const result = await client.query(getOrderQuery(),[id]); 
       logger.info('Orders Data fetched successfully');
       return result.rows;
   }
   catch(err){
    logger.error('Error in fetching Orders:',err.message);
   }

}

const addOrder = async (order,id) => {
  try {
    // Calculate total amount and quantity, and prepare itemsObject
    let total_amount = 0;
    let total_quantity = 0;
    let itemsObject = {};
    let cartidArray = [];

    order.forEach(item => {
      total_amount += item.total_amount;
      total_quantity += item.quantity;
      itemsObject[item.cart_id] = item;
      cartidArray.push(item.cart_id);
    });

    const updatedOrder = {
      customerid: id, 
      status: 'Pending', 
      item_qty: total_quantity,
      amount: total_amount,
      location: 'Madhapur', 
      itemsObject: itemsObject
    };

    // Extract product names and quantities from itemsObject
    let productUpdates = [];
    for (const key in itemsObject) {
      const item = itemsObject[key];
      productUpdates.push({
        product_name: item.product_name,
        quantity: item.quantity
      });
    }

    // Start a transaction
    await client.query('BEGIN');

    // Assuming addOrderQuery function returns query string and values array
    const { query: orderQuery, values: orderValues } = await addOrderQuery(updatedOrder);
    await client.query(orderQuery, orderValues);

    // Query to delete items from the cart
    const deleteQuery = `
      DELETE FROM cart
      WHERE cart_id = ANY($1::int[]);
    `;
    const deleteValues = [cartidArray];
    await client.query(deleteQuery, deleteValues);

    // Query to update product quantities
    for (const product of productUpdates) {
      const updateProductQuantityQuery = `
        UPDATE products 
        SET available_items = available_items - $1
        WHERE name = $2
      `;
      await client.query(updateProductQuantityQuery, [product.quantity, product.product_name]);
    }

    await client.query('COMMIT');
    console.log('Order Placed, Cart Items Deleted, and Product Quantities Updated Successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in Placing Order:', err.message);
  } 
};


const deleteOrder =async (id)=>{
    
    try{
        
        const {query,values}= await deleteOrderQuery(id);
        await client.query(query,values);
        logger.info('Order deleted Successfully');  

   }
   catch(err){
       logger.error('Error in deleting Order:',err.message);
   }  
}

const updateorder = async (id,status) => {
    try {
      // Update the quantity of the cart item
      const updateDeliveryResult = await client.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        [status,id]
      );
  
      console.log('Update delivery status:', updateDeliveryResult);
  
      return { success: true };
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error;
    }
  };

const getordersrecordWithLimit =async(start,limit)=>{
   
  try {
    const getOrdersWithCustomersQuery = `
      SELECT orders.*, customers.customer_name 
      FROM orders 
      JOIN customers ON orders.customerid = customers.customer_id
      LIMIT ${limit} OFFSET ${start};
    `;
  
    // Query to fetch order details along with customer names
    const dataResult = await client.query(getOrdersWithCustomersQuery);
    
  
    // Query to get the total number of orders
    const totalOrdersResult = await client.query(getTotalOrdersCount());
  
    // Extract data and total orders count
    const data = dataResult.rows;
    console.log(data);
    const totalOrders = totalOrdersResult.rows[0].total_count;
  
    return { totalOrders, data };
  
  } catch (err) {
    console.error('Error in getting orders with limit:', err);
    throw err;
  }

}  

module.exports ={
    addOrder,
    getOrder,
    deleteOrder, 
    updateorder,
    getordersrecordWithLimit
};