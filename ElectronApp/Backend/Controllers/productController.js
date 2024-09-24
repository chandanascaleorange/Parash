const { addProduct, getProduct, deleteProduct } = require('../Models/productsModel');
const logger = require('../Config/logger');
const { check, validationResult } = require('express-validator');

const addProductController = async (req, res) => {
  //  console.log(req.body);
  //console.log('File:', req.file);
  try {
    await Promise.all([
      check('name')
        .isLength({ min: 1, max: 100 })
        .withMessage('Product name must be between 3 and 100 characters long')
        .run(req),
      check('available_items')
        .isInt({ gt: 0 })
        .withMessage('Available items should be a positive integer greater than 0')
        .run(req),
      check('category')
      .isString({gt:0})
      .withMessage('category name should not be empty')
        .run(req),

    ]);

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const simplifiedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }));
      simplifiedErrors.forEach(error => {
        logger.error(`Validation error: ${error.message} (Field: ${error.params})`);
      });
      return res.status(400).json({ errors: simplifiedErrors });
    }



    // If validation passes, add the product
    const newProduct = await addProduct(req.body, req.file);
    res.status(201).json(newProduct);
  
    logger.info('Data added in products table successfully');
  } catch (err) {
    logger.error(`Error in adding product: ${err.message}`);
    res.status(500).json(`{ error: Failed to add product. ${err.message} }`);
  }
};

// Controller to get products

const getProductController = async (req, res) => {
  //console.log("get controller")
  try {
    
    const result = await getProduct();
  
    const products = result.map(product=>{
      if(product.image){
        product.image = `data:${product.image_type};base64,${Buffer.from(product.image).toString('base64')}`;
      }
      //console.log("products",product);
      return product;
     
    })

    res.status(200).send(products);
    logger.info('Products data fetched successfully');
  } catch (err) {
    logger.error(`Error while fetching product: ${err.message}`);
    res.status(500).json(`{ error: Failed to get product. ${err.message} }`);
  }
};


const deleteProductController = async (req, res) => {
  //console.log("entering to controller")
  //console.log("Request params:", req.params);
  try {
    const id =parseInt(req.params.id);
    
    logger.info(`Deleting product with ID: ${id}`); // Logging for debugging
    await deleteProduct(id);
    res.status(200).json(`{ message: Product with ID ${id} deleted successfully }`);
  } catch (err) {
    logger.error(`Error while deleting product: ${err.message}`);
    res.status(500).json(`{ error: Failed to delete product: ${err.message} }`);
  }
};


const getTotalProducts = async () => {
  const result = await client.query('SELECT COUNT(*) AS total FROM products');
  return result.rows[0].total;
};

const totalProductsController = async (req, res) => {
  try {
    const total = await getTotalProducts();
    res.status(200).json({ total });
  } catch (err) {
    logger.error(`Error fetching total products: ${err.message}`);
    res.status(500).json({ error:` Failed to fetch total products: ${err.message}` });
  }
};
module.exports = {
  addProductController,
  getProductController,
  deleteProductController,
  totalProductsController
};