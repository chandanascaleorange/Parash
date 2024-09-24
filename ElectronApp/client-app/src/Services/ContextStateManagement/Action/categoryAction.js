import { addCategory, getCategory } from "../..";
import { add_categories, delete_category, Get_categories } from "../Type/type";
import { Failed, Request } from "./productsAction";


export function GET_categories(data) {
    return { type: Get_categories, payload: data };
  }
  
  export function addCategoryAction(data) {
    return { type: add_categories, payload: data };
  }
  export function deleteCategoryAction(data){
    return {type:delete_category,payload:data};
  }


const token = localStorage.getItem('access_token');

export async function GetCategories(dispatch,navigate) {
    dispatch(Request());
    try {
      const response = await fetch(getCategory, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token':token,
        },
      });
      
      const {categories} = await response.json();
      if (
        categories === "Invalid or expired token." ||
        categories === "Access token is not provided." ||
        categories === "Invalid token." ||
        categories === "Server error."
      ) {
        navigate('/login');
        return;
      }
      
      if (response.ok) {
        dispatch(GET_categories(categories));
        console.log(categories);
        return categories;
      } else {
        dispatch(Failed(categories.message || 'Failed to fetch categories'));
      }
    } catch (error) {
      dispatch(Failed(error.message));
    }
}
export async function addCategoryToDb(categoryName,navigate) {
    const response = await fetch(addCategory , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token':token,
      },
      body: JSON.stringify({ name: categoryName }),
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
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add category');
    }
    return data;
}
