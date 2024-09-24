import { ADD_CUSTOMER_FAILURE, ADD_CUSTOMER_REQUEST, ADD_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_SUCCESS,GET_CUSTOMER_FAILURE, GET_CUSTOMER_REQUEST,
  GET_CUSTOMER_SUCCESS } from '../Type/type';
import { GETCUSTOMER,LOGIN,UPDATECUSTOMER,ADDCUSTOMER, RESETPASSWORD } from '../../index';

export function getCustomerFailure(error) {
    return {
    type: GET_CUSTOMER_FAILURE,
    payload: error,
    };
}
export function getCustomerRequest() {
    
   return {
    type: GET_CUSTOMER_REQUEST,
    };
}

export function getCustomerSuccess(data) {
    
   return {
    type: GET_CUSTOMER_SUCCESS,
    payload: data,
    };
}

export function addCustomerFailure(error) {
    
   return {
    type: ADD_CUSTOMER_FAILURE,
    payload: error,
    };
}
export function addCustomerRequest() {
    return {
    type: ADD_CUSTOMER_REQUEST,
    };
}

export function addCustomerSuccess(data) {
    return {
    type: ADD_CUSTOMER_SUCCESS,
    payload: data,
    };
}

export function deleteCustomerSuccess(data){
    return {
    type : DELETE_CUSTOMER_SUCCESS,
    payload :data,
    };
} 

const token = localStorage.getItem('access_token'); 

export async function addCustomer(customerData, navigate) {
  const url = customerData.customer_id 
    ? `${UPDATECUSTOMER}/${customerData.customer_id}` 
    : ADDCUSTOMER;

  // Create a FormData object
  const formData = new FormData();
  
  // Append all customerData properties to the FormData object
  formData.append('customer_name', customerData.customer_name);
  formData.append('customer_phno', customerData.customer_phno);
  formData.append('customer_city', customerData.customer_city);
  formData.append('customer_password', customerData.customer_password);
  formData.append('image_type', customerData.image_type);
  
  // Check if there's a customer image to append
  if (customerData.customer_image) {
    console.log("Image file:", customerData.customer_image);  // Debugging log
    formData.append('customer_image', customerData.customer_image);
  } else {
    console.log("No image selected");
  }

  // Log FormData content for debugging (only text parts will show up in the console)
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]); // Logs key-value pairs of the form data
  }

  try {
    const response = await fetch(url, {
      method: customerData.customer_id ? 'PUT' : 'POST',
      headers: {
        'access_token': token,
        // No need to set the Content-Type header manually; 
        // fetch will set the correct one for FormData automatically
      },
      body: formData,  // Use the FormData object as the request body
    });

    const data = await response.json();

    if (
      data.message === "Invalid or expired token." ||
      data.message === "Access token is not provided." ||
      data.message === "Invalid token." ||
      data.message === "Server error."
    ) {
      console.log(data.message);
      navigate('/login');
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add customer');
    }

    return data;
  } catch (err) {
    throw err;
  }
}



export async function GetCustomers(dispatch,navigate) {
      dispatch(getCustomerRequest()); // Dispatch request action

      try {
      const response = await fetch(GETCUSTOMER, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'access_token':token,
          },
      });

      const data = await response.json();
      console.log(data);
      if (
        data.message === "Invalid or expired token." ||
        data.message === "Access token is not provided." ||
        data.message === "Invalid token." ||
        data.message === "Server error."
      ) {
        navigate('/login');
        return;
      }
      if (response.ok) 
      {
        dispatch(getCustomerSuccess(data)); // Dispatching the correct action
        return data;
      } 
      else 
      {
        dispatch(getCustomerFailure('Response Rejected'));
      }
      } 
      catch(error) 
      {
        dispatch(getCustomerFailure(error.message));
      }
}
export const getCustomerName = async(dispatch,id,navigate)=>{
 
  try {
    
    const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/api/getCustomerName?_id=${id}`, {
    method: 'GET',
    headers :{
     'Content-Type':'application/json',
     'access_token':token,
    },
    });

    if (!response.ok) {
    throw new Error('Failed to fetch customer');
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

    dispatch(deleteCustomerSuccess(data));
    return data;
    } 
    catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
    }
}



// In your action file or a separate service file
export const DeleteCustomer = async (customer_id,dispatch,navigate) => {
      try {
      console.log("customer_id:",customer_id);
      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/api/deletecustomer/${customer_id}`, {
      method: 'DELETE',
      headers :{
      'Content-Type':'application/json',
      'access_token':token,
      },
      });
      console.log(response);
      if (!response.ok) {
      throw new Error('Failed to delete customer');
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

      console.log(data);
      dispatch(deleteCustomerSuccess(data));

      return data;
      } 
      catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
      }
};


export const UpdateCustomer = async (customer,navigate) => {
      try {
      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/api/updatecustomer/${customer.customer_id}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      'access_token':token,
      },
      body: JSON.stringify(customer),
      });

      if (!response.ok) {
      throw new Error('Failed to update customer');
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
      return true;
      } catch (error) {
      console.error('Error updating customer:', error);
      return false;
      }
};

export const loginUser = async (customer_phno, customer_password,navigate) => {
    console.log(customer_phno, customer_password,LOGIN);
    try {
    const response = await fetch(LOGIN, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'access_token':token,
    },
    body: JSON.stringify({ customer_phno, customer_password }),
});

  if (!response.ok) {
   const errorData = await response.json();
   return { success: false, message: errorData.message }; 
}
const data = await response.json();
for (let i = 0; i < 2; i++) {
  setTimeout(() => {
    if (i === 1) {
      // Only refresh on the last iteration to avoid endless loop
      window.location.reload();
    }
  }, i * 1000); // Adjust the delay as needed
}
if (
  data.message === "Invalid or expired token." ||
  data.message === "Access token is not provided." ||
  data.message === "Invalid token." ||
  data.message === "Server error."
) {
  navigate('/login');
  return;
}
  if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      sessionStorage.setItem('access_token', data.access_token);
      console.log('access_token updated successfully');
      return {success : true,message : data.message};
  }
  else
  {
   console.log('access_token is not found in response data');
 }
   console.log(data);
    return data;
      } catch (error) {
      console.error('Error during login:', error);
      return { success: false, message: 'An error occurred. Please try again later.' };
      }
      };


      export const ResetPassword = async (customer_password, id, navigate) => {
        try {
          const token = localStorage.getItem('access_token');
          
          const response = await fetch(RESETPASSWORD, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'access_token':token,
            },
            body: JSON.stringify({ customer_password, id }),
          });
      
          const contentType = response.headers.get('Content-Type');
          let data;
      
          if (contentType && contentType.includes('application/json')) {
            data = await response.json(); 
          } else {
            data = await response.text(); 
          }
      
          if (
            data.message === "Invalid or expired token." ||
            data.message === "Access token is not provided." ||
            data.message === "Invalid token." ||
            data.message === "Server error."
          ) {
            navigate('/login');
            return;
          }
      
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('access_token', data.access_token);
            return { success: true, message: data.message };
          } else {
            console.log('access_token is not found in response data');
          }
           console.log(data.message);
          return { success: false, message: data.message || data }; 
        } catch (error) {
          console.error("Error resetting password:", error);
          return { success: false, message: "Error resetting password" };
        }
      };      
      