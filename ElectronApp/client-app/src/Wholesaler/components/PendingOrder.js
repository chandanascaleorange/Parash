import React, { useState, useContext, useEffect } from 'react';
import { List, Grid, Package } from 'lucide-react';
import { getOrderData, updateStatus } from '../../Services/ContextStateManagement/Action/orderpageAction';
import ToggleMenu from './ToggleMenu';
import Pagination from './pagination';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const { GlobalContext } = require('../../Services/GlobalProvider');

const InventoryManagement = () => {
  const context = useContext(GlobalContext);
  const { dispatch } = context;
  const [viewMode, setViewMode] = useState('list');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [filter, setFilter] = useState('Pending'); // Set 'Pending' as the default filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 12; 
  const [loading,setLoading]=useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.userId !== 1) {
        navigate('/login'); // Redirect to login page if not authorized
        return;
      }
    } else {
      navigate('/login'); // Redirect to login page if no token
      return;
    }
  }, [navigate]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChange = (orderId, event) => {
    const newStatus = event.target.value;

    setOrderStatuses(prevStatuses => ({
      ...prevStatuses,
      [orderId]: newStatus
    }));

    updateStatus(orderId, newStatus, dispatch,navigate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-700';
      case 'Rejected':
        return 'text-red-700';
      case 'Pending':
        return 'text-yellow-500';
      default:
        return 'text-black';
    }
  };

  // Calculate pagination data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch data from the API with pagination and filter
        const { totalOrders, data } = await getOrderData(dispatch, startIndex, itemsPerPage, filter,navigate);
        console.log(totalOrders,data);
        setPendingOrders(data);
        setTotalOrders(totalOrders);

        // Initialize statuses
        const initialStatuses = data.reduce((acc, order) => {
          acc[order.id] = order.status;
          return acc;
        }, {});
        setOrderStatuses(initialStatuses);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }finally{
         setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch, startIndex,itemsPerPage, filter,navigate]); 

  // Filter orders based on the current filter
  const filteredOrders = pendingOrders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const currentItems = filteredOrders.slice(0, itemsPerPage); // Use filteredOrders for pagination
  
  // Transform the data for customer display grid view
  const customerData = currentItems.map(order => ({
    id:order.customerid,
    name: order.customer_name|| 'Name',
    orderId: order.id || 'N/A',
    itemsQty: order.item_qty || 0,
    amount: order.amount || 0,
    status: orderStatuses[order.id] || 'pending',
    image: order.ProductImage || '/default-image.png',
  }));

  // Transform the data for list display
  const pendingOrdersData = currentItems.map(order => ({
    id:order.customerid,
    status: orderStatuses[order.id] || 'pending',
    name: order.customer_name || 'Name',
    orderId: order.id || 'N/A',
    date: new Date(order.ordered_at).toLocaleDateString(),
    image: order.productimage || '/default-image.png',
    ProductName: order.productname,
    qty_items: order.item_qty,
    Location: order.location,
  }));


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading products...</h1>
        <div class="loader"></div>
      </div>
    );
  }

  // Show no products available if ProductData is empty
  if (pendingOrders.length === 0) {
    return (
      <div className="bg-gray-100">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-purple-500 p-4 flex justify-between items-center">
          <ToggleMenu />
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600' : ''}`}
            >
              <List className="text-white" size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600' : ''}`}
            >
              <Grid className="text-white" size={20} />
            </button>
          </div>
        </div>

        <div className="mt-3 p-4 flex justify-between items-center bg-white shadow-md">
          <h2 className="text-lg font-semibold"> Orders</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('Pending')}
              className={`p-2 rounded ${filter === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Delivered')}
              className={`p-2 rounded ${filter === 'Delivered' ? 'bg-green-700 text-white' : 'bg-gray-200'}`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`p-2 rounded ${filter === 'Rejected' ? 'bg-red-700 text-white' : 'bg-gray-200'}`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`p-2 rounded ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              All Orders
            </button>
          </div>
        </div>
      <h1>NO Orders Placed</h1>
    </div>
    </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-purple-500 p-4 flex justify-between items-center">
          <ToggleMenu />
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600' : ''}`}
            >
              <List className="text-white" size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600' : ''}`}
            >
              <Grid className="text-white" size={20} />
            </button>
          </div>
        </div>

        <div className="mt-3 p-4 flex justify-between items-center bg-white shadow-md">
          <h2 className="text-lg font-semibold"> Orders</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('Pending')}
              className={`p-2 rounded ${filter === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Delivered')}
              className={`p-2 rounded ${filter === 'Delivered' ? 'bg-green-700 text-white' : 'bg-gray-200'}`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`p-2 rounded ${filter === 'Rejected' ? 'bg-red-700 text-white' : 'bg-gray-200'}`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`p-2 rounded ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              All Orders
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="pt-4 pl-1 mx-8">
            <div className="flex gap-x-4 p-2 items-center">
              <h2 className="text-lg font-semibold">Total Orders</h2>
              <div className="shadow-lg w-12 h-10 rounded flex items-center justify-center bg-yellow-300">
                {filteredOrders.length}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full h-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">OrderID</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Qty Items</th>
                    <th className="text-left p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrdersData.length ? pendingOrdersData.map((order) => (
                    <tr key={order.orderId} className="border-b">
                      <td className={`p-2 flex flex-row gap-4 ${getStatusColor(order.status)}`}>
                        <Package size={16} className={getStatusColor(order.status)} />
                        {order.status === 'Delivered' ? (
                          <span>Delivered</span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(event) => handleChange(order.orderId, event)}
                            className={`p-2 ${getStatusColor(order.status)}`}
                          >
                            <option value="Delivered">Delivered</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Pending">Pending</option>
                          </select>
                        )}
                      </td>
                      <td className="p-2">{order.name}</td>
                      <td className="p-2">{order.orderId}</td>
                      <td className="p-2">{order.date}</td>
                      <td className="p-2">{order.qty_items}</td>
                      <td className="p-2">{order.Location}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="p-2" colSpan={6}>No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {viewMode === 'grid' && (
          <div>
            <div className="flex gap-x-4 p-2 items-center my-4 ml-4">
              <h2 className="text-lg font-semibold">Total Orders</h2>
              <div className="shadow-lg w-12 h-10 rounded flex items-center justify-center bg-yellow-300">
                {filteredOrders.length}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 px-4 mt-4">
              {customerData.length ? customerData.map((order) => (
                <div key={order.orderId} className="p-4 bg-white shadow rounded-lg flex flex-col items-center">
                  <img src={`http://localhost:4000/api/getcustomerimage/${order.id}`} alt={order.name} className="w-full h-20 object-cover mb-2" />
                  <h3 className="text-lg font-semibold">{order.name}</h3>
                  <p>{order.orderId}</p>
                  <p>Items: {order.itemsQty}</p>
                  <p>Amount: ${order.amount.toFixed(2)}</p>
                  <p className={`flex flex-row mt-3 ${getStatusColor(order.status)}`}>
                    <Package size={16} className={getStatusColor(order.status)} />
                    {order.status === 'Delivered' ? (
                      <span>Delivered</span>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(event) => handleChange(order.orderId, event)}
                      >
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Pending">Pending</option>
                      </select>
                    )}
                  </p>
                </div>
              )) : (
                <div className="col-span-4 text-center py-4">No orders found</div>
              )}
              <div className="fixed left-0 bottom-4 right-0">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
