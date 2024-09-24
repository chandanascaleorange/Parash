import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Services/ContextStateManagement/Action/action';
import { jwtDecode } from "jwt-decode";

function Login() {
  const [customer_phno, setCustomer_phno] = useState('');
  const [customer_password, setCustomer_password] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  
const handleLogin = async () => {
    const data = await loginUser(customer_phno, customer_password);
    const token = localStorage.getItem('access_token');
    if (data.message === "login successful") {
    let decoded;
    
      try {
        if(token){
          decoded =  await jwtDecode(token);
          console.log("decoded_token:",decoded);
        }else{
          navigate('/login');
        }
       
      } catch (err) {
        console.log('Invalid or expired token:', err.message);
      }
      // console.log(decoded.userRole);
      if(decoded.userId===1){
          
        navigate('/'); //wholesaler redirect 
      }
      else {
        navigate('/userOrdersPage'); // retailer redirect
      }
    } else {
    setError(data.message || 'An error occurred');
    }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Email/Mobile no.
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="customer_phno"
            type="text"
            placeholder="Enter your email/Mobile no."
            value={customer_phno}
            onChange={(e) => setCustomer_phno(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer_password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="customer_password"
            type="password"
            placeholder="minimum 8 characters"
            value={customer_password}
            onChange={(e) => setCustomer_password(e.target.value)}
          />
        </div>  
      
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>

        
      </div>
    </div>
  );
}

export default Login;