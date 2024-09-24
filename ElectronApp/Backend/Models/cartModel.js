const client = require("../Config/dbconfig");
const logger = require("../Config/logger");
const { addProductToCartQuery,getCartQuery } = require("./Schema/query");


const addProductToCart = async (products,id) => {
  console.log(products);
  try {
    for (const key in products) {
      const { pname, count, price, totalCost } = products[key];
      const { query, values } = addProductToCartQuery(pname, id,count, price, totalCost);
      try {
        const res = await client.query(query, values);
        logger.info('Data inserted successfully', { data: res });
      } catch (err) {
        logger.error('Error inserting data', { error: err.message });
      }
    } 
  } catch (err) {
    logger.error('Error in adding products to cart', { error: err.message });
  }
};

const getCart = async (id) => {
  
  try {
    const result = await client.query(getCartQuery(),[id]); 
    return result.rows; 
  } catch (err) {
    logger.error('Error while fetching cart:', err); // Log errors
    throw err; 
  }
};

const updateCartItemQuantity = async (product_name, quantity) => {
  try {
    // Update the quantity of the cart item
    const updateQuantityResult = await client.query(
      `UPDATE cart 
       SET quantity = $1, 
           total_amount = $1 * cost_per_piece 
       WHERE product_name = $2`,
      [quantity, product_name]
    );

    console.log('Update quantity result:', updateQuantityResult);

    return { success: true };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};


module.exports ={
    addProductToCart,
    getCart,
    updateCartItemQuantity,
}