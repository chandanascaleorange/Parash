const API =`http://localhost:${process.env.REACT_APP_PORT}/api/`;
export default API;

export const get_Products_API = `http://localhost:${process.env.REACT_APP_PORT}/api/getProduct`;
export const add_Products_API = `http://localhost:${process.env.REACT_APP_PORT}/api/addProduct`;


export const add_Order_API =`http://localhost:${process.env.REACT_APP_PORT}/api/addOrder`;
export const get_Order_API =`http://localhost:${process.env.REACT_APP_PORT}/api/getOrdersWith`;
export const delete_Order_API =`http://localhost:${process.env.REACT_APP_PORT}/api/deleteOrder`;  


export const ADDCUSTOMER = `http://localhost:${process.env.REACT_APP_PORT}/api/addcustomer`;
export const GETCUSTOMER =`http://localhost:${process.env.REACT_APP_PORT}/api/getcustomer`;
export const DELETECUSTOMER = `http://localhost:${process.env.REACT_APP_PORT}/api/deletecustomer/:customer_id`;
export const UPDATECUSTOMER = `http://localhost:${process.env.REACT_APP_PORT}/api/updatecustomer/:customer_id`;


//Retailers API's

export const addProductDataToCart_API=`http://localhost:${process.env.REACT_APP_PORT}/api/addProductToCart`;
export const GETCARTAPI= `http://localhost:${process.env.REACT_APP_PORT}/api/getcart`;


//categories API's

export const addCategory=`http://localhost:${process.env.REACT_APP_PORT}/api/addCategory`;
export const getCategory=`http://localhost:${process.env.REACT_APP_PORT}/api/getCategories`;
export const deleteCategory=`http://localhost:${process.env.REACT_APP_PORT}/api/deleteCategory/:id`;



export const LOGIN = `http://localhost:${process.env.REACT_APP_PORT}/api/login`;
export const RESETPASSWORD = `http://localhost:${process.env.REACT_APP_PORT}/api/resetpassword`;
export const uploadCSVAPI= `http://localhost:${process.env.REACT_APP_PORT}/api/upload`;

