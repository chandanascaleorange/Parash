import { GET_CART_PAGE, GET_QUANTITY, Order_Placed } from "../Type/type";
import { Failed,Request } from "./productsAction";

export function get_cart(data) {
    return { type: GET_CART_PAGE, payload: data };
  }
  
export function update_Quantity(data) { 
    return { type: GET_QUANTITY, payload: data };
  }
export function Ordered_Placed(data){
  return { type:Order_Placed , payload: data };
}

const token = localStorage.getItem('access_token'); 

export const GetCart = async (dispatch, customer_id,navigate) => {
  dispatch(Request());
  
  if (!token) {
    dispatch(Failed('Access token not found'));
    return;
  }

  try {
    // Append the customer_id as a query parameter
    const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/api/getcart?customer_id=${customer_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': token, 
      },
    });

    const data = await response.json();
   // console.log(data);
    if (
      data.message === "Invalid or expired token." ||
      data.message === "Access token is not provided." ||
      data.message === "Invalid token." ||
      data.message === "Server error."
    ) {
      navigate('/login');
      return;
    }

    if (response.ok) {
      dispatch(get_cart(data));
      return data;
    } else {
      dispatch(Failed('Error in fetching cart items'));
    }
  } catch (err) {
    dispatch(Failed(err.message));
  }
};


  
export const updateProductQuantity = async (product_name, newQuantity, dispatch,navigate) => {
 
    dispatch(Request());
    try {
    
      const url = `http://localhost:${process.env.REACT_APP_PORT}/api/quantityupdate`;
      const response = await fetch(url, {
    
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'access_token':token,
        },
        body: JSON.stringify({ product_name: product_name, quantity: newQuantity }), // Updated to match backend expectation
      });
    
      const data = await response.json();
      if (
        data.message === "Invalid or expired token." ||
        data.message === "Access token is not provided." ||
        data.message === "Invalid token." ||
        data.message === "Server error."
      ) {
        navigate('/login');
        return;
      }
      if (response.ok) {
        dispatch(update_Quantity(data)); // Adjusted to call the correct action creator
        return data;
      } else {
        dispatch(Failed('Response Rejected'));
      }
    } catch (error) {
      dispatch(Failed(error.message));
    }
  };

  export const placeOrder = async (dispatch, order, navigate) => {
    console.log("InPlaceOrder:", order);
  
    try {
      // Check if running in a browser environment before accessing localStorage
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem('access_token'); // Safely access localStorage
      }
  
      if (!token) {
        throw new Error('Token not available');
      }
  
      const url = `http://localhost:${process.env.REACT_APP_PORT}/api/placeOrder`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': token,
        },
        body: JSON.stringify(order),
      });
  
      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', data);
  
      if (
        data.message === "Invalid or expired token." ||
        data.message === "Access token is not provided." ||
        data.message === "Invalid token." ||
        data.message === "Server error."
      ) {
        navigate('/login');
        return;
      }
  
      if (response.ok) {
        dispatch(Ordered_Placed(data)); 
        console.log(data);
        return data;
      } else {
        dispatch(Failed('Response Rejected'));
      }
  
    } catch (err) {
      console.error('Error:', err);
      dispatch(Failed(err.message));
    }
  };
  