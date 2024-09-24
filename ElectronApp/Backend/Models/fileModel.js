// Function to process CSV data
const processCSVData = (data) => {
    // Expected fields in each row
    const requiredFields = ['name', 'available_items', 'each_item_cost','category_id'];
  
    // Check for missing fields
    return data.map(row => {
      const missingFields = requiredFields.filter(field => !row[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${JSON.stringify(row)}`);
      }
  
      // Return the processed row (if no missing fields)
      return {
        name: row.name,
        available_items: parseInt(row.available_items, 10),
        each_item_cost: parseFloat(row.each_item_cost),
        category_id:parseInt(row.category_id),
      };
    });
  };
  
  module.exports = { processCSVData };