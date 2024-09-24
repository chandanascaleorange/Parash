const { Client } = require('pg');
require('dotenv').config();


// Create a new instance of the PostgreSQL client
const client = new Client({
  host: 'localhost',
  user: 'paras',
  password: 1224,  // Use DB_PASSWORD for consistency
  database: 'Inventory',
  port: 5432, // Ensure the port is an integer
});

module.exports = client;
