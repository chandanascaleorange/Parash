import React, { useContext, useState, useEffect } from 'react';
import { ChevronDownIcon, Search } from 'lucide-react';
import ToggleMenu from './ToggleMenu';
import { GlobalContext } from '../Services/GlobalProvider';
import { getOrderDataByCustomer_id } from '../Services/ContextStateManagement/Action/orderpageAction';
import { useNavigate } from 'react-router-dom';
import { addProductToCart } from '../Services/ContextStateManagement/Action/userOrderAddToCart';
import { jwtDecode } from 'jwt-decode';

const YourOrders = () => {
  const context = useContext(GlobalContext);
  const { dispatch } = context;
  const [orders, setOrder] = useState([]);
  const [cart,setCart]=useState([]);
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);
   
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const decoded = jwtDecode(token);
      const cartItems = await getOrderDataByCustomer_id(dispatch,decoded.userId);
      setOrder(Array.isArray(cartItems) ? cartItems : []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [dispatch]);

  const handleDownClick = (id) => {
    navigate(`/itemslist/${id}`);
  };

  const addOrdertocartAgain=async()=>{

    try {
      console.log('Orders:', orders);
  
      // Check if orders and itemlist are available
      if (!orders[0] || !orders[0].itemlist) {
        throw new Error('No items found to add to the cart.');
      }
  
      // Transform the itemlist into the desired format
      const itemList = Object.keys(orders[0].itemlist).reduce((acc, key) => {
        const item = orders[0].itemlist[key];
        acc[key] = {
          id: item.cart_id,
          pname: item.product_name, // or item.pname if it's the right property
          count: item.quantity,     // or item.count if it's the right property
          price: item.total_amount / item.quantity, // Assuming price is calculated
          totalCost: item.total_amount
        };
        return acc;
      }, {});
  
      console.log('Item List:', itemList);
  
      // Update the cart state with the formatted item list
      setCart(itemList);
  
      // Call the API to add items to the cart
      await addProductToCart(dispatch, cart);
      console.log('Items added to cart successfully');
  
      // Navigate to the cart page
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  const handleBuyAgain = async () => {
      addOrdertocartAgain();
    navigate('/mycart');
  };
  const handleclick= ()=>{
    navigate('/userOrdersPage');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading products...</h1>
        <div class="loader"></div>
      </div>
    );
  }

  // Show no products available if ProductData is empty
  if (orders.length === 0) {
    return (
      <div className="w-full ">
        <h1 className="flex flex-row items-center justify-between text-xl lg:text-3xl font-semibold mb-4 bg-pink-300 rounded p-3">
          <ToggleMenu />
          <div className="flex-1 text-center">My Orders</div>
        </h1>
        <div className="space-y-4 px-4"></div>
      <div className="flex flex-col justify-center items-center h-screen ">
        <h1>No Orders Placed </h1>
        <button className="bg-red-100 text-green-600 px-4 py-1 rounded-lg shadow hover:bg-red-200 transition mt-2 ml-2" onClick={handleclick}>
                Go to products page
              </button>
      </div>
      </div>
      
    );
  }
  

  return (
    <div className="bg-gray-100  p-4 flex flex-col items-center">
      {/* Header Section */}
      <div className="bg-purple-500 w-full p-4 flex justify-between items-center rounded-t-lg shadow-lg">
        <div className="flex items-center">
          <ToggleMenu />          
          <h1 className="text-white text-xl font-bold px-5">My Orders</h1>
        </div>
        <div className="bg-white p-2 rounded-full cursor-pointer">
          <Search className="text-purple-500" size={20} />
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white w-full  rounded-b-lg shadow-lg p-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg mb-4 p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center">
              {/* <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                <img
                  src="/path/to/image.jpg"
                  alt="Product"
                  className="rounded-lg w-full h-full object-cover"
                />
              </div> */}
              <div>
                <p className="text-gray-500 text-sm mb-1">Order successful</p>
                <p className="text-black font-semibold">Purchased items({order.item_qty})</p>
                <p className="text-green-500 font-bold">Amount: ₹{order.amount}</p>
                <p className="text-gray-500 text-sm">Date: {new Date(order.ordered_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2" >
              <button className="bg-red-100 text-red-600 px-4 py-1 rounded-lg shadow hover:bg-red-200 transition ml-2" onClick={handleBuyAgain}>
                Buy again
              </button>
              <div onClick={() => handleDownClick(order.id)}>
                <ChevronDownIcon size={20} className="text-gray-600 cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourOrders;
