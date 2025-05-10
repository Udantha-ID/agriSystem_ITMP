import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon, DocumentTextIcon, ShoppingCartIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import PlantationSidebar from '../../Components/PlantationSidebar';

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0
  });
  const [reportData, setReportData] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    categoryBreakdown: {}
  });

  const categories = ['coconuts', 'oil', 'beverages', 'baking', 'snacks', 'vegetables', 'fertilizers'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setInventory(data);
        
        // Calculate stats
        const totalProducts = data.length;
        const totalValue = data.reduce((sum, item) => sum + (item.price * item.stock), 0);
        const lowStockItems = data.filter(item => item.stock <= item.threshold).length;
        
        setStats({
          totalProducts,
          totalValue,
          lowStockItems
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`http://localhost:5000/products/${id}`, {
          method: 'DELETE'
        });
        setInventory(inventory.filter(item => item._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      const updatedProduct = await response.json();
      setInventory(inventory.map(item => item._id === updatedProduct._id ? updatedProduct : item));
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = () => {
    // Calculate report metrics
    const totalProducts = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
    const lowStockItems = inventory.filter(item => item.stock <= item.threshold).length;
    
    // Generate category breakdown
    const categoryBreakdown = {};
    inventory.forEach(item => {
      if (!categoryBreakdown[item.category]) {
        categoryBreakdown[item.category] = {
          count: 0,
          value: 0
        };
      }
      categoryBreakdown[item.category].count += 1;
      categoryBreakdown[item.category].value += (item.price * item.stock);
    });

    setReportData({
      totalProducts,
      totalValue,
      lowStockItems,
      categoryBreakdown
    });

    setIsReportModalOpen(true);
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Inventory Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            body { 
              font-family: 'Poppins', sans-serif;
              padding: 30px;
              color: #334155;
              background-color: #f8fafc;
            }
            h1 { 
              color: #1e40af;
              text-align: center;
              font-weight: 700;
              margin-bottom: 5px;
            }
            h2 {
              color: #1e40af;
              font-weight: 600;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 8px;
              margin-top: 30px;
            }
            .report-header { 
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
            }
            .report-date { 
              color: #6b7280;
              font-size: 14px;
            }
            .company-name {
              font-size: 18px;
              font-weight: 600;
              color: #475569;
              margin-top: 5px;
            }
            .metrics { 
              display: flex;
              justify-content: space-between;
              margin: 30px 0;
              gap: 20px;
            }
            .metric-card { 
              border-radius: 10px;
              padding: 20px;
              width: 31%;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .metric-card:nth-child(1) {
              background: linear-gradient(135deg, #c7d2fe, #e0e7ff);
              border: 1px solid #a5b4fc;
            }
            .metric-card:nth-child(2) {
              background: linear-gradient(135deg, #bae6fd, #dbeafe);
              border: 1px solid #93c5fd;
            }
            .metric-card:nth-child(3) {
              background: linear-gradient(135deg, #fecaca, #fee2e2);
              border: 1px solid #fca5a5;
            }
            .metric-title { 
              font-size: 14px;
              color: #475569;
              margin-bottom: 8px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .metric-value { 
              font-size: 28px;
              font-weight: 700;
              color: #1e293b;
            }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            th, td { 
              padding: 14px 20px;
              text-align: left;
            }
            th { 
              background-color: #1e40af;
              color: white;
              font-weight: 500;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) { 
              background-color: #f1f5f9;
            }
            tr:hover {
              background-color: #e2e8f0;
            }
            .category-name { 
              font-weight: 600;
              color: #1e293b;
            }
            .low-stock {
              color: #dc2626;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #6b7280;
              font-size: 14px;
            }
            .product-value {
              font-weight: 600;
              color: #059669;
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>Inventory Report</h1>
            <div class="company-name">Agri System Enterprise</div>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          </div>
          
          <div class="metrics">
            <div class="metric-card">
              <div class="metric-title">Total Products</div>
              <div class="metric-value">${reportData.totalProducts}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Total Inventory Value</div>
              <div class="metric-value">Rs. ${reportData.totalValue.toFixed(2)}</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Low Stock Items</div>
              <div class="metric-value">${reportData.lowStockItems}</div>
            </div>
          </div>
          
          <h2>Category Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Product Count</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(reportData.categoryBreakdown).map(([category, data]) => `
                <tr>
                  <td class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                  <td>${data.count}</td>
                  <td class="product-value">Rs. ${data.value.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>Inventory Details</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${inventory.map(product => `
                <tr>
                  <td class="category-name">${product.name}</td>
                  <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                  <td>Rs. ${product.price.toFixed(2)}</td>
                  <td ${product.stock <= product.threshold ? 'class="low-stock"' : ''}>${product.stock} ${product.stock <= product.threshold ? '(Low)' : ''}</td>
                  <td class="product-value">Rs. ${(product.price * product.stock).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Agri System Enterprise. All rights reserved.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  // Filter inventory based on search term and category
  const filteredInventory = inventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <PlantationSidebar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your products, track stock levels, and generate reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 transition duration-300 hover:shadow-lg">
            <div className="p-5 bg-gradient-to-r from-indigo-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium uppercase tracking-wider opacity-80">Total Products</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.totalProducts}</h3>
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg">
                  <ShoppingCartIcon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white px-5 py-3">
              <div className="text-xs text-gray-500">Updated just now</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 transition duration-300 hover:shadow-lg">
            <div className="p-5 bg-gradient-to-r from-blue-500 to-cyan-600">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium uppercase tracking-wider opacity-80">Inventory Value</p>
                  <h3 className="text-3xl font-bold mt-1">Rs. {stats.totalValue.toFixed(2)}</h3>
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white px-5 py-3">
              <div className="text-xs text-gray-500">Updated just now</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 transition duration-300 hover:shadow-lg">
            <div className="p-5 bg-gradient-to-r from-red-500 to-pink-600">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium uppercase tracking-wider opacity-80">Low Stock Items</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.lowStockItems}</h3>
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-lg">
                  <ExclamationCircleIcon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white px-5 py-3">
              <div className="text-xs text-gray-500">Updated just now</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Product Inventory</h2>
            <div className="flex space-x-3">
              <button 
                onClick={generateReport}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 shadow"
              >
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Generate Report
              </button>
              <button 
                onClick={() => navigate('/addproduct')}
                className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 shadow"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 p-6 bg-gray-50 border-b border-gray-100">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200"
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
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
                <ExclamationCircleIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Inventory</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredInventory.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No products match your search criteria.
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Rs.)</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInventory.map(product => (
                      <tr key={product._id} className="hover:bg-indigo-50 transition-colors duration-150">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900">
                          Rs. {product.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock <= product.threshold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {product.stock} {product.stock <= product.threshold && '(Low)'}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsEditModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-150"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-5">
              <h3 className="text-lg font-semibold text-gray-800">Edit Product</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition duration-200"
                    value={editingProduct?.stock || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-200"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-5 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-indigo-900">Inventory Report</h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">Inventory Summary Report</h2>
                <p className="text-gray-500">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md border border-indigo-200">
                  <div className="text-sm text-indigo-600 uppercase tracking-wider mb-1 font-medium">Total Products</div>
                  <div className="text-3xl font-bold text-indigo-900">{reportData.totalProducts}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border border-blue-200">
                  <div className="text-sm text-blue-600 uppercase tracking-wider mb-1 font-medium">Inventory Value</div>
                  <div className="text-3xl font-bold text-blue-900">Rs. {reportData.totalValue.toFixed(2)}</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-md border border-red-200">
                  <div className="text-sm text-red-600 uppercase tracking-wider mb-1 font-medium">Low Stock Items</div>
                  <div className="text-3xl font-bold text-red-700">{reportData.lowStockItems}</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-800">Category Breakdown</h3>
              <div className="mb-8 overflow-hidden rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-indigo-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(reportData.categoryBreakdown).map(([category, data], index) => (
                      <tr key={category} className={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                        <td className="px-6 py-4 whitespace-nowrap capitalize font-medium text-indigo-900">{category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{data.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">Rs. {data.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-800">Low Stock Items</h3>
              <div className="mb-8 overflow-hidden rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-red-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Threshold</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.filter(item => item.stock <= item.threshold).map(product => (
                      <tr key={product._id} className="bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.threshold}</td>
                      </tr>
                    ))}
                    {inventory.filter(item => item.stock <= item.threshold).length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No low stock items found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handlePrintReport}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition duration-300 flex items-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;


//BJBJKBJBJB