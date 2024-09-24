import React, { useContext, useState, useEffect } from 'react';
import ToggleMenu from './ToggleMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { GetProducts } from '../Services/ContextStateManagement/Action/productsAction';
import { GlobalContext } from '../Services/GlobalProvider';
import { addProductToCart } from '../Services/ContextStateManagement/Action/userOrderAddToCart';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => <FontAwesomeIcon icon={faShoppingCart} size="lg" />;
const CartShppingIcon = () => <ShoppingCartIcon style={{ fontSize: 45 }} />;


const ProductCard = ({ id,name, quantity: initialQuantity, price, onClick, productCounts }) => {
  const count = productCounts[id] || 0;

  const handleImageClick = (e) => {
    if (e.target.closest('button') || e.target.classList.contains('quantity-display')) {
      return;
    }

    if (initialQuantity > 0) {
      const newCount = count + 1;
      onClick(id, name, newCount, price); // Pass the updated count
    }
  };

  const handleIncrement = () => {
    if (initialQuantity > 0) {
      const newCount = count + 1;
      onClick(id, name, newCount, price);
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      onClick(id, name, newCount, price);
    }
  };


  return (
    <div className="px-2 justify-around">
      <h3 className="font-semibold text-sm mb-2 text-center">{name}</h3>
       <div className= "">
       <div
        className="bg-white rounded-lg shadow-md flex flex-col w-40 h-60 overflow-hidden product-card"
          onClick={handleImageClick}
          style={{
            backgroundImage: `url(http://localhost:4000/api/getimage/${id})`,
            backgroundSize: 'cover', // Ensures the image covers the entire div
            backgroundPosition: 'center', // Centers the image
            backgroundRepeat: 'no-repeat', // Prevents the image from repeating
          }}
        >
                
    
    
        <div className="relative flex justify-between items-center mt-auto p-2 rounded-b-lg">
          <div className="text-xs font-semibold bg-white rounded-full px-2 shadow-md mt-10 ml-3">
            {initialQuantity}
          </div>
          <div className="flex flex-col items-center bg-pink-100 rounded-full mb-3 mr-2">
            <button
              onClick={handleIncrement}
              className="p-1 text-sm font-bold"
              disabled={initialQuantity === 0}
            >
              +
            </button>
            <span className="px-2 text-sm text-center">{count}</span>
            <button
              onClick={handleDecrement}
              className="p-1 text-sm font-bold"
              disabled={count === 0}
            >
              -
            </button>
          </div>
        </div>
      </div>
      </div>
      <div className="mt-2">
        <span className="font-bold ml-7">₹{price}</span>
      </div>
    </div>
  );
};

const CategorySection = ({ categoryName, products, onProductClick, productCounts, isOpen, toggleSection }) => {
  return (
    <div className="mb-12 mt-4">
      <h2
        className="text-lg font-bold mb-4 text-center bg-yellow-500 rounded-lg p-2 shadow-md cursor-pointer"
        onClick={toggleSection}
      >
        {categoryName}
      </h2>
      {isOpen && (
        <div className="relative">
          <div className='max-h-[calc(100vh-12rem)] overflow-y-auto p-4'>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4 place-self-auto">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}              
                {...product}
                onClick={onProductClick}
                productCounts={productCounts}
              />
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductSelectionPage = () => {
  const navigate = useNavigate();
  const context = useContext(GlobalContext);
  const { dispatch } = context;
  const [ProductData, setProductData] = useState([]);
  const [cart, setCart] = useState({});
  const [productCounts, setProductCounts] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await GetProducts(dispatch, navigate);
        setProductData(Array.isArray(productList)? productList:[]); // Update the state

        // Initialize openCategories with the first category open
        if (productList.length > 0) {
          const firstCategory = productList[0].category_name;
          const initialCategories = productList.reduce((acc, product) => {
            acc[product.category_name] = product.category_name === firstCategory;
            return acc;
          }, {});
          setOpenCategories(initialCategories);
        }
      } catch (error) {
        console.error('Error fetching products data:', error);
        setProductData([]);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchProducts();
  }, [dispatch, navigate]);

  const handleProductClick = (id, pname, count, price) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: {
        id,
        pname,
        count,
        price,
        totalCost: count * price,
      },
    }));

    setProductCounts((prevCounts) => ({
      ...prevCounts,
      [id]: count,
    }));
  };

  const handleCartButtonClick = async () => {
    console.log('Cart Contents:');
    if (Object.keys(cart).length === 0) {
      return alert('No Products are Selected');
    }
    Object.values(cart).forEach((item) => {
      if (item.count) {
        console.log(`Product ID: ${item.id}, ProductName: ${item.pname}, Clicks: ${item.count}, PieceCost: ₹${item.price}, Total Cost: ₹${item.totalCost}`);
      }
    });

    try {
      await addProductToCart(dispatch, cart,navigate);
      console.log('Added to cart');
      setCart({}); // Reset the cart
      setProductCounts({}); // Reset the product counts
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  
  
  const handleGotoCart = () => {
    navigate('/mycart');
  };

  const data = Array.isArray(ProductData) ? ProductData.map(product => ({
    id: product.id,
    name: product.name,
    quantity: product.available_items,
    price: parseInt(product.each_item_cost),
    image: product.image || 'https://via.placeholder.com/150?text=Marlboro',
    category: product.category_name,
  })) : [];

  // Group products by category
  const categories = data.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  // Toggle category section visibility
  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
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
  if (ProductData.length === 0) {
    return (
      <div className="w-full ">
        <h1 className="flex flex-row items-center justify-between text-xl lg:text-3xl font-semibold mb-4 bg-pink-300 rounded p-3">
          <ToggleMenu />
          <div className="flex-1 text-center">Buddy Shop</div>
        </h1>
        <div className="space-y-4 px-4"></div>
      <div className="justify-center items-center h-screen">
        <h1>No products added</h1>
        
      </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-purple-500 p-4 flex  items-center fixed top-0 left-0 right-0 z-10">
        <ToggleMenu />
        <span className="text-white text-lg lg:text-4xl font-bold ml-3">Buddy Shop</span>
      </div>
      <main className="flex-1 mt-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {(Object.keys(categories).map((categoryName) => (
            <CategorySection
              key={categoryName}
              categoryName={categoryName}
              products={categories[categoryName]}
              onProductClick={handleProductClick}
              productCounts={productCounts} // Pass the product counts down
              isOpen={!!openCategories[categoryName]}
              toggleSection={() => toggleCategory(categoryName)}
            />
          )))}
        </div>
      </main>
      <div className="fixed bottom-12 right-0 p-8">
        <button
          className="w-30 h-15 mb-3 text-blue bg-green-400 hover:bg-green-700 font-semibold p-8 rounded-full shadow-lg"
          onClick={handleCartButtonClick}
        >
          <CartShppingIcon />
        </button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleGotoCart}
          className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-full shadow-lg"
        >
          Go to Cart <CartIcon />
        </button>
      </div>
    </div>
  );
};

export default ProductSelectionPage;
