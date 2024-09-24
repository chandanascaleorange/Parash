import React, { useContext, useEffect, useState } from 'react';
import { X, Package, MessageCircle, Settings, Home } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { GlobalContext } from '../Services/GlobalProvider';
import { getCustomerName } from '../Services/ContextStateManagement/Action/action';
import {Link, useNavigate } from 'react-router-dom';

const SidebarMenu = ({ onClose }) => {
  const [Customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useContext(GlobalContext);
  
  const token = localStorage.getItem('access_token');
  let decoded = {};

  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    navigate('/'); // Redirect to login or home page if token is invalid
  }

  useEffect(() => {
    if (!decoded.userId) return;

    const getName = async () => {
      try {
        const customer = await getCustomerName(dispatch, decoded.userId, navigate);
        setCustomer(customer || {}); // Ensure customer is always an object
      } catch (error) {
        console.error('Error fetching customer name:', error);
      }
    };

    getName();
  }, [dispatch, decoded.userId, navigate]);

  if (!token || !decoded.userId) {
    return null; // Prevent rendering if no token or invalid token
  }

  if (!Customer) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center mb-8 mt-16">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div> {/* Placeholder for image */}
          <div>
            <div className="font-semibold">Loading...</div>
            <div className="font-semibold text-sm text-gray-500">#SO240{decoded.userId}</div>
            <div className="font-semibold text-sm text-gray-500">Fetching phone...</div>
          </div>
        </div>
        <button
        onClick={onClose}
        className="p-2 bg-white rounded-full shadow-md absolute top-4 right-4"
        aria-label="Close menu"
      >
        <X size={24} />
      </button>

      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <Link to="/userOrdersPage" className="flex items-center text-yellow-500 hover:bg-gray-200 p-2 rounded-md transition-colors shadow-lg">
              <Home className="mr-8" size={20} />
              <span className="text-sm md:text-base">Home</span> 
            </Link> 
          </li> 
          <li>
            <Link to="/mycart" className="flex items-center hover:bg-gray-200 p-2 rounded-md transition-colors shadow-lg">
              <Package className="mr-8" size={20} />
              <span className="text-sm md:text-base">MyCart</span>
            </Link>
          </li>
          <li>
            <Link to="/YourOrders" className="flex items-center hover:bg-gray-200 p-2 rounded-md transition-colors shadow-lg">
              <Package className="mr-8" size={20} />
              <span className="text-sm md:text-base">MyOrders</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto space-y-4">
        <Link to="/ContactUs" className="flex items-center text-blue-900 hover:bg-gray-100 p-2 rounded-md transition-colors">
          <MessageCircle className="mr-3" size={25} />
          <span className="text-sm md:text-base">Contact Us</span>
        </Link>
        <Link to="/createnewPassword" className="flex items-center  hover:bg-gray-100 p-2 rounded-md transition-colors">
          <Settings className="mr-3" size={25} />
          <span className="text-sm md:text-base">Settings</span>
        </Link>
      </div>
    </div>
        );

}   
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center mb-8 mt-16 shadow-lg">
        <img
          src={Customer.customer_image ? `http://localhost:${process.env.REACT_APP_PORT}/api/getcustomerimage/${Customer.customer_id}` : null}
          alt={Customer.customer_name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="font-semibold">{Customer.customer_name}</div>
          <div className="font-semibold text-sm text-gray-500">#SO240{decoded.userId}</div>
          <div className="font-semibold text-sm text-gray-500">{decoded.userPhone}</div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 bg-white rounded-full shadow-md absolute top-4 right-4"
        aria-label="Close menu"
      >
        <X size={24} />
      </button>

      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <Link to="/userOrdersPage" className="flex items-center text-yellow-500 hover:bg-gray-200 p-2 rounded-md transition-colors shadow-lg">
              <Home className="mr-8" size={20} />
              <span className="text-sm md:text-base">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/mycart" className="flex items-center hover:bg-gray-200 p-2 rounded-md transition-colors shadow-lg">
              <Package className="mr-8" size={20} />
              <span className="text-sm md:text-base">MyCart</span>
            </Link>
          </li>
          <li>
            <Link to="/YourOrders" className="flex items-center hover:bg-gray-200 p-2 rounded-md transition-colors shadow-lg">
              <Package className="mr-8" size={20} />
              <span className="text-sm md:text-base">MyOrders</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto space-y-4">
        <Link to="/ContactUs" className="flex items-center text-blue-900 hover:bg-gray-100 p-2 rounded-md transition-colors">
          <MessageCircle className="mr-3" size={25} />
          <span className="text-sm md:text-base">Contact Us</span>
        </Link>
        <Link to="/createnewPassword" className="flex items-center  hover:bg-gray-100 p-2 rounded-md transition-colors">
          <Settings className="mr-3" size={25} />
          <span className="text-sm md:text-base">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu;
