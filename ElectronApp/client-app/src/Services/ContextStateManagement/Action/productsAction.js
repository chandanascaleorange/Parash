import { get_Products_API, add_Products_API } from '../../index';
import { addProduct, getProducts, delete_product, request, failed } from "../Type/type";


export function Request() {
  return { type: request };
}

export function Failed(error) {
  return { type: failed, payload: error };
}

export function add_Product(data) {
  return { type: addProduct, payload: data };
}

export function get_products(data) {
  return { type: getProducts, payload: data };
}

export function deleteCategoryAction(data) {
  return { type: delete_product, payload: data };
}


const token = localStorage.getItem('access_token');
export const GetProducts = async (dispatch,navigate) => {
  dispatch(Request());
  try {
    const response = await fetch(get_Products_API, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token':token,
      },
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
      dispatch(get_products(data));
      return data;
    } else {
      dispatch(Failed('Response Rejected'));
    }
  } catch (error) {
    dispatch(Failed(error.message));
  }
}


export const AddProductToDb = async (productData, dispatch,navigate) => {
  try {
    const response = await fetch(add_Products_API, {
      method: 'POST',
      headers: {
       
        'access_token':token,
      },
      body: productData, // FormData is passed directly here
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    const result = await response.json();
    if (
      result.message === "Invalid or expired token." ||
      result.message === "Access token is not provided." ||
      result.message === "Invalid token." ||
      result.message === "Server error."
    ) {
      navigate('/login');
      return;
    }
    dispatch({ type: 'addProduct', payload: result });
    return result;
  } catch (error) {
    throw error;
  }
};


export const DeleteProductFromDb = async (id, dispatch,navigate) => {
 
  try {
    console.log("hello")
    const url =`http://localhost:${process.env.REACT_APP_PORT}/api/deleteProduct/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'access_token':token,
      },
    });
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

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
    // Dispatch the delete action to update the state
    dispatch({
      type: 'delete_product',
      payload: id,
    });

    return data;
  } catch (error) {
    console.error('Error in deleteProductFromDb:', error);
    throw error;
  }
};