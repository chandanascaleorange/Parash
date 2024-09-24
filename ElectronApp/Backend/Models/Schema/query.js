
const insertUserQuery = (productData) => {
  const query = `
    INSERT INTO Products (name, available_items)
    VALUES ($1, $2)
    RETURNING id;
  `;   
  const values = [productData.name, productData.available_items];
  return { query, values };
};

// Function to get products
const getProductsQuery = () => {
  const query = `
    SELECT * from Products;
  `;
  return { query };
};
const getProductNameQuery =(id)=>{
  const Namequery = `SELECT name from categories where id=$1;`;
  const values=[id];
return { Namequery,values };
}

// Function to delete a product
const deleteUserQuery = (id) => {
  const query = `
    DELETE FROM Products WHERE id = $1;
  `;
  const values = [id];
  return { query, values };
};

const getOrderQuery =()=>{
  return `SELECT * FROM orders where customerid=$1 ORDER BY id DESC`;
   
}

const addOrderQuery = (order) => {
  const query = `
    INSERT INTO orders (customerid, status, item_qty, amount, location, itemList)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [
    order.customerid,
    order.status,
    order.item_qty,
    order.amount,
    order.location,
    order.itemsObject,
  ];
  return { query, values };
};

const deleteOrderQuery = (id)=>{
   
   const query ='DELETE FROM orders where id=$1';
   const values = [id];
   return {query,values};

}

const addProductToCartQuery = (name,customerId, quantity, pieceprice, totalCost) => {
 try {const query = `
    INSERT INTO cart (product_name, customer_id, cost_per_piece, quantity, total_amount)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (product_name, customer_id)
DO UPDATE SET
  quantity = cart.quantity + EXCLUDED.quantity,
  total_amount = (cart.quantity + EXCLUDED.quantity) * EXCLUDED.cost_per_piece;

  `;
  const values = [name, customerId, pieceprice, quantity, totalCost];
  return { query, values };}
  catch(err){
    console.log('error in query',err.message);
  }
};

const increaseCountQuery =(count,name)=>{
  const query =`UPDATE cart set count +=${count} where productname =${name}`;
  return {query};
}
const getCartQuery = () => {
  return `SELECT * FROM cart where customer_id=$1`; 

};

const getTotalOrdersCount =()=>{
  const query=`SELECT COUNT(*) AS total_count FROM orders;`
  return query
}

const insertCustomerQuery = () => {
  return `INSERT INTO customers (customer_name, customer_phno, customer_city, customer_password,customer_image,image_type, added_at)
          VALUES ($1, $2, $3, $4, $5,$6,NOW()) RETURNING customer_id`;
};

const updateCustomerTokenQuery = ()=>{
   return `update customers set access_token=$1 where customer_id=$2 RETURNING *`; 
}

const getCustomerQuery = ()=>{
  return 'SELECT * FROM customers ORDER BY customer_id DESC';
     
}

const buildUpdateQuery = (customerId, customerUpdates) => {
  let query = `UPDATE customers SET `;
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(customerUpdates)) {
    query += `${key} = $${index}, `;
    values.push(value);
    index++;
  }

  query = query.slice(0, -2); // Remove trailing comma and space
  query += ` WHERE customer_id = $${index} RETURNING *`;
  values.push(customerId);

  return { query, values };
};



  module.exports = {
    getOrderQuery,
    addOrderQuery,
    deleteOrderQuery,
    insertUserQuery,
    getProductsQuery,
    deleteUserQuery,
    insertCustomerQuery,
    getCustomerQuery,
    getProductNameQuery,
    addProductToCartQuery,
    increaseCountQuery,
    getCartQuery,
    buildUpdateQuery,
    getTotalOrdersCount,
    updateCustomerTokenQuery

  };



