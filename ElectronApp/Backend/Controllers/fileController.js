const fs = require('fs');
const csvParser = require('csv-parser');
const db = require('../Config/dbconfig');
const { processCSVData } = require('../Models/fileModel'); 
const logger = require('../Config/logger');

const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const processedData = processCSVData(results);

        // Call function to insert processed data into database
        await insertProducts(processedData);
        
        res.status(200).json({
          message: 'File uploaded, processed, and data inserted successfully',
          data: processedData,
        });
      } catch (error) {
        logger.error('Error processing CSV data:', error.message);
        res.status(400).json({ error: error.message });
      }
    });
};

// Function to batch insert products into the database
const insertProducts = async (products) => {
  const values = products.flatMap(({ name, available_items, each_item_cost,category_id }) => [
    name, available_items, each_item_cost,category_id
  ]);

  const placeholders = products.map((_, index) => 
   ` ($${index * 4+ 1}, $${index * 4 + 2}, $${index * 4 + 3},$${index * 4 + 4})`
  ).join(', ');

  const insertQuery = `
    INSERT INTO products (name, available_items, each_item_cost,category_id)
    VALUES ${placeholders}
    RETURNING id;
  `;

  try {
    const result = await db.query(insertQuery, values);
    logger.info('Inserted products with IDs:', result.rows.map(row => row.id));
  } catch (error) {
    logger.error('Error inserting products into the database:', error.message);
    throw error;
  }
}; 

module.exports = { uploadCSV };