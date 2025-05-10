import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const AddProduct = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'coconuts',
    price: '',
    stock: '',
    threshold: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['coconuts', 'oil', 'beverages', 'baking', 'snacks', 'vegetables', 'fertilizers'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('threshold', newProduct.threshold);
      formData.append('description', newProduct.description);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      
      navigate('/inventory');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/inventory')}
              className="mr-2 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Add New Product</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full p-2 border rounded"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full p-2 border rounded"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={newProduct.threshold}
                  onChange={(e) => setNewProduct({...newProduct, threshold: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="flex items-center gap-4">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-16 h-16 rounded object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-gray-500 border">
                    No Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                className="w-full p-2 border rounded"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;