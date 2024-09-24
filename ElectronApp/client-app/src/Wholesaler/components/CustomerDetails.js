import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Plus, TrashIcon } from 'lucide-react';
import { DeleteCustomer, GetCustomers } from '../../Services/ContextStateManagement/Action/action';
import { GlobalContext } from '../../Services/GlobalProvider';
import { useLocation } from 'react-router-dom';

import ToggleMenu from './ToggleMenu';
import {jwtDecode} from 'jwt-decode';

const CustomerCard = ({ avatar, customer_id, name, phone, city, onSelect, isSelected, onEdit, onDelete }) => (
  <div
    className={`bg-white rounded-lg shadow-md p-4 mb-4 flex items-center cursor-pointer ${
      isSelected ? 'border-2 border-red-500' : ''
    }`}
    onClick={() => onSelect(customer_id)} // Select the customer when clicked
  >
    {avatar ? (
      <img src={avatar} alt={name} className="w-20 h-20 rounded-lg mr-4 object-cover" />
    ) : (
      <div className="w-20 h-20 rounded-lg mr-4 bg-gray-300" /> // Placeholder if no avatar
    )}
    <div className="flex-grow">
      <p className="font-semibold">
        <span className="text-red-800">Customer ID:</span> <span className="text-black">{customer_id}</span>
      </p>
      <p>
        <span className="text-red-800">Customer Name:</span> <span className="text-black">{name}</span>
      </p>
      <p>
        <span className="text-red-800">Phone No:</span> <span className="text-black">{phone}</span>
      </p>
      <p>
        <span className="text-red-800">City:</span> <span className="text-black">{city}</span>
      </p>

      {isSelected && (
        <div className="flex mt-2">
          <button
            className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click event from bubbling up
              onEdit(customer_id);
            }}
          >
            <Edit className="h-5 w-5" />
            <span className="ml-1">Edit</span>
          </button>
        </div>
      )}
    </div>

    {/* Individual Delete Button */}
    <button
      className="text-red-500 hover:text-red-700 ml-4"
      onClick={(e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        onDelete(customer_id);
      }}
    >
      <TrashIcon className="h-6 w-6" />
    </button>
  </div>
);

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]); // Track multiple selected customers
  const context = useContext(GlobalContext);
  const dispatch = context.dispatch;
  const location = useLocation();
  const newCustomer = location.state?.newCustomer;
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerList = await GetCustomers(dispatch, navigate);
        setCustomers(customerList);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [dispatch, navigate]);

  const displayCustomers = newCustomer ? [newCustomer, ...customers] : customers || []; // Ensure `customers` is not undefined

  const handleAddCustomer = () => {
    navigate('/customerentry');
  };

  const handleDeleteSelectedCustomers = async () => {
    const deletePromises = selectedCustomers.map(customer_id =>
      DeleteCustomer(customer_id, dispatch, navigate)
    );

    const results = await Promise.all(deletePromises);

    const successfullyDeleted = selectedCustomers.filter((_, index) => results[index]);

    setCustomers(customers.filter(customer => !successfullyDeleted.includes(customer.customer_id)));

    setSelectedCustomers([]);
  };

  const handleDeleteCustomer = async (customer_id) => {
    const result = await DeleteCustomer(customer_id, dispatch, navigate);
    if (result) {
      setCustomers(customers.filter(customer => customer.customer_id !== customer_id));
    }
  };

  const handleSelectCustomer = (customer_id) => {
    setSelectedCustomers(prevSelected => {
      if (prevSelected.includes(customer_id)) {
        return prevSelected.filter(id => id !== customer_id); // Deselect if already selected
      } else {
        return [...prevSelected, customer_id]; // Select if not already selected
      }
    });
  };

  const handleEditCustomer = (customer_id) => {
    const customerToEdit = customers.find(customer => customer.customer_id === customer_id);
    navigate('/customerentry', { state: { customer: customerToEdit } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading customers...</h1>
        <div className="loader"></div>
      </div>
    );
  }

  if (displayCustomers.length === 0) {
    return (
      <div className="bg-white-200 flex flex-col mt-5">
      {/* Header */}
      <div className="bg-purple-500 p-4 fixed left-0 right-0 top-0 flex items-center">
        <ToggleMenu />
      </div>

      {/* Sub-header with Add Button and Delete Button */}
      <div className="bg-white p-4 flex items-center justify-between mt-10">
        <div className="flex items-center">
          <h1 className="text-gray-800 text-xl font-semibold">Customer Details</h1>
        </div>

        <div className="flex items-center">
          <button
            className="bg-blue-400 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            onClick={handleAddCustomer}
          >
            <Plus className="h-6 w-6" />
          </button>
          </div>
          </div>
        <div className="flex flex-col justify-center items-center h-screen">
          <h1>No Customers are added</h1>
        </div>
     
      
      </div>
    );
  }

  return (
    <div className="bg-white-200 flex flex-col mt-5">
      {/* Header */}
      <div className="bg-purple-500 p-4 fixed left-0 right-0 top-0 flex items-center">
        <ToggleMenu />
      </div>

      {/* Sub-header with Add Button and Delete Button */}
      <div className="bg-white p-4 flex items-center justify-between mt-10">
        <div className="flex items-center">
          <h1 className="text-gray-800 text-xl font-semibold">Customer Details</h1>
        </div>

        <div className="flex items-center">
          <button
            className="bg-blue-400 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            onClick={handleAddCustomer}
          >
            <Plus className="h-6 w-6" />
          </button>

          {selectedCustomers.length > 0 && (
            <button
              className="bg-red-200 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-md ml-4"
              onClick={handleDeleteSelectedCustomers}
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Cards */}
      <div className="flex-grow p-4 overflow-y-auto">
        {displayCustomers.map((customer, index) => (
          <CustomerCard
            key={index}
            avatar={customer.customer_image ? `http://localhost:4000/api/getcustomerimage/${customer.customer_id}` : null}
            customer_id={customer.customer_id}
            name={customer.customer_name}
            phone={customer.customer_phno}
            city={customer.customer_city}
            onSelect={handleSelectCustomer}
            isSelected={selectedCustomers.includes(customer.customer_id)}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerDetails;
