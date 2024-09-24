const express= require('express');
const router = express.Router();
const client = require('../Config/dbconfig');

const { addProductController, getProductController, deleteProductController } = require('../Controllers/productController');
const { placeOrderController, getOrderController, deleteOrderController, updateOrdersStatus, getOrdersRecordWithLimit } = require('../Controllers/orderController');
const {createCustomer,listCustomers, deleteCustomer, updateCustomer, loginCustomer, resetPassword, getCustomerName, isloggedIn} = require('../Controllers/customerController');
const { addProductToCartController, getCartList, updateCartItem } = require('../Controllers/cartController');
const { addCategory, deleteCategory, getAllCategories } = require('../Controllers/categoryController');

const multer = require('multer');
const path = require('path');
const {uploadCSV } = require('../Controllers/fileController');

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Folder where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  const load = multer({ storage: storage });
  
// File upload route (CSV)
router.post('/upload', load.single('file'), uploadCSV);

const upload = multer({ storage: multer.memoryStorage() });
router.post('/addProduct', upload.single('image'), addProductController);


router.get('/getimage/:id', async (req, res) => {
  try {
      const productId = req.params.id;
      console.log("productId:",productId);
      const result = await client.query('SELECT image,image_type FROM products WHERE id=$1', [productId]); 
      console.log("img format",result);
      if (result.rowCount === 0 || !result.rows[0].image) {
          return res.status(404).json({ success: false, message: 'image not found' });
      }

      const product = result.rows[0];
      console.log("karshu",product);
      const contentType = product.image_type || 'application/octet-stream';
      // const base64Image = Buffer.from(product.image).toString('base64');
      
      res.set('Content-Type', contentType);
      res.send(product.image);
      // res.send(data:${contentType};base64,${base64Image});
      console.log("uploading img",product.image)
  } catch (err) {
      console.log('Error fetching image', { error: err.message });
      res.status(500).json({ success: false, message: 'Error fetching  image'});
}
});
router.get('/getproductimage/:name', async (req, res) => {
  try {
      const product_name= req.params.name;
      console.log("productId:",product_name);
      const result = await client.query('SELECT image,image_type FROM products WHERE name=$1', [product_name]); 
      console.log("img format",result);
      if (result.rowCount === 0 || !result.rows[0].image) {
          return res.status(404).json({ success: false, message: 'image not found' });
      }

      const product = result.rows[0];
      console.log("karshu",product);
      const contentType = product.image_type || 'application/octet-stream';
      // const base64Image = Buffer.from(product.image).toString('base64');
      
      res.set('Content-Type', contentType);
      res.send(product.image);
      // res.send(data:${contentType};base64,${base64Image});
      console.log("uploading img",product.image)
  } catch (err) {
      console.log('Error fetching image', { error: err.message });
      res.status(500).json({ success: false, message: 'Error fetching  image'});
}
});



router.get('/getcustomerimage/:customer_id', async (req, res) => {
  try {
      const customer_id = req.params.customer_id;
     // console.log("customer_id:",customer_id);
      const result = await client.query('SELECT customer_image,image_type FROM customers WHERE customer_id=$1', [customer_id]); 
      //console.log("img format",result);
      if (result.rowCount === 0 || !result.rows[0].customer_image) {
          return res.status(404).json({ success: false, message: 'image not found' });
      }

      const customer = result.rows[0];
      //console.log("karshu",customer);
      const contentType = customer.image_type || 'application/octet-stream';
      // const base64Image = Buffer.from(product.customer_image).toString('base64');
      
      res.set('Content-Type', contentType);
      res.send(customer.customer_image);
      // res.send(data:${contentType};base64,${base64Image});
     // console.log("uploading img",customer.customer_image)
  } catch (err) {
      console.log('Error fetching image', { error: err.message });
      res.status(500).json({ success: false, message: 'Error fetching  image'});
}
});


//login routes
router.post('/login',loginCustomer );
router.put('/resetpassword',isloggedIn,resetPassword);
  
// Product routes
router.get('/getProduct',isloggedIn, getProductController);
router.delete('/deleteProduct/:id',isloggedIn, deleteProductController);
router.post('/addProduct',isloggedIn, addProductController);


//order routes

router.get('/getOrders',isloggedIn,getOrderController);  
router.delete('/deleteOrder',isloggedIn,deleteOrderController  );     


//wholesaler routes for adding customers
router.post('/addCustomer', upload.single('customer_image'),isloggedIn, createCustomer);
router.get('/getcustomer',listCustomers);
router.get('/getCustomerName',isloggedIn,getCustomerName);
router.delete('/deletecustomer/:customer_id',isloggedIn,deleteCustomer);
router.put('/updatecustomer/:customer_id',isloggedIn,updateCustomer )

//Retailer Routes
router.post('/addProductToCart',isloggedIn,addProductToCartController);
router.get('/getCart',isloggedIn,getCartList );
router.put('/quantityupdate',isloggedIn, updateCartItem);
router.post('/placeOrder',isloggedIn,placeOrderController);

//category
router.post('/addCategory',isloggedIn,addCategory); //done
router.delete('/deleteCategory/:id',isloggedIn,deleteCategory);
router.get('/getCategories',isloggedIn,getAllCategories);

//pending order status update api
router.put('/updateStatus',isloggedIn,updateOrdersStatus);
router.get('/getOrdersWith',isloggedIn,getOrdersRecordWithLimit);





module.exports=router;


