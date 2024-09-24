const {  getProductsQuery, getProductNameQuery } = require('./Schema/query');
const client = require('../Config/dbconfig');

const addProduct = async (productData, file) => {
  const clientInstance = client; // Use the imported client directly
  try {
    const { category, name, available_items, each_item_cost,} = productData;
    
    // Ensure file is present
    if (!file) {
      throw new Error('Image file is required');
    }

    const image = file.buffer; // Access the image buffer
    const image_type = file.mimetype; // Access the image MIME type
    console.log("in be",image_type);
    console.log('catogery',category);

    // First, get the category_id from the categories table using the category_name
    const categoryQuery = 'SELECT id FROM categories WHERE name = $1';
    const categoryResult = await clientInstance.query(categoryQuery, [category]);

    if (categoryResult.rows.length === 0) {
      throw new Error('Category not found');
    }

    const category_id = categoryResult.rows[0].id;

    // Check if a product with the same name exists
    const existingProductQuery = 'SELECT * FROM products WHERE name = $1';
    const existingProduct = await clientInstance.query(existingProductQuery, [name]);

    if (existingProduct.rows.length > 0) {
      throw new Error('Product with this name already exists.');
    }

    // Insert the product with the retrieved category_id
    const insertQuery = 'INSERT INTO products (name, category_id, available_items, each_item_cost, image, image_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const result = await clientInstance.query(insertQuery, [name, category_id, available_items, each_item_cost, image, image_type]);

    return result.rows[0];
  } catch (err) {
    console.error('Error while inserting product:', err);
    throw err; // Rethrow the error for higher-level handling
  }
};

// Function to get products
const getProduct = async () => {
  try {
    const { query } = getProductsQuery();  // Adjust if you need parameters
    const result = await client.query(query);
    console.log("Query Result",result.rows[0]); // Check if result is coming back as expected
    
    if (!result.rows || result.rows.length === 0) {
      console.log("No products found");
      return [];  // Return an empty array if no products are found
    }
    // console.log("kuku",result);
    const productsWithCategoryNames = await Promise.all(
      result.rows.map(async (product) => {
        const { category_id } = product;
        // console.log("cat id:",category_id);
    
        // Fetch the category name based on the category_id
        const { Namequery, values } = getProductNameQuery(category_id);
        const categoryResult = await client.query(Namequery, values);
    
        // Assuming the query returns a single row with the category name
        const categoryName = categoryResult.rows[0]?.name || 'Unknown Category';
    
        // Add the category name to the product object
        return {
          ...product,
          category_name: categoryName,
        };
      })
    );
    return productsWithCategoryNames;
    
  } catch (err) {
    console.error('Error while fetching products:', err);
    throw err;
  }
};




const reindexProductIds = async () => {
  const query = 'SELECT id FROM Products ORDER BY id';
  const result = await client.query(query);
  const Products = result.rows;

  for (let index = 0; index < Products.length; index++) {
    const productId = Products[index].id;
    // Update ID to be index + 1
    const updateQuery = 'UPDATE Products SET id = $1 WHERE id = $2';
    await client.query(updateQuery, [index + 1, productId]);
  }
};

// Delete a category by ID
const deleteProduct= async (id) => {
  try {    
    // Then, delete the category
    const query = 'DELETE FROM Products WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);
    console.log(result)

    // Re-index IDs
    await reindexProductIds();

    return result;
  } catch (error) {
    console.error('Error deleting Products:', error);
    throw error;
  }
};

module.exports = {
  addProduct,
  getProduct,
  deleteProduct
};