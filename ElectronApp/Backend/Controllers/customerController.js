const jwt = require('jsonwebtoken');
require('dotenv').config();
const {addCustomer,getCustomer, removeCustomer, updateCustomerById, logCustomer, resetPasswordInDb} = require('../Models/customerModel');
const logger = require('../Config/logger');
const { check, validationResult } = require('express-validator');
const client = require('../Config/dbconfig');
const crypto = require('crypto');


const createCustomer = async (req, res) => {
  //console.log("reqbody", req.body);
  //console.log("reqfile", req.file); 

  try {
    await Promise.all([
      check('customer_name')
        .isLength({ min: 3, max: 100 })
        .withMessage('customerName must be between 3 and 100 characters long')
        .notEmpty().withMessage('customer name is required')
        .run(req),
      check('customer_phno')
        .notEmpty().withMessage('Customer phone number is required')
        .isNumeric().withMessage('Customer phone number must be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Customer phone number must be exactly 10 digits')
        .run(req),
      check('customer_city')
        .isLength({ max: 100 }).withMessage('customer city must be less than 100 characters')
        .notEmpty().withMessage('Customer city is required')
        .run(req),
      check('customer_password')
        .notEmpty().withMessage('Customer password is required')
        .isLength({ min: 6 }).withMessage('Customer password must be at least 6 characters long')
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const simplifiedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }));
      simplifiedErrors.forEach(error => {
        logger.error(`Validation error: ${error.message} (Field: ${error.field})`);
      });
      return res.status(400).json({ errors: simplifiedErrors });
    }

    // Handle the incoming data and file
    

    const newCustomer = await addCustomer(req.body,req.file);
    logger.info(newCustomer);

    res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
  } catch (err) {
    logger.error('Error in creating customer:', err);
    res.status(400).json({ message: err.message });
  }
};


const listCustomers = async (req, res) => {
    try {
      const customers = await getCustomer();
     // console.log(customers);
      res.status(200).json(customers);
    } catch (err) {
      logger.error('Error in fetching customers:', err);
      res.status(500).json({ message: 'Error in fetching customers' });
    }
  };

const deleteCustomer = async(req,res)=>{
    try {
        const {customer_id} = req.params;
        const customers = await removeCustomer(customer_id);
        logger.info('Customer deleted successfully');
        res.status(200).json({message:'customer deleted successfully'});
      } catch (err) {
        logger.error('Error in deleting customers:', err);
        res.status(500).json({ message: 'Error in deleting customers' });
      }
}



const updateCustomer = async (req, res) => {
  const { customer_id } = req.params;
  
  try {
    await Promise.all([
      check('customer_name')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Customer name must be between 3 and 100 characters long')
        .run(req),
      check('customer_phno')
        .optional()
        .isNumeric().withMessage('Customer phone number must be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Customer phone number must be exactly 10 digits')
        .run(req),
      check('customer_city')
        .optional()
        .isLength({ max: 100 }).withMessage('Customer city must be less than 100 characters')
        .run(req),
      check('customer_password')
        .optional()
        .isLength({ min: 6 }).withMessage('Customer password must be at least 6 characters long')
        .run(req),
      check('customer_image')
        .optional()
        .isString().withMessage('Customer image should be a string')
        .run(req),
    ]);

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const simplifiedErrors = errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }));
      simplifiedErrors.forEach(error => {
        logger.error(`Validation error: ${error.message} (Field: ${error.field})`);
      });
      return res.status(400).json({ errors: simplifiedErrors });
    }

    logger.info('Update request for customer ID:', customer_id);
    logger.info('Request Body:', req.body); // Log the incoming request body

    const updatedCustomer = await updateCustomerById(customer_id, req.body);
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (err) {
    logger.error('Error in updating customer:', err);
    res.status(400).json({ message: err.message });
  }
};


const loginCustomer = async(req,res)=>{
  try {
      
      const {customer_phno,customer_password} = req.body;
      console.log("within loginCustomer:",customer_phno,customer_password);
      const user = await logCustomer(customer_phno,customer_password);
      console.log("user:",user);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials or Access token not found' });
      }
      logger.info('login successful,token:',user);
      res.status(200).json({message:'login successful',access_token:user});
    } catch (err) {
      logger.error('Oh no login failed', err);
      res.status(500).json({ message: 'login failed' });
    }
}


const resetPassword = async (req, res) => {
  const { customer_password, id } = req.body;

  try {
    // Check if access_token is provided in the headers
    const token = req.headers['access_token'];
    if (!token) {
      return res.status(401).json({ message: 'Access token is not provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SecretKey); 
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Validate password
    if (!customer_password) {
      return res.status(400).json({ message: "New Password is required" });
    }
    if (customer_password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Reset password logic
    const result = await resetPasswordInDb(customer_password, id);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to reset password" });
    }

    // Send success response
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.error("Error resetting password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCustomerName = async(req,res)=>{

   const id=parseInt(req.query._id);
   const query = `select * from customers where customer_id=${id}`;
   const result = await client.query(query);
   res.status(200).json(result.rows[0]);
} 

const isloggedIn = async(req,res,next)=>{
  try{ 
   console.log("we are in middleware:");
 // console.log('we are in middleware');
  const token = req.headers['access_token'];
  //console.log(token);
  if (!token) {
    logger.info('Access token is not provided.');
    return res.status(401).json({message:'Access token is not provided.'});
  }
  let decoded;
    try {
      decoded = jwt.decode(token);
      console.log("isloggedIn:",decoded);
    } catch (err) {
      logger.error('Invalid or expired token:', err.message);
      return res.status(401).send({message:'Invalid or expired token.'});
    }
   const result = await client.query(`SELECT * from customers where customer_id=${decoded.userId}`);
   const user = result.rows[0];
  // console.log(user);
    if (!user) {
      logger.info('User not found.');
      return res.status(401).send('Invalid user.');
    }
    const hashedPassword = crypto.createHash('sha256').update(decoded.userPsw).digest('hex');
    //console.log(decoded.userPsw,hashedPassword,user.customer_password); 
    if (hashedPassword === user.customer_password) {
      next(); // User is authenticated, proceed to the next middleware/route
    } else {
      if (hashedPassword !== user.customer_password) {
        logger.info('Password does not match.');
      }
      return res.status(401).send('Invalid token.');
    }
  } catch (err) {
    logger.error('Server error during authentication:', err.message);
    res.status(500).send('Server error.');
  }
}

   

    
module.exports={
    createCustomer,
    listCustomers,
    deleteCustomer,
    updateCustomer,
    loginCustomer,
    resetPassword,
    isloggedIn,
    getCustomerName
}