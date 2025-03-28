import { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Inventory = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Organic Coconut', category: 'coconuts', price: 2.5, stock: 100, threshold: 20, lastUpdated: '2025-03-15' },
    { id: 2, name: 'Coconut Oil', category: 'oil', price: 10.99, stock: 50, threshold: 10, lastUpdated: '2025-03-18' },
    { id: 3, name: 'Coconut Flour', category: 'baking', price: 5.99, stock: 75, threshold: 15, lastUpdated: '2025-03-20' },
    { id: 4, name: 'Coconut Water', category: 'beverages', price: 3.25, stock: 120, threshold: 25, lastUpdated: '2025-03-22' },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'coconuts',
    price: '',
    stock: '',
    threshold: ''
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showLowStock, setShowLowStock] = useState(false);
  
  const categories = ['coconuts', 'oil', 'beverages', 'baking', 'snacks', 'vegetables'];

  // Filtered and sorted inventory
  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesLowStock = !showLowStock || (item.stock <= item.threshold);
      return matchesSearch && matchesCategory && matchesLowStock;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = { 
      ...newProduct, 
      id: Date.now(), 
      lastUpdated: new Date().toISOString().split('T')[0],
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      threshold: parseInt(newProduct.threshold)
    };
    
    setInventory([...inventory, productToAdd]);
    setNewProduct({ name: '', category: 'coconuts', price: '', stock: '', threshold: '' });
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setInventory(inventory.map(item => 
      item.id === editingProduct.id ? 
      { 
        ...editingProduct, 
        lastUpdated: new Date().toISOString().split('T')[0],
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        threshold: parseInt(editingProduct.threshold)
      } : item
    ));
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({...product});
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Threshold', 'Last Updated'];
    const csvData = [
      headers.join(','),
      ...inventory.map(item => 
        [item.id, item.name, item.category, item.price, item.stock, item.threshold, item.lastUpdated].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory_export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLowStock = (stock, threshold) => stock <= threshold;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <div className="flex space-x-3">
            <button 
              onClick={openAddModal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Product
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowStock"
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  checked={showLowStock}
                  onChange={() => setShowLowStock(!showLowStock)}
                />
                <label htmlFor="lowStock" className="text-sm text-gray-700">Show Low Stock Only</label>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Product
                      {sortConfig.key === 'name' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortConfig.key === 'category' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortConfig.key === 'price' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortConfig.key === 'stock' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isLowStock(item.stock, item.threshold)
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.stock} {isLowStock(item.stock, item.threshold) && '(Low)'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-green-600">{inventory.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-amber-600">
              {inventory.filter(item => item.stock <= item.threshold).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Inventory Value</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${inventory.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, name: e.target.value})
                        : setNewProduct({...newProduct, name: e.target.value})
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={editingProduct ? editingProduct.category : newProduct.category}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, category: e.target.value})
                        : setNewProduct({...newProduct, category: e.target.value})
                      }
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        step="0.01"
                        min="0"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, price: e.target.value})
                          : setNewProduct({...newProduct, price: e.target.value})
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        id="stock"
                        min="0"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={editingProduct ? editingProduct.stock : newProduct.stock}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, stock: e.target.value})
                          : setNewProduct({...newProduct, stock: e.target.value})
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      id="threshold"
                      min="0"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      value={editingProduct ? editingProduct.threshold : newProduct.threshold}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, threshold: e.target.value})
                        : setNewProduct({...newProduct, threshold: e.target.value})
                      }
                    />
                    <p className="mt-1 text-sm text-gray-500">Items will be marked as low stock when quantity falls below this number</p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;