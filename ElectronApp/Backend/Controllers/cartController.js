const logger = require("../Config/logger");
const { getCart,updateCartItemQuantity} = require('../Models/cartModel');
const { addProductToCart } = require("../Models/cartModel");
const jwt = require("jsonwebtoken");

const addProductToCartController =async(req,res)=>{
    const {Data } = req.body;
    try{
      const token = req.headers['access_token'];
      const decoded = jwt.verify(token,process.env.SecretKey);
        await addProductToCart(Data,decoded.userId);
    }catch(err){
      logger.error(`Error in adding Product to Cart :${err.message}`);
      res.status(400).send(`Error in adding Products to Cart:${err.message}`);
    } console.log(`addedSuccessfully`);
}

const getCartList = async (req, res) => {
 
    try {
      const id =parseInt(req.query.customer_id);
      const result = await getCart(id); 
      res.status(200).json(result); 
      logger.info('Cart data fetched successfully');
    } catch (err) {
      logger.error(`Error while fetching cart: ${err.message}`);
      res.status(500).json({ error:` Failed to get cart. ${err.message}` });
    }
};


  const updateCartItem = async (req, res) => {
    const { product_name, quantity } = req.body;
  
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
  
    try {
      const result = await updateCartItemQuantity(product_name, quantity);
  
      if (result.success) {
        res.status(200).json({ message: 'Cart item updated successfully' });
      } else {
        res.status(400).json({ error: 'Failed to update cart item' });
      }
    } catch (error) {
      logger.error(`Error updating cart item: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  

module.exports ={
   addProductToCartController,
   getCartList,
   updateCartItem
};