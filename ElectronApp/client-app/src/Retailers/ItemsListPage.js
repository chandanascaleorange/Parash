import React, { useContext, useEffect, useState ,useCallback} from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../Services/GlobalProvider';
import { getOrderDataByCustomer_id } from '../Services/ContextStateManagement/Action/orderpageAction';
import ToggleMenu from './ToggleMenu';
import { jwtDecode } from 'jwt-decode';

const ItemsList = () => {
  const context = useContext(GlobalContext);
  const { dispatch } = context;
  const [orders, setOrders] = useState([]);
  const [itemList, setItemList] = useState(null); // State for the item list
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [loading,setLoading]=useState(true);

 
  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const decoded = jwtDecode(token);
      const ordersData = await getOrderDataByCustomer_id(dispatch, decoded.userId);
      setOrders(ordersData);
  
      // Extract item list for the specific order ID
      const order = ordersData.find(order => order.id === parseInt(id));
      if (order) {
        setItemList(order.itemlist);
      } else {
        console.log('Order not found');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleBackClick = () => {
    console.log(orders);
    navigate('/YourOrders');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading products...</h1>
        <div class="loader"></div>
      </div>
    );
  }

  // Show no products available if ProductData is empty
  if (itemList.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>No products</h1>
      </div>
    );
  }

  return (
    
      <div className="bg-white rounded-lg shadow-lg w-full m-2 p-6">
         <h1 className="flex flex-row items-center justify-between text-xl lg:text-3xl font-semibold mb-4 bg-pink-300 rounded p-3">
          <ToggleMenu />
          <div className="flex-1 text-center">My Cart</div>
        </h1>
        <div className="flex items-center mb-4">
          <div onClick={handleBackClick}>
            <ArrowLeft className="text-gray-700 cursor-pointer" />
          </div>
          <h1 className="text-gray-800 text-2xl font-bold ml-2">Items list</h1>
        </div>

        {itemList ? (
          Object.keys(itemList).map((key) => (
            <div key={key} className="border-b border-gray-200 mt-8 pb-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                  <div>
                    <p className="text-gray-800 font-bold">{itemList[key].product_name}</p>
                    <p className="text-gray-500">Per unit-₹{itemList[key].cost_per_piece}</p>
                    <p className="text-gray-500 font-bold">Total ₹{itemList[key].total_amount}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mr-4">Qty: {itemList[key].quantity}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading items...</p>
        )}

        {/* Repeat similar structure for more items */}
      </div>
  
  );
};

export default ItemsList;
