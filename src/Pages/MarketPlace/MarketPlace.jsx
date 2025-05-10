import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, XMarkIcon, HeartIcon, ArrowLeftIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PlusIcon, MinusIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  // Predefined categories list
  const predefinedCategories = ['oil', 'beverage', 'snack', 'fertilizers'];
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedImages, setLoadedImages] = useState({});
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setAllProducts(data);
        setProducts(data);
        
        // Extract unique categories from products
        const productCategories = [...new Set(data.map(product => product.category))];
        // Combine with predefined categories and remove duplicates
        const mergedCategories = [...new Set([...productCategories, ...predefinedCategories])];
        setCategories(mergedCategories.sort());
        
        setLoadedImages({});
        setFailedImages({});
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();

    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Filter products when category or search term changes
  useEffect(() => {
    let filteredProducts = allProducts;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Apply search filter if there's a search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term))
      );
    }
    
    setProducts(filteredProducts);
  }, [selectedCategory, searchTerm, allProducts]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      return existing ? 
        prev.map(item => 
          item.product._id === product._id ? 
          {...item, quantity: item.quantity + 1} : item
        ) : 
        [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prev => prev.map(item => 
      item.product._id === productId ? 
      {...item, quantity: Math.max(1, newQuantity)} : item
    ));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) ? 
      prev.filter(id => id !== productId) : 
      [...prev, productId]
    );
  };

  const handleImageLoad = (productId) => {
    setLoadedImages(prev => ({ ...prev, [productId]: true }));
    setFailedImages(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageError = (productId) => {
    setFailedImages(prev => ({ ...prev, [productId]: true }));
    setLoadedImages(prev => ({ ...prev, [productId]: false }));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Colorful Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="mr-4 p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-200"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold">Farm Fresh Marketplace</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-emerald-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-emerald-400 rounded-lg placeholder-emerald-100 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-200 hover:text-white"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => setShowCart(true)}
                className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-200 shadow-sm"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Cart</span>
                <span className="inline-flex items-center justify-center bg-emerald-600 text-white rounded-full h-5 w-5 text-xs font-medium">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="mb-2">
            <div className="flex items-center mb-3">
              <FunnelIcon className="w-5 h-5 text-emerald-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Filter by Category</h2>
            </div>
            <div className="flex flex-nowrap gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-100">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                  ${selectedCategory === 'all' 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap flex-shrink-0
                    ${selectedCategory === category 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <span className="font-medium capitalize">Showing: {selectedCategory}</span>
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              {searchTerm && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <span className="font-medium">Search: "{searchTerm}"</span>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              {products.length > 0 && (
                <div className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm flex items-center">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                </div>
              )}
              {(selectedCategory !== 'all' || searchTerm) && (
                <button 
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 text-sm flex items-center gap-1"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-center my-8">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Products</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-md text-center my-8">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">No Products Found</h3>
            <p className="text-yellow-700">No products available in the selected category.</p>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full border border-gray-100">
                <div className="relative h-48 bg-gradient-to-b from-gray-50 to-gray-100">
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={product.imageUrl || `https://via.placeholder.com/300/f3f4f6/64748b?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300/f3f4f6/64748b?text=${encodeURIComponent(product.name)}`;
                      }}
                    />
                  </div>
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition duration-200"
                  >
                    {favorites.includes(product._id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 capitalize">{product.category}</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-1 text-gray-800 truncate">{product.name}</h3>
                  <div className="mt-auto pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Rs.{product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition duration-200 shadow-sm"
                    >
                      <PlusIcon className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
            <div className="bg-white w-full max-w-md h-full shadow-xl flex flex-col">
              <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <div className="flex items-center">
                  <span className="bg-white text-emerald-800 text-xs font-medium rounded-full px-2 py-0.5 mr-2">
                    {cartItemCount} items
                  </span>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="text-white hover:text-emerald-100 bg-white bg-opacity-20 p-1 rounded-full"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCartIcon className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.product._id} className="flex gap-4 py-4 border-b">
                        <div className="w-16 h-16 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <div className="w-full h-full flex items-center justify-center">
                            <img 
                              src={item.product.imageUrl || `https://via.placeholder.com/100/f3f4f6/64748b?text=${encodeURIComponent(item.product.name.substring(0, 10))}`}
                              alt={item.product.name}
                              className="max-h-full max-w-full object-contain p-1"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/100/f3f4f6/64748b?text=${encodeURIComponent(item.product.name.substring(0, 10))}`;
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">{item.product.name}</h3>
                          <p className="text-emerald-600 font-medium">Rs.{item.product.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2 bg-gray-100 rounded-lg p-1 inline-flex">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="p-1 rounded hover:bg-gray-200"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-1 rounded hover:bg-gray-200"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Rs.{(item.product.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-red-500 hover:text-red-700 text-sm mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t p-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>Rs.{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span>Shipping:</span>
                        <span>Rs.50.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Total:</span>
                        <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Rs.{(cartTotal + 50).toFixed(2)}</span>
                      </div>
                      <button 
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition duration-200 shadow-sm"
                        onClick={() => {
                          alert('Order placed successfully!');
                          setCart([]);
                          setShowCart(false);
                        }}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;


//sadwaaaaaaaaaaa