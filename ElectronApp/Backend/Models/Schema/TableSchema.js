function createProductsTableQuery() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      category_id INTEGER references categories(id),
      available_items INTEGER NOT NULL,
      each_item_cost DECIMAL(10, 2) NOT NULL,
      image BYTEA, 
      image_type VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  return createTableQuery;
}
  function createOrdersTableQuery() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        CustomerId INTEGER REFERENCES Customers(customer_id),
        status VARCHAR(100) NOT NULL,
        item_qty INTEGER NOT NULL, 
        amount integer NOT NULL,  
        ProductImage BYTEA, 
        Location VARCHAR,
        ItemList jsonb,
        ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ); 
    `;
    return createTableQuery;
  }

  function createCustomersTableQuery(){
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS customers(
      customer_id SERIAL PRIMARY KEY NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_phno BIGINT NOT NULL UNIQUE,
      customer_city VARCHAR(255) NOT NULL,
      customer_image BYTEA,
      customer_password TEXT,
      access_token TEXT,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;  
    return createTableQuery;
  }

  function createCategoriesQuery(){

    const createTableQuery = `
     CREATE TABLE IF NOT EXISTS categories(
     id SERIAL PRIMARY KEY,
     NAME VARCHAR(100) NOT NULL UNIQUE,
     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
    `;
    return createTableQuery;
};
function createCartQuery(){
  try{
    const createTableQuery = `   
      CREATE TABLE IF NOT EXISTS cart( 
       cart_id SERIAL PRIMARY KEY,
       product_name VARCHAR(100) REFERENCES Products(name),
       customer_id INTEGER REFERENCES Customers(customer_id),
       cost_per_piece INTEGER,
       quantity INTEGER,
       total_amount INTEGER NOT NULL,
       product_image BYTEA,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
       CONSTRAINT unique_product_customer UNIQUE (product_name, customer_id)
      ); 
    `;
    return createTableQuery;
  }catch(err){
    console.log('Error in query:', err.message);
  }
};

  
  module.exports = {
    createProductsTableQuery,
    createOrdersTableQuery,
    createCustomersTableQuery,
    createCategoriesQuery,
    createCartQuery,
  };

