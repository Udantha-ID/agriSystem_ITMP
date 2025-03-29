import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, XMarkIcon, HomeIcon, HeartIcon, ArrowPathIcon,
  CubeIcon, TruckIcon, StarIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon,
  UserIcon, PhoneIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  PlusIcon, MinusIcon, TrashIcon, HeartIcon as HeartSolidIcon,
  CheckCircleIcon, ChevronDownIcon
} from '@heroicons/react/24/solid';

const Marketplace = () => {
  const navigate = useNavigate(); 
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]); // Updated to Rs. range
  const [notification, setNotification] = useState(null);

  // Format price to Rs. with commas
  const formatPrice = (price) => {
    return 'Rs. ' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Mock data with Rs. prices
  const products = [
    { id: 1, name: 'Organic Coconut', price: 750, category: 'coconuts', stock: 100, rating: 4.5, description: 'Fresh organic coconuts directly from farmers.', image: '🥥', farm: 'Green Valley Farms', organic: true },
    { id: 2, name: 'Virgin Coconut Oil (500ml)', price: 3297, category: 'oil', stock: 50, rating: 4.8, description: 'Cold-pressed virgin coconut oil with no additives.', image: '🧴', farm: 'Tropical Organics', organic: true },
    { id: 3, name: 'Fresh Spinach (1kg)', price: 597, category: 'vegetables', stock: 200, rating: 4.2, description: 'Locally grown spinach harvested within 24 hours.', image: '🥬', farm: 'River Meadow Farm', organic: true },
    { id: 4, name: 'Organic Carrots (1kg)', price: 447, category: 'vegetables', stock: 150, rating: 4.0, description: 'Sweet and crunchy organic carrots.', image: '🥕', farm: 'Sunrise Farm', organic: true },
    { id: 5, name: 'Organic Fertilizer (5kg)', price: 4797, category: 'fertilizers', stock: 75, rating: 4.7, description: 'Plant-based organic fertilizer for all crops.', image: '🌱', farm: 'EcoGrow Solutions', organic: true },
    { id: 6, name: 'Brown Coconut', price: 597, category: 'coconuts', stock: 80, rating: 3.9, description: 'Traditional coconuts great for cooking.', image: '🥥', farm: 'Coastal Farms', organic: false },
    { id: 7, name: 'Coconut Milk (1L)', price: 1047, category: 'oil', stock: 120, rating: 4.3, description: 'Pure coconut milk with no preservatives.', image: '🥛', farm: 'Tropical Delights', organic: true },
    { id: 8, name: 'NPK Fertilizer (5kg)', price: 3897, category: 'fertilizers', stock: 90, rating: 4.4, description: 'Balanced NPK fertilizer for healthy plant growth.', image: '🧪', farm: 'Harvest Boost', organic: false },
  ];

  const categories = [
    { name: 'all', icon: HomeIcon, count: products.length },
    { name: 'coconuts', icon: CubeIcon, count: products.filter(p => p.category === 'coconuts').length },
    { name: 'oil', icon: StarIcon, count: products.filter(p => p.category === 'oil').length },
    { name: 'vegetables', icon: TruckIcon, count: products.filter(p => p.category === 'vegetables').length },
    { name: 'fertilizers', icon: CubeIcon, count: products.filter(p => p.category === 'fertilizers').length }
  ];

  // Add item to cart with quantity tracking
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    
    showNotification(`Added ${product.name} to cart for ${formatPrice(product.price)}`);
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
    showNotification('Item removed from cart');
  };

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      showNotification('Removed from favorites');
    } else {
      setFavorites([...favorites, productId]);
      showNotification('Added to favorites');
    }
  };

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter and sort products
  const filteredAndSortedProducts = () => {
    let result = products;
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.farm.toLowerCase().includes(query)
      );
    }
    
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    switch (sortBy) {
      case 'price-low':
        return result.sort((a, b) => a.price - b.price);
      case 'price-high':
        return result.sort((a, b) => b.price - a.price);
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      case 'recommended':
      default:
        return result;
    }
  };

  const displayProducts = filteredAndSortedProducts();
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCost = 300; // Rs. 300 flat shipping rate

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-6 justify-end">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 bg-white text-green-700 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors shadow-sm font-medium"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </button>
            
            <button className="flex items-center gap-2 bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors shadow-sm backdrop-blur-sm font-medium">
              <UserIcon className="w-5 h-5" />
              <span>Profile</span>
            </button>
            
            <button className="flex items-center gap-2 bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors shadow-sm backdrop-blur-sm font-medium">
              <HeartIcon className="w-5 h-5" />
              <span>Favorites</span>
            </button>
            
            <button className="flex items-center gap-2 bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors shadow-sm backdrop-blur-sm font-medium">
              <PhoneIcon className="w-5 h-5" />
              <span>Contact</span>
            </button>
            
            <button className="flex items-center gap-2 bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors shadow-sm backdrop-blur-sm font-medium">
              <InformationCircleIcon className="w-5 h-5" />
              <span>About Us</span>
            </button>
          </div>
        
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Farm Fresh Products</h1>
          <p className="text-xl opacity-90 mb-6">Direct from Sri Lankan farmers to your doorstep</p>
          
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for products, farms, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white w-full py-3 px-5 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
            />
            <MagnifyingGlassIcon className="w-6 h-6 absolute right-4 top-3 text-gray-500" />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(({ name, icon: Icon, count }) => (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 capitalize transition-all whitespace-nowrap ${
                  selectedCategory === name 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" /> 
                <span>{name}</span>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative">
              <button 
                onClick={() => document.getElementById('sort-dropdown').classList.toggle('hidden')}
                className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>Sort</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              <div 
                id="sort-dropdown" 
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden z-10"
              >
                {[
                  { id: 'recommended', label: 'Recommended' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Highest Rated' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      document.getElementById('sort-dropdown').classList.add('hidden');
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      sortBy === option.id ? 'text-green-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showFilters 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
            
            <button 
              onClick={() => setShowCart(!showCart)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fadeIn">
            <h3 className="font-semibold text-lg mb-4">Refine Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">Certified Organic Products</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farms
                </label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                  <option value="">All Farms</option>
                  {[...new Set(products.map(p => p.farm))].map(farm => (
                    <option key={farm} value={farm}>{farm}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{displayProducts.length}</span> products
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                  <span className="text-6xl">{product.image}</span>
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    {favorites.includes(product.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {product.organic && (
                    <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Organic
                    </span>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    From: {product.farm}
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-green-700">{formatPrice(product.price)}</span>
                    <span className={`text-sm ${product.stock > 50 ? 'text-green-600' : product.stock > 10 ? 'text-orange-500' : 'text-red-500'}`}>
                      {product.stock > 50 ? 'In stock' : product.stock > 10 ? 'Limited stock' : 'Low stock'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex justify-center items-center gap-2 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceRange([0, 5000]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={() => setShowCart(false)}>
          <div className="w-full max-w-md bg-white h-full shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingCartIcon className="w-6 h-6" /> Your Cart
                  </h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                {cart.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
                  </p>
                )}
              </div>
              
              <div className="flex-grow overflow-auto p-6">
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-4 py-3 border-b">
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0">
                          {item.product.image}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-gray-500 text-sm">{item.product.farm}</p>
                          <div className="text-green-700 font-bold mt-1">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          <div className="flex items-center gap-2 border rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-600 text-sm mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🛒</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add items to get started</p>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(cartTotal + shippingCost)}</span>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex justify-center items-center gap-2">
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="w-full text-green-600 py-2 mt-3 hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {notification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn z-50">
          <CheckCircleIcon className="w-5 h-5 text-green-400" />
          {notification}
        </div>
      )}
    </div>
  );
};

export default Marketplace;