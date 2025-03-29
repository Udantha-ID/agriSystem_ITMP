import { useState, useEffect, useRef } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChartBarIcon,
  PhotoIcon,
  ExclamationCircleIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  QrCodeIcon,
  CurrencyDollarIcon,
  ArrowsUpDownIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Organic Coconut', category: 'coconuts', price: 750, stock: 100, threshold: 20, lastUpdated: '2025-03-15', image: null, sales: 45, supplier: 'Tropical Imports', location: 'Warehouse A', quantityType: 'kg' },
    { id: 2, name: 'Coconut Oil', category: 'oil', price: 3500, stock: 50, threshold: 10, lastUpdated: '2025-03-18', image: null, sales: 78, supplier: 'Natural Oils Co.', location: 'Warehouse B', quantityType: 'liter' },
    { id: 3, name: 'Coconut Flour', category: 'baking', price: 1800, stock: 75, threshold: 15, lastUpdated: '2025-03-20', image: null, sales: 32, supplier: 'Baking Supplies Inc.', location: 'Warehouse A', quantityType: 'kg' },
    { id: 4, name: 'Coconut Water', category: 'beverages', price: 1200, stock: 10, threshold: 25, lastUpdated: '2025-03-22', image: null, sales: 120, supplier: 'Healthy Drinks Ltd.', location: 'Warehouse C', quantityType: 'liter' },
    { id: 5, name: 'Coconut Milk', category: 'beverages', price: 1350, stock: 65, threshold: 20, lastUpdated: '2025-03-25', image: null, sales: 55, supplier: 'Healthy Drinks Ltd.', location: 'Warehouse B', quantityType: 'liter' },
    { id: 6, name: 'Coconut Snack Bites', category: 'snacks', price: 2100, stock: 30, threshold: 15, lastUpdated: '2025-03-26', image: null, sales: 89, supplier: 'Snack Foods Co.', location: 'Warehouse A', quantityType: 'packet' },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'coconuts',
    price: '',
    stock: '',
    threshold: '',
    image: null,
    supplier: '',
    location: '',
    sales: 0,
    quantityType: 'kg'
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showLowStock, setShowLowStock] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [batchActionMode, setBatchActionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: null, id: null });
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [stockRange, setStockRange] = useState([0, 200]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const categories = ['coconuts', 'oil', 'beverages', 'baking', 'snacks', 'vegetables'];
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D'];
  const suppliers = ['Tropical Imports', 'Natural Oils Co.', 'Baking Supplies Inc.', 'Healthy Drinks Ltd.', 'Snack Foods Co.'];
  const quantityTypes = ['kg', 'liter', 'gram', 'packet', 'piece', 'box'];

  useEffect(() => {
    const simulateLoading = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    
    simulateLoading();
  }, [searchTerm, filterCategory, showLowStock, selectedLocation, selectedSupplier, stockRange, priceRange]);

  const handleLogout = () => {
    // Here you would typically clear authentication tokens or user data
    // For this example, we'll just navigate to the login page
    navigate('/login');
    showNotification('You have been logged out', 'info');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesLowStock = !showLowStock || (item.stock <= item.threshold);
      const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
      const matchesSupplier = selectedSupplier === 'all' || item.supplier === selectedSupplier;
      const matchesStockRange = item.stock >= stockRange[0] && item.stock <= stockRange[1];
      const matchesPriceRange = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesLowStock && 
             matchesLocation && matchesSupplier && matchesStockRange && matchesPriceRange;
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
      threshold: parseInt(newProduct.threshold),
      sales: 0
    };
    
    setInventory([...inventory, productToAdd]);
    setNewProduct({ 
      name: '', 
      category: 'coconuts', 
      price: '', 
      stock: '', 
      threshold: '', 
      image: null,
      supplier: '',
      location: '',
      sales: 0,
      quantityType: 'kg'
    });
    setIsModalOpen(false);
    showNotification('Product added successfully');
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
    showNotification('Product updated successfully');
  };

  const handleDelete = (id) => {
    setConfirmModal({ show: true, type: 'delete', id });
  };

  const confirmDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    setConfirmModal({ show: false, type: null, id: null });
    showNotification('Product deleted successfully', 'info');
  };

  const handleBatchAction = (action) => {
    if (selectedItems.length === 0) {
      showNotification('No items selected', 'error');
      return;
    }

    if (action === 'delete') {
      setConfirmModal({ show: true, type: 'batchDelete', id: null });
    } else if (action === 'export') {
      exportSelectedToCSV();
      setBatchActionMode(false);
      setSelectedItems([]);
      showNotification('Selected items exported');
    } else if (action === 'updateStock') {
      showNotification('Stock updated for selected items');
      setBatchActionMode(false);
      setSelectedItems([]);
    }
  };

  const confirmBatchDelete = () => {
    setInventory(inventory.filter(item => !selectedItems.includes(item.id)));
    setBatchActionMode(false);
    setSelectedItems([]);
    setConfirmModal({ show: false, type: null, id: null });
    showNotification(`${selectedItems.length} products deleted`, 'info');
  };

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
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

  const openAnalyticsModal = () => {
    setIsAnalyticsModalOpen(true);
  };

  const closeAnalyticsModal = () => {
    setIsAnalyticsModalOpen(false);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Price (Rs)', 'Stock', 'Threshold', 'Quantity Type', 'Last Updated', 'Supplier', 'Location'];
    const csvData = [
      headers.join(','),
      ...inventory.map(item => 
        [item.id, item.name, item.category, item.price, item.stock, item.threshold, item.quantityType, item.lastUpdated, item.supplier, item.location].join(',')
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
    showNotification('Inventory exported successfully');
  };

  const exportSelectedToCSV = () => {
    const selectedProducts = inventory.filter(item => selectedItems.includes(item.id));
    const headers = ['ID', 'Name', 'Category', 'Price (Rs)', 'Stock', 'Threshold', 'Quantity Type', 'Last Updated', 'Supplier', 'Location'];
    const csvData = [
      headers.join(','),
      ...selectedProducts.map(item => 
        [item.id, item.name, item.category, item.price, item.stock, item.threshold, item.quantityType, item.lastUpdated, item.supplier, item.location].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected_items_export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: 'landscape' // or 'portrait'
      });
  
      // Add title and date
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Inventory Report', 14, 15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
  
      // Prepare table data
      const headers = [
        'ID', 
        'Name', 
        'Category', 
        'Price (Rs)', 
        'Stock', 
        'Threshold', 
        'Unit',
        'Location', 
        'Supplier'
      ];
  
      const data = filteredInventory.map(item => [
        item.id,
        item.name,
        item.category,
        item.price.toFixed(2),
        item.stock,
        item.threshold,
        item.quantityType,
        item.location,
        item.supplier
      ]);
  
      // Add the table
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 30,
        margin: { top: 20 },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'middle'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 20 },
          8: { cellWidth: 30 }
        }
      });
  
      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
  
      // Save the PDF
      doc.save('inventory_report.pdf');
      showNotification('PDF exported successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification('Failed to export PDF', 'error');
    }
  };

  const isLowStock = (stock, threshold) => stock <= threshold;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (editingProduct) {
        setEditingProduct({...editingProduct, image: event.target.result});
      } else {
        setNewProduct({...newProduct, image: event.target.result});
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    if (editingProduct) {
      setEditingProduct({...editingProduct, image: null});
    } else {
      setNewProduct({...newProduct, image: null});
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleAdvancedFilter = () => {
    setIsAdvancedFilterOpen(!isAdvancedFilterOpen);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setShowLowStock(false);
    setSelectedLocation('all');
    setSelectedSupplier('all');
    setStockRange([0, 200]);
    setPriceRange([0, 5000]);
    setIsAdvancedFilterOpen(false);
    showNotification('Filters reset', 'info');
  };

  const kanbanGroups = {
    'low': inventory.filter(item => item.stock <= item.threshold),
    'medium': inventory.filter(item => item.stock > item.threshold && item.stock <= item.threshold * 2),
    'high': inventory.filter(item => item.stock > item.threshold * 2)
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const averagePrice = inventory.reduce((sum, item) => sum + item.price, 0) / inventory.length;
  const totalSales = inventory.reduce((sum, item) => sum + item.sales, 0);
  const lowStockCount = inventory.filter(item => item.stock <= item.threshold).length;
  const categoryDistribution = {};
  inventory.forEach(item => {
    categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1;
  });

  const renderProductCard = (item) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md relative">
      {batchActionMode && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleItemSelection(item.id)}
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
      )}
      
      <div className="h-40 bg-gray-100 relative">
        {item.image ? (
          <img className="h-full w-full object-cover" src={item.image} alt={item.name} />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <PhotoIcon className="h-16 w-16 text-gray-300" />
          </div>
        )}
        
        {isLowStock(item.stock, item.threshold) && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-md font-medium text-gray-900 truncate">{item.name}</h3>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold text-indigo-600">Rs. {item.price.toFixed(2)}</div>
          <div className="text-sm text-gray-500">Stock: {item.stock} {item.quantityType}</div>
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <span className="capitalize">{item.category}</span>
            <span className="mx-1">•</span>
            <span>{item.location}</span>
          </div>
          <div className="truncate">{item.supplier}</div>
        </div>
        
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <button 
            onClick={() => openEditModal(item)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderKanbanItem = (item) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-3 mb-2">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="font-semibold">Rs. {item.price.toFixed(2)}</div>
        <div className="bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs rounded-full">
          {item.stock} {item.quantityType}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{item.location}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <ArrowPathIcon className="h-6 w-6 text-indigo-600 animate-spin mr-3" />
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}
      
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg max-w-md flex items-center ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
          notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
          'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
        }`}>
          {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
          {notification.type === 'error' && <ExclamationCircleIcon className="h-5 w-5 mr-2" />}
          {notification.type === 'info' && <ClockIcon className="h-5 w-5 mr-2" />}
          <p>{notification.message}</p>
        </div>
      )}

      {confirmModal.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {confirmModal.type.includes('delete') ? 'Confirm Deletion' : 'Confirm Action'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {confirmModal.type === 'delete' 
                          ? 'Are you sure you want to delete this product? This action cannot be undone.'
                          : confirmModal.type === 'batchDelete'
                            ? `Are you sure you want to delete ${selectedItems.length} selected products? This action cannot be undone.`
                            : 'Are you sure you want to proceed with this action?'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    if (confirmModal.type === 'delete') {
                      confirmDelete(confirmModal.id);
                    } else if (confirmModal.type === 'batchDelete') {
                      confirmBatchDelete();
                    }
                  }}
                >
                  {confirmModal.type.includes('delete') ? 'Delete' : 'Confirm'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmModal({ show: false, type: null, id: null })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your products and stock levels</p>
          </div>
          <div className="flex items-center space-x-2">
            {batchActionMode ? (
              <>
                <span className="text-sm text-gray-500 mr-2">{selectedItems.length} selected</span>
                <button 
                  onClick={() => handleBatchAction('delete')}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  disabled={selectedItems.length === 0}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
                <button 
                  onClick={() => handleBatchAction('export')}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={selectedItems.length === 0}
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                  Export
                </button>
                <button 
                  onClick={() => setBatchActionMode(false)}
                  className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
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
                  Export CSV
                </button>
                <button 
                  onClick={exportToPDF}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                  Export PDF
                </button>
                <button 
                  onClick={openAnalyticsModal}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Analytics
                </button>
                <button 
                  onClick={() => setBatchActionMode(true)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Select
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or supplier..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded-md text-sm ${
                  viewMode === 'table' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 rounded-md text-sm ${
                  viewMode === 'kanban' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Kanban View
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <label htmlFor="category-filter" className="mr-2 text-sm text-gray-600">Category:</label>
              <select
                id="category-filter"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="location-filter" className="mr-2 text-sm text-gray-600">Location:</label>
              <select
                id="location-filter"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="supplier-filter" className="mr-2 text-sm text-gray-600">Supplier:</label>
              <select
                id="supplier-filter"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="all">All Suppliers</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="low-stock"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
              />
              <label htmlFor="low-stock" className="ml-2 text-sm text-gray-600">Low Stock Only</label>
            </div>

            <button
              onClick={toggleAdvancedFilter}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1" />
              {isAdvancedFilterOpen ? 'Hide Advanced' : 'Advanced Filters'}
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Reset Filters
            </button>
          </div>

          {isAdvancedFilterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={stockRange[0]}
                      onChange={(e) => setStockRange([parseInt(e.target.value), stockRange[1]])}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600">{stockRange[0]} - {stockRange[1]}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (Rs)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600">Rs. {priceRange[0]} - Rs. {priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {viewMode === 'table' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {batchActionMode && (
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      )}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center">
                        Name
                        {sortConfig.key === 'name' && (
                          <ArrowsUpDownIcon className={`ml-1 h-3 w-3 ${sortConfig.direction === 'ascending' ? 'text-gray-400' : 'text-gray-400 transform rotate-180'}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('category')}>
                      <div className="flex items-center">
                        Category
                        {sortConfig.key === 'category' && (
                          <ArrowsUpDownIcon className={`ml-1 h-3 w-3 ${sortConfig.direction === 'ascending' ? 'text-gray-400' : 'text-gray-400 transform rotate-180'}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                      <div className="flex items-center">
                        Price
                        {sortConfig.key === 'price' && (
                          <ArrowsUpDownIcon className={`ml-1 h-3 w-3 ${sortConfig.direction === 'ascending' ? 'text-gray-400' : 'text-gray-400 transform rotate-180'}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('stock')}>
                      <div className="flex items-center">
                        Stock
                        {sortConfig.key === 'stock' && (
                          <ArrowsUpDownIcon className={`ml-1 h-3 w-3 ${sortConfig.direction === 'ascending' ? 'text-gray-400' : 'text-gray-400 transform rotate-180'}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('supplier')}>
                      <div className="flex items-center">
                        Supplier
                        {sortConfig.key === 'supplier' && (
                          <ArrowsUpDownIcon className={`ml-1 h-3 w-3 ${sortConfig.direction === 'ascending' ? 'text-gray-400' : 'text-gray-400 transform rotate-180'}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('location')}>
                      <div className="flex items-center">
                        Location
                        {sortConfig.key === 'location' && (
                          <ArrowsUpDownIcon className={`ml-1 h-3 w-3 ${sortConfig.direction === 'ascending' ? 'text-gray-400' : 'text-gray-400 transform rotate-180'}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                      <tr key={item.id} className={isLowStock(item.stock, item.threshold) ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {batchActionMode && (
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleItemSelection(item.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.image ? (
                              <img className="h-10 w-10 rounded-full object-cover mr-3" src={item.image} alt={item.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                <PhotoIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">#{item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rs. {item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.stock} / {item.threshold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantityType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isLowStock(item.stock, item.threshold) 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isLowStock(item.stock, item.threshold) ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.supplier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-indigo-600 hover:text-indigo-900"
                              disabled={batchActionMode}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={batchActionMode}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                        No products found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInventory.length > 0 ? (
              filteredInventory.map(item => renderProductCard(item))
            ) : (
              <div className="col-span-full text-center py-10">
                <div className="text-gray-400 mb-2">
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(kanbanGroups).map(([status, items]) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-medium text-gray-700 capitalize">
                    {status === 'low' ? 'Low Stock' : status === 'medium' ? 'Medium Stock' : 'High Stock'}
                  </h2>
                  <span className="bg-white px-2 py-1 text-xs rounded-full font-medium">
                    {items.length} items
                  </span>
                </div>
                <div className="space-y-3">
                  {items.length > 0 ? (
                    items.map(item => renderKanbanItem(item))
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No items in this category
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                              type="text"
                              id="name"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.name : newProduct.name}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, name: e.target.value})
                                  : setNewProduct({...newProduct, name: e.target.value})
                              }
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                              id="category"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.category : newProduct.category}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, category: e.target.value})
                                  : setNewProduct({...newProduct, category: e.target.value})
                              }
                              required
                            >
                              {categories.map(category => (
                                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                            <input
                              type="number"
                              id="price"
                              min="0"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.price : newProduct.price}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, price: e.target.value})
                                  : setNewProduct({...newProduct, price: e.target.value})
                              }
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                            <input
                              type="number"
                              id="stock"
                              min="0"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.stock : newProduct.stock}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, stock: e.target.value})
                                  : setNewProduct({...newProduct, stock: e.target.value})
                              }
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                            <input
                              type="number"
                              id="threshold"
                              min="0"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.threshold : newProduct.threshold}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, threshold: e.target.value})
                                  : setNewProduct({...newProduct, threshold: e.target.value})
                              }
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="quantityType" className="block text-sm font-medium text-gray-700 mb-1">Quantity Type</label>
                            <select
                              id="quantityType"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.quantityType : newProduct.quantityType}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, quantityType: e.target.value})
                                  : setNewProduct({...newProduct, quantityType: e.target.value})
                              }
                              required
                            >
                              {quantityTypes.map(type => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                            <select
                              id="supplier"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.supplier : newProduct.supplier}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, supplier: e.target.value})
                                  : setNewProduct({...newProduct, supplier: e.target.value})
                              }
                              required
                            >
                              <option value="">Select Supplier</option>
                              {suppliers.map(supplier => (
                                <option key={supplier} value={supplier}>{supplier}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                              id="location"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={editingProduct ? editingProduct.location : newProduct.location}
                              onChange={(e) => 
                                editingProduct 
                                  ? setEditingProduct({...editingProduct, location: e.target.value})
                                  : setNewProduct({...newProduct, location: e.target.value})
                              }
                              required
                            >
                              <option value="">Select Location</option>
                              {locations.map(location => (
                                <option key={location} value={location}>{location}</option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="flex items-center">
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={triggerFileInput}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                              >
                                Choose Image
                              </button>
                              {(editingProduct?.image || newProduct.image) && (
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="ml-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            {(editingProduct?.image || newProduct.image) && (
                              <div className="mt-2">
                                <img 
                                  src={editingProduct ? editingProduct.image : newProduct.image} 
                                  alt="Preview" 
                                  className="h-20 w-20 object-cover rounded-md"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                          >
                            {editingProduct ? 'Update Product' : 'Add Product'}
                          </button>
                          <button
                            type="button"
                            onClick={closeModal}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAnalyticsModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Inventory Analytics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 mb-3">Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Products</span>
                              <span className="font-medium">{inventory.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Inventory Value</span>
                              <span className="font-medium">Rs. {totalValue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Average Price</span>
                              <span className="font-medium">Rs. {averagePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Sales</span>
                              <span className="font-medium">{totalSales}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Low Stock Items</span>
                              <span className="font-medium text-red-600">{lowStockCount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 mb-3">Category Distribution</h4>
                          <div className="space-y-2">
                            {Object.entries(categoryDistribution).map(([category, count]) => (
                              <div key={category} className="flex items-center">
                                <div className="w-24">
                                  <span className="text-gray-600 capitalize">{category}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-indigo-500" 
                                      style={{ width: `${(count / inventory.length) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="w-8 text-right text-sm font-medium">
                                  {count}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 mb-3">Stock Status</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {inventory.filter(item => item.stock > item.threshold * 2).length}
                              </div>
                              <div className="text-sm text-gray-600">High Stock</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                              <div className="text-2xl font-bold text-yellow-600 mb-1">
                                {inventory.filter(item => item.stock > item.threshold && item.stock <= item.threshold * 2).length}
                              </div>
                              <div className="text-sm text-gray-600">Medium Stock</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                              <div className="text-2xl font-bold text-red-600 mb-1">
                                {lowStockCount}
                              </div>
                              <div className="text-sm text-gray-600">Low Stock</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={closeAnalyticsModal}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;