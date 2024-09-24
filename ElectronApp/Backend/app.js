const express = require('express');
const client = require('./Config/dbconfig'); 
const logger = require('./Config/logger');
const { createTables } = require('./Controllers/tablesController');
const Routes = require('./Routes/Routes');
const path = require('path'); // For serving static files
require('dotenv').config(); 
const cors = require('cors');

// Initialize Express application
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend files (if applicable)
app.use(express.static(path.join(__dirname, '../client-app/build'))); // Adjust path as needed


app.use('/api', Routes);

app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working!' });
});


// Serve frontend index.html for any route not covered by API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client-app/build', 'index.html'));
});


client.connect()
  .then(() => {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .then(() => {
    logger.info('Connected to the Inventory DB');
    return createTables();
  })
  .catch(err => {
    logger.error('Database connection error:', err.message);
    logger.error(err.stack);
    process.exit(1); 
  });
