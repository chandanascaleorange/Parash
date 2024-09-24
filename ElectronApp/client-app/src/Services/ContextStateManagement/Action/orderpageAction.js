import { get_Order_API } from "../..";

const { getOrder ,addOrder,failed,request, UPDATE_STATUS} = require("../Type/type");
 
export const get_orders=(data)=>{
    
    return{
       type:getOrder,
       payload:data
    }
}
export const add_order=(data)=>{

    return{
        type:addOrder,
        payload:data
    }
    
}
export const Failed=(error)=>{
  return({
      type:failed,
      payload:error
   });
}
export const Update=(error)=>{
  return({
      type:failed,
      payload:error
   });
}

export  const Request=()=>{
  return({
      type:request
 });
}


export function updateOrderStatus(data) { 
  return { type: UPDATE_STATUS, payload: data };
}

const token = localStorage.getItem('access_token');

export const getOrderData =async(dispatch,start,limit,navigate)=>{
    dispatch(Request());
     try{
        const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/api/getOrdersWith?_start=${start}&_limit=${limit}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'access_token':token,
            }
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
          if(response.ok){  
             
            dispatch(get_orders(data));
            return data;
          }
          else{
              dispatch(Failed('Response Rejected'));
          }
     }catch(err){
        dispatch(Failed(err.message ));
     }
}

export const getOrderDataByCustomer_id =async(dispatch,customer_id,navigate)=>{
  dispatch(Request());
   try{ 
      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/api/getOrders?customer_id=${customer_id}`, {
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
        if(response.ok){
           
          dispatch(get_orders(data));
          return data;
        }
        else{
            dispatch(Failed('Response Rejected'));
        }
   }catch(err){
      dispatch(Failed(err.message ));
   }
}

export const addOrderData =async(order,dispatch,navigate)=>{
    dispatch(Request());
    try{
       const response = await fetch(get_Order_API, {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
             'access_token':token,
           },
           body: JSON.stringify(order),
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
         if(response.ok){
            
           dispatch(add_order(data));
          
         }
         else{
             dispatch(Failed('Response Rejected'));
         }
    }catch(err){
       dispatch(Failed(err.message ));
    }
}


export const updateStatus = async (order_id, status, dispatch,navigate) => {

  dispatch(Request());
  try {
  
    const url = `http://localhost:${process.env.REACT_APP_PORT}api/updateStatus`;
    const response = await fetch(url, {
  
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'access_token':token,
      },
      body: JSON.stringify({ order_id: order_id, status: status }), 
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
      dispatch(updateOrderStatus(data)); 
      return data;
    } else {
      dispatch(Failed('Response Rejected'));
    }
  } catch (error) {
    dispatch(Failed(error.message));
  }
};
