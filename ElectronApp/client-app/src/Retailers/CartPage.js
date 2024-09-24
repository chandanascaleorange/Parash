import React, { useState, useEffect, useContext,useCallback } from 'react';
import { GlobalContext } from '../Services/GlobalProvider';
import { useNavigate } from 'react-router-dom';
import { GetCart, placeOrder, updateProductQuantity } from '../Services/ContextStateManagement/Action/cartAction';
import ToggleMenu from './ToggleMenu';
import { jwtDecode } from 'jwt-decode';

const Cart = () => {
  const { dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading,setLoading]= useState(true);
 
  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const decoded = jwtDecode(token);
      if (decoded) {
        const cartItems = await GetCart(dispatch, decoded.userId, navigate);
        setCart(Array.isArray(cartItems) ? cartItems : []);
      } else {
        navigate('/');
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

  const handleQuantityChange = async (product_name, newQuantity) => {
    try {
      await updateProductQuantity(product_name, newQuantity, dispatch,navigate);
      await fetchCartItems(); // Re-fetch cart items to get updated total_amount
    } catch (error) {
      console.error(`Failed to update quantity for ${product_name}:`, error);
    }
  };

  const increaseQuantity = (product_name, currentQuantity) => {
    handleQuantityChange(product_name, currentQuantity + 1);
  };

  const decreaseQuantity = (product_name, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(product_name, currentQuantity - 1);
    }
  };

  const totalAmount = (cart || []).reduce((acc, item) => {
    return acc + parseFloat(item.cost_per_piece) * (item.quantity || 0);
  }, 0);

  const handlePlaceOrder = () => {
    console.log('button clicked');
    console.log('cart:',cart);
    placeOrder(dispatch, cart,navigate);
    navigate('/SuccessOrder', { state: { totalAmount } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading products...</h1>
        <div class="loader"></div>
      </div>
    );
  }
  const handleclick= ()=>{
    navigate('/userOrdersPage');
  }


  // Show no products available if ProductData is empty
  if (cart.length === 0) {
    return (
      <div className="w-full ">
        <h1 className="flex flex-row items-center justify-between text-xl lg:text-3xl font-semibold mb-4 bg-pink-300 rounded p-3">
          <ToggleMenu />
          <div className="flex-1 text-center">My Cart</div>
        </h1>
        <div className="space-y-4 px-4"></div>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1>No products are added to cart</h1>
        <button className="bg-red-100 text-green-600 px-4 py-1 rounded-lg shadow hover:bg-red-200 transition mt-2 ml-2" onClick={handleclick}>
                Go to products page
              </button>
      </div>
      </div>
    );
  }

  return (
    
      <div className="w-full ">
        <h1 className="flex flex-row items-center justify-between text-xl lg:text-3xl font-semibold mb-4 bg-pink-300 rounded p-3">
          <ToggleMenu />
          <div className="flex-1 text-center">My Cart</div>
        </h1>
        <div className="space-y-4 px-4">
          {cart.map((item) => (
            <div
              key={item.cart_id}
              className="flex items-center bg-white shadow rounded-lg p-3 lg:p-6"
            >
              <img
                className="w-16 h-16 lg:w-24 lg:h-24 object-cover rounded-md"
                src={`http://localhost:4000/api/getproductimage/${item.product_name}`}
                  alt={item.product_name} 
                 // className="w-full h-50 object-cover mb-2 rounded" 
              />
              <div className="ml-4 flex-1">
                <h2 className="text-sm lg:text-lg font-medium">
                  {item.product_name}
                </h2>
                <p className="text-sm lg:text-base">
                  per unit - ₹{item.cost_per_piece}
                </p>
                <p className="text-sm lg:text-base text-green-600 font-semibold">
                  Total ₹{(item.cost_per_piece) * (item.quantity || 0)}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => increaseQuantity(item.product_name, item.quantity)}
                  className="px-3 py-1 lg:px-4 lg:py-2 bg-pink-200 rounded-l-md text-lg"
                >
                  +
                </button>
                <p className="px-3 py-1 lg:px-4 lg:py-2 bg-pink-100">
                  {item.quantity}
                </p>
                <button
                  onClick={() => decreaseQuantity(item.product_name, item.quantity)}
                  className="px-3 py-1 lg:px-4 lg:py-2 bg-pink-200 rounded-r-md text-lg"
                >
                  -
                </button>
              </div>
            </div>
          )) }
        </div>

        <div className="bg-white shadow rounded-lg p-4 lg:p-6 mt-4">
          <h2 className="text-sm lg:text-lg font-medium mb-2 lg:mb-4">
            Price Details
          </h2>
          <div className="space-y-2 lg:space-y-4">
            <div className="flex justify-between text-sm lg:text-base">
              <span>Total Items ({cart.length})</span>
            </div>
            <div className="flex justify-between text-lg lg:text-xl font-semibold">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 lg:mt-8 w-full bg-yellow-500 text-white py-3 lg:py-4 rounded-lg text-lg lg:text-xl shadow"
        >
          Place Order
        </button>
      </div>
  
  );
};

export default Cart;
