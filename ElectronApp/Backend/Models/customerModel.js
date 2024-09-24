const client = require('../Config/dbconfig');
const logger = require('../Config/logger');
require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { insertCustomerQuery, getCustomerQuery, buildUpdateQuery, updateCustomerTokenQuery } = require('./Schema/query');
//adding customer 

const addCustomer = async (customer, file) => { 
  try {
    console.log("addCustomer:", customer);

    // Check if the file is provided
    if (!file) {
      throw new Error('Image file is required');
    }
      
    const customer_image = file.buffer;  // Access the image buffer
    const image_type = file.mimetype;    // Access the image MIME type


    // Hash the customer password using bcrypt with a salt round of 10
    const hashedPassword = crypto.createHash('sha256').update(customer.customer_password).digest('hex');

    // Define the values for the insert query
    const values = [
      customer.customer_name,
      customer.customer_phno,
      customer.customer_city,
      hashedPassword,    // Store hashed password
      customer_image,    // Store image buffer
      image_type         // Store image MIME type
    ];

    // Insert customer data into the database
    const insertResult = await client.query(insertCustomerQuery(), values);
    const customerId = insertResult.rows[0].customer_id;

    // Generate JWT token
    const tokenPayload = { userId: customerId, userPhone: customer.customer_phno,userPsw:customer.customer_password };
    const token = jwt.sign(tokenPayload, process.env.SecretKey, { expiresIn: '365d' });

    // Update the customer record with the token
    const updateResult = await client.query(updateCustomerTokenQuery(), [token, customerId]);

    return updateResult.rows[0];  // Return the updated customer

  } catch (err) {
    logger.error("Error in adding customer:", err);
    throw err;
  }
};


const getCustomer = async()=>{
    const result = await client.query(getCustomerQuery());
    return result.rows;
}

const removeCustomer = async(customer_id)=>{
    try{
        const result = await client.query('DELETE FROM customers WHERE customer_id=$1',[customer_id]);
        return result;
    }
    catch(err){
        logger.error("error in deleting customer",err);
        throw err;
    }
}


const updateCustomerById = async (customer_id, customerUpdates) => {
    try {
      const { query, values } = buildUpdateQuery(customer_id, customerUpdates);
      const result = await client.query(query, values);
      return result.rows[0]; // Return the updated customer
    } catch (err) {
      logger.error("Error in updating customer:", err);
      throw err;
    }
  };

 
  
 
  const logCustomer = async (customer_phno, customer_password) => {
    try {
      console.log("in logCustomer:",customer_phno, customer_password);
      // Hash the password using SHA-256
      const hashedPassword = crypto.createHash('sha256').update(customer_password).digest('hex');
  
      // Query to check if the customer exists and retrieve their access token
      const query = 'SELECT access_token FROM customers WHERE customer_phno = $1 AND customer_password = $2';
      const values = [customer_phno, hashedPassword];
      const result = await client.query(query, values);
      console.log("result:",result.rows);
      if (result.rows.length > 0) {
        let access_token = result.rows[0].access_token;
           
        // Check if the token is expired
        try {
          console.log("decoding token ...");
          const decodedToken = jwt.decode(access_token);
          console.log(decodedToken);
          return access_token; // If the token is valid, return it
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            // If the token is expired, generate a new one
            console.log("Expired Creating new:");
            // userId: customerId, userPhone: customer.customer_phno,userPsw:customer.customer_password 
            access_token = jwt.sign({ customer_phno }, process.env.SecretKey, { expiresIn: '365d' }); // New token valid for 1 hour
             console.log('newToken is Generated');
            // Update the token in the database
            const updateQuery = 'UPDATE customers SET access_token = $1 WHERE customer_phno = $2';
            await client.query(updateQuery, [access_token, customer_phno]);
           console.log("new access_token:",access_token)
            return access_token; // Return the new token
          } else {
            // If another error occurred, throw it
            throw new Error('Error validating token');
          }
        }
      } else {
        throw new Error('Login failed: Invalid phone number or password');
      }
    } catch (err) {
      throw err;
    }
  };
  

  const resetPasswordInDb = async (customer_password, id) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash the new password
        const hashedPassword = crypto.createHash('sha256').update(customer_password).digest('hex');
        
        // Fetch the user data from the database
        const userResult = await client.query(`SELECT * FROM customers WHERE customer_id = $1`, [id]);
        
        // Check if the user exists
        if (userResult.rows.length === 0) {
          return reject(new Error('User not found'));
        }
        
        const user = userResult.rows[0];  // Get the first user from result
  
        // Create a payload for JWT token
        const payload = {
          userId: user.customer_id,
          userPhone: user.customer_phno,
          userPsw: customer_password
        };
  
        // Generate JWT token
        const token = jwt.sign(payload, process.env.SecretKey, { expiresIn: '365d' }); // Set expiration as needed
  
        // SQL query to update the password and token
        const query = `UPDATE customers SET customer_password = $1, access_token = $2 WHERE customer_id = $3 RETURNING access_token`;
        
        // Execute the update query with hashed password, token, and customer ID
        const updateResult = await client.query(query, [hashedPassword, token, id]);
  
        // Resolve with the new access token
        resolve(updateResult.rows[0].access_token);
      } catch (error) {
        reject(error);
      }
    });
  };
  



module.exports={
    addCustomer,
    getCustomer,
    removeCustomer,
    updateCustomerById,
    logCustomer,
    resetPasswordInDb,
}