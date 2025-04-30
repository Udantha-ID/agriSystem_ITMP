import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, XMarkIcon, HomeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { PlusIcon, MinusIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      return existing 
        ? prev.map(item => 
            item.product._id === product._id 
              ? {...item, quantity: item.quantity + 1} 
              : item
          )
        : [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prev => prev.map(item => 
      item.product._id === productId 
        ? {...item, quantity: Math.max(1, newQuantity)} 
        : item
    ));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Farm Fresh Marketplace</h1>
          <button 
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow"
                  >
                    {favorites.includes(product._id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹{product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <PlusIcon className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full shadow-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button onClick={() => setShowCart(false)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Your cart is empty</div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.product._id} className="flex gap-4 py-4 border-b">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          {item.product.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-gray-600 text-sm">₹{item.product.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span>Shipping:</span>
                        <span>₹50.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>₹{(cartTotal + 50).toFixed(2)}</span>
                      </div>
                      <button className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg">
                        Checkout
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