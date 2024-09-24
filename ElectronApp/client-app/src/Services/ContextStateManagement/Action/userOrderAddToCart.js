const { addProductDataToCart_API } = require("../..");
const { addProductTocart } = require("../Type/type");
const { Request, Failed } = require("./orderpageAction")

export const add_Product_to_cart = ()=>{
    return{
        type:addProductTocart  
    }
}
const token = localStorage.getItem('access_token');
export const addProductToCart = async(dispatch,Data,navigate)=>{
  dispatch(Request());
  try{ 
    const response = await fetch(addProductDataToCart_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token':token,
        },
        body: JSON.stringify({Data}),
      });
     const data = response.json();
     if (
      data.message === "Invalid or expired token." ||
      data.message === "Access token is not provided." ||
      data.message === "Invalid token." ||
      data.message === "Server error."
    ) {
      navigate('/login');
      return;
    }
      
      if(response.ok){
         
        dispatch(add_Product_to_cart());
      }
      else{
          dispatch(Failed('Response Rejected'));
      }
 }catch(err){
    dispatch(Failed(err.message ));
 }

}


