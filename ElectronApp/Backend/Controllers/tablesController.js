const client = require('../Config/dbconfig');
const logger = require('../Config/logger');
const { createProductsTableQuery, createOrdersTableQuery, createCustomersTableQuery, createCartQuery, createCategoriesQuery } = require('../Models/Schema/TableSchema');


const createTables = async () => {

  try{
    await client.query(createCategoriesQuery());
  }
  catch(err){
    logger.error('Error in creating category Table:',err.stack);
  }

  try{
    await client.query(createCustomersTableQuery());
   // logger.info('Customer table created successfully');
  }
  catch(err)
  {
    logger.error('Error in creating customer Table:',err.stack);
  }

  try {
    await client.query(createProductsTableQuery());
    // logger.info('Product Table Created Successfully');
  } catch (err) {
    logger.error('Error in creating Product Table:', err.stack);
  }

  try{
     await client.query(createCartQuery());
  }
  catch(err){
    logger.error('Error in creating Cart Table:',err.stack);
  }
  try {
    await client.query(createOrdersTableQuery());
    //logger.info('Orders Table Created Successfully');
  } catch (err) {
    logger.error('Error in creating orders Table:', err.stack);
  }
  
};

module.exports = {
  createTables,
};


