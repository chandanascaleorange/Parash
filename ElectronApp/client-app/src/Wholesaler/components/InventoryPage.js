import React, { useState, useEffect, useContext } from 'react';
import { List, Grid, Trash } from 'lucide-react';
import { GlobalContext } from '../../Services/GlobalProvider';
import { GetProducts, AddProductToDb, DeleteProductFromDb } from '../../Services/ContextStateManagement/Action/productsAction';
import ToggleMenu from '../components/ToggleMenu';
import { GetCategories, addCategoryToDb } from '../../Services/ContextStateManagement/Action/categoryAction';
import Pagination from './pagination';
import { uploadCSV } from '../../Services/ContextStateManagement/Action/uploadcsvAction';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const InventoryView = () => {
  const context = useContext(GlobalContext);
  const dispatch = context.dispatch;
  const [loading, setLoading] = useState(true); 
  const [viewMode, setViewMode] = useState('list');
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newAvailableItems, setNewAvailableItems] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [file, setFile] = useState(null);
  const navigate=useNavigate();
  const [img,setImg] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 
 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFileChange = (e) => {
       
        setFile(e.target.files[0]);
        console.log(e.target.files[0]);
      };
    
      const handleFileimg = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
          alert('Please upload a valid image file.');
          return;
        }
        setImg(file);
      };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      await uploadCSV(file, dispatch);
    
      alert('File uploaded successfully');
      setFile(null); // Reset file input
    } catch (error) {
      alert('Failed to upload file. Please try again.');
    }
  };

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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productList = await GetProducts(dispatch,navigate);
        setProducts(Array.isArray(productList) ? productList : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      finally {
        setLoading(false); // Stop loading after fetch
      }
    };
    fetchProducts();
  }, [dispatch,navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await GetCategories(dispatch,navigate);
        
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [dispatch, isNewCategory,navigate]);

  
  

  const handleDelete = async (id) => {
    try {
      await DeleteProductFromDb(id, dispatch,navigate);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedCategory || newProductName.trim() === '' || newAvailableItems.trim() === '' || newCost.trim() === '' || !img) {
      alert('Please select a category and enter product details along with the image.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('name', newProductName);
      formData.append('available_items', newAvailableItems);
      formData.append('each_item_cost', newCost);
      formData.append('image', img); // Add the image file
      console.log("hiii",formData.name);
      console.log("image",img);
  
      // Now make a POST request to the backend with the FormData
      const addedProduct = await AddProductToDb(formData, dispatch,navigate);
    
  
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
  
      setNewProductName('');
      setNewAvailableItems('');
      setNewCost('');
      setShowAddForm(false);
      setSelectedCategory(null);
      setImg(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  
  const totalPages = Array.isArray(products) && products.length > 0 
    ? Math.ceil(products.length / itemsPerPage) 
    : 0;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = Array.isArray(products) && products.length > 0 
    ? products.slice(startIndex, startIndex + itemsPerPage) 
    : [];
  


  const handleSaveCategory = async () => {
    if (isNewCategory) {
      if (newCategoryName.trim() === '') {
        alert('Please enter a valid category name.');
        return;
      }

      try {
        const addedCategory = await addCategoryToDb(newCategoryName,navigate);

        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories, addedCategory];
          return updatedCategories;
        });

        setSelectedCategory(addedCategory.name);
        setNewCategoryName('');
        setIsNewCategory(false);
      } catch (error) {
        if (error.message === 'Category already exists...') {
          alert('This category already exists. Please choose a different name.');
        } else {
          alert('Failed to add category. Please try again.');
        }
      }
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading products...</h1>
        <div class="loader"></div>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
      <header className="bg-purple-600 fixed top-0 left-0 right-0 z-10 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <ToggleMenu />
          <h1 className="text-lg font-semibold text-white">Current Inventory</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-700' : 'bg-purple-600'} text-white`}
          >
            <List size={24} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-700' : 'bg-purple-600'} text-white`}
          >
            <Grid size={24} />
          </button>
        </div>
      </header>

      <main className="pt-16 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex flex-col space-y-5 mt-12">
            <div className="flex gap-4 items-center mt-6">
              <h2 className="text-lg font-semibold">Total products</h2>
              <div className="shadow-lg hover:bg-yellow-400 w-12 h-10 rounded flex items-center justify-center bg-yellow-200 text-lg font-semibold">
                {products.length}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="bg-blue-500 text-white font-bold px-4 py-2 mt-10 rounded hover:bg-blue-600"
          >
            {showAddForm ? 'Cancel' : '+ Add New'}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4">
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'addNew') {
                  setIsNewCategory(true);
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(value);
                  setIsNewCategory(false);
                }
              }}
              className="p-2 border border-gray-300 rounded w-auto mb-4"
            >
              <option value="addNew" className="text-blue-700 font-semibold px-4 py-2 hover:bg-gray-300">+ Add New</option>
              <option value="" disabled>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {isNewCategory && (
              <div>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter New Category"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <button
                  onClick={handleSaveCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Category
                </button>
              </div>
            )}

            {!isNewCategory && selectedCategory && (
              <div>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Product Name"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <input
                  type="number"
                  value={newAvailableItems}
                  onChange={(e) => setNewAvailableItems(e.target.value)}
                  placeholder="Available Items"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  placeholder="Each Item Cost"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                  <input
                    type="file"
                    name="image"
                    accept="image/*,video/*,application/pdf"  
                    onChange={handleFileimg}
                    className="border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                  />
                <button
                  onClick={handleAdd}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Product
                </button>
              </div>
            )}
          </div>
        )}
           <div className="my-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleFileUpload}
            className="bg-green-500 text-white px-2  rounded hover:bg-green-600"
          >
            Upload CSV
          </button>
        </div>
        </main>
      <div className="text-center">
        <h2>No products available</h2>
        <p>Please add new products to see them listed here.</p>
      </div>
      </div>
    );
  }

  

  return (
    <div className="mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 xl:p-10">
      <header className="bg-purple-600 fixed top-0 left-0 right-0 z-10 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <ToggleMenu />
          <h1 className="text-lg font-semibold text-white">Current Inventory</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-700' : 'bg-purple-600'} text-white`}
          >
            <List size={24} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-700' : 'bg-purple-600'} text-white`}
          >
            <Grid size={24} />
          </button>
        </div>
      </header>

      <main className="pt-16 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex flex-col space-y-5 mt-12">
            <div className="flex gap-4 items-center mt-6">
              <h2 className="text-lg font-semibold">Total products</h2>
              <div className="shadow-lg hover:bg-yellow-400 w-12 h-10 rounded flex items-center justify-center bg-yellow-200 text-lg font-semibold">
                {products.length}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="bg-blue-500 text-white font-bold px-4 py-2 mt-10 rounded hover:bg-blue-600"
          >
            {showAddForm ? 'Cancel' : '+ Add New'}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4">
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'addNew') {
                  setIsNewCategory(true);
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(value);
                  setIsNewCategory(false);
                }
              }}
              className="p-2 border border-gray-300 rounded w-full mb-4"
            >
              <option value="addNew" className="text-blue-700 font-semibold px-4 py-2 hover:bg-gray-300">+ Add New</option>
              <option value="" disabled>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {isNewCategory && (
              <div>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter New Category"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <button
                  onClick={handleSaveCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Category
                </button>
              </div>
            )}

            {!isNewCategory && selectedCategory && (
              <div>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Product Name"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <input
                  type="number"
                  value={newAvailableItems}
                  onChange={(e) => setNewAvailableItems(e.target.value)}
                  placeholder="Available Items"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  placeholder="Each Item Cost"
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                  <input
                    type="file"
                    name="image"
                    accept="image/*,video/*,application/pdf"  
                    onChange={handleFileimg}
                    className="border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                  />
                <button
                  onClick={handleAdd}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Product
                </button>
              </div>
            )}
          </div>
        )}
           <div className="my-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleFileUpload}
            className="bg-green-500 text-white px-2  rounded hover:bg-green-600"
          >
            Upload CSV
          </button>
        </div>
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">Product Name</th>
                  {/* <th className="p-2 text-left">Category</th> */}
                  <th className="p-2 text-left">Available Items</th>
                  {/* <th className="p-2 text-left">Each Item Cost</th> */}
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length ? currentItems.map((product)=> (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{product.name}</td>
                    {/* <td className="p-2">{product.category}</td> */}
                    <td className="p-2">{product.available_items}</td>
                    {/* <td className="p-2">{product.each_item_cost}</td> */}
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                )):(
                  <div className="col-span-4 text-center py-4">No Products found</div>
                )}
                
              </tbody>
            </table>
            <div>
    </div>    
          </div>
          
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentItems.map((product) => (
              <div key={product.id} className="bg-white border rounded-lg shadow-md p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                {/* <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p> */}
                <p className="text-sm text-gray-600 mb-2">Available Items: {product.available_items}</p>
                {/* <p className="text-sm text-gray-600 mb-2">Each Item Cost: {product.each_item_cost}</p> */}
                {product.image && product.image_type && (
                <img 
                  src={`http://localhost:4000/api/getimage/${product.id}`}
                  alt={product.name} 
                  className="w-full h-50 object-cover mb-2 rounded" 
                />
              )}
                <button
                  onClick={() => handleDelete(product.id)}
                  className="mt-auto text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div> 
        )}
      </main>
      {!loading && <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />}
    </div>

    
  );
  
};

export default InventoryView;







 



  















