import React, { useContext, useEffect, useState, useCallback } from 'react';
import { GlobalContext } from '../Services/GlobalProvider';
import { getOrderDataByCustomer_id } from '../Services/ContextStateManagement/Action/orderpageAction';
import ToggleMenu from './ToggleMenu';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { getCustomerName } from '../Services/ContextStateManagement/Action/action';

const SuccessOrder = () => {
  const context = useContext(GlobalContext);
  const { dispatch } = context;
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState('');

  // Memoize the fetchCartItems function to prevent unnecessary re-renders
  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const decoded = jwtDecode(token);

      const cartItems = await getOrderDataByCustomer_id(dispatch, decoded.userId, navigate);

      if (cartItems.length > 1) {
        const lastCartItem = Array.isArray(cartItems) && cartItems.length > 0
          ? cartItems[cartItems.length - 1]
          : null;
        setOrder(lastCartItem ? [lastCartItem] : []);
      } else {
        setOrder(cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const decoded = jwtDecode(token);

        const data = await getCustomerName(dispatch, decoded.userId, navigate);
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading products...</h1>
        <div className="loader"></div>
      </div>
    );
  }

  if (order.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>No products available</h1>
      </div>
    );
  }

  const formatCityText = (text) => {
    const parts = text.split(/ {2}/);
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="w-full fixed top-0 left-0 right-0">
      <div className="bg-purple-400 rounded-t-lg p-4 shadow-md flex items-center">
        <ToggleMenu />
        <span className="text-white text-lg lg:text-4xl font-bold ml-3">Shop</span>
      </div>

      <div className="bg-white p-6 shadow-md rounded-b-lg text-center mx-3">
        <div className="text-green-500 text-4xl mb-2">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1 className="text-green-500 text-lg lg:text-2xl font-bold mb-4">
          Thank You For Your Order!!!!
        </h1>

        {order.map((item) => (
          <div key={item.customer_id} className="border-t border-b py-4 lg:py-6">
            <div className="flex justify-between mb-2 lg:mb-4">
              <span>Order confirmation No.</span>
              <span className="font-semibold">SO12{item.id}</span>
            </div>
            <div className="flex justify-between mb-2 lg:mb-4">
              <span>Purchased items</span>
              <span className="font-semibold">{item.item_qty}</span>
            </div>
            <div className="flex justify-between mb-2 lg:mb-4">
              <span>Tax</span>
              <span className="font-semibold">₹15</span>
            </div>
            <hr className="my-2 lg:my-4" />
            <div className="flex justify-between text-lg lg:text-xl font-semibold">
              <span>TOTAL</span>
              <span>₹{item.amount}</span>
            </div>
          </div>
        ))}

        <div className="mt-4 lg:mt-8 text-left">
          <p className="font-bold lg:text-xl">{formatCityText(customerData.customer_city)}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessOrder;
