const client = require ('../Config/dbconfig.js');

const addCategoryToDb = async (name) => {
//   validateCategory(name);
  
  const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
  const values = [name];
  const result = await client.query(query, values);
  return result.rows[0].id;
};



// Get all categories from the database
const getAllCategoriesFromDb = async () => {
  const query = 'SELECT * FROM categories';
  const result = await client.query(query);
  return result.rows;
};

// Delete a category by ID
const deleteCategoryById = async (id) => {
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
  const result = await client.query(query, [id]);
  return result;
};

module.exports = {

   deleteCategoryById,
   getAllCategoriesFromDb,
   addCategoryToDb,

};