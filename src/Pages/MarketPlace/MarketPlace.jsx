import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, XMarkIcon, HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PlusIcon, MinusIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
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
        setProducts(data);
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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <h1 className="text-2xl font-bold">Farm Fresh Marketplace</h1>
          </button>
          <button 
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Cart ({cartItemCount})
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
                <div className="relative h-48 bg-gray-100">
                  {product.imageUrl ? (
                    <>
                      {!failedImages[product._id] && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            loadedImages[product._id] ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => handleImageLoad(product._id)}
                          onError={() => handleImageError(product._id)}
                        />
                      )}
                      {failedImages[product._id] && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500">Image not available</span>
                        </div>
                      )}
                      {!loadedImages[product._id] && !failedImages[product._id] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-pulse bg-gray-300 w-full h-full"></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                  >
                    {favorites.includes(product._id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 capitalize">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Rs.{product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
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
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Your Cart ({cartItemCount})</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCartIcon className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="text-green-600 hover:underline"
                    >
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.product._id} className="flex gap-4 py-4 border-b">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.product.imageUrl ? (
                            <img 
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.className = 'w-full h-full flex items-center justify-center text-xs text-gray-400';
                                e.target.innerText = 'Image not available';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.product.name}</h3>
                          <p className="text-gray-600 text-sm">₹{item.product.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
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
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span>Shipping:</span>
                        <span>₹50.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Total:</span>
                        <span>₹{(cartTotal + 50).toFixed(2)}</span>
                      </div>
                      <button 
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
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