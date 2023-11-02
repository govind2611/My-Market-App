import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css"

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState({
    name: "",
    category: "",
    maxPrice: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/products`)
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setError("An error occurred while fetching product data.");
      });
  }, []);

  const userRole = localStorage.getItem("userRole");

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product._id === productId);
    setEditProduct(productToEdit);
  };

  const handleSubmitEditedProduct = () => {
    if (editProduct) {
      const token = localStorage.getItem("token");
  
      const updatedProduct = {
        _id: editProduct._id,
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        category: editProduct.category,
        image: editProduct.image,
      };
  
      axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/products/${editProduct._id}`, updatedProduct, {
          headers: {
            govind: token,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product._id === editProduct._id ? updatedProduct : product
              )
            );
            setEditProduct(null); 
          } else {
            setError(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error while editing product:", error);
          setError("An error occurred while editing the product.");
        });
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/products/${productId}`,
        {
          headers: {
            govind: token,
          },
        }
      );

      if (response.data.success) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error while deleting product:", error);
      setError("An error occurred while deleting the product.");
    }
  };

  const handleAddProduct = () => {
    setShowAddProductForm(true);
  };

  const handleSubmitNewProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/products`, newProduct, {
        headers: {
          govind: token,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setProducts([...products, response.data.data]);
          setShowAddProductForm(false);
          setNewProduct({
            name: "",
            description: "",
            price: 0,
            category: "",
            image: "",
          });
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error while adding product:", error);
        setError("An error occurred while adding the product.");
      });
  };

  const renderVendorActions = (productId) => {
    if (userRole === "vendor") {
      return (
        <div>
          <button className="vendor-btn" onClick={() => handleEditProduct(productId)}>
            Edit Product
          </button>
          <button className="vendor-btn" onClick={() => handleDeleteProduct(productId)}>
            Delete Product
          </button>
        </div>
      );
    }
    return null;
  };
  const handleLogout = () => {
     localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/login"; 
  };

  const handleSearch = () => {
    let filteredProducts = [...products];

    if (search.name) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(search.name.toLowerCase())
      );
    }

    if (search.category) {
      filteredProducts = filteredProducts.filter((product) =>
        product.category.toLowerCase().includes(search.category.toLowerCase())
      );
    }

    if (search.maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(search.maxPrice)
      );
    }

    setProducts(filteredProducts);
  };

  const handleClearSearch = () => {
    setSearch({
      name: "",
      category: "",
      maxPrice: "",
    });
    window.location.reload();
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {userRole === 'vendor' && (
        <button className="add-product-button" onClick={handleAddProduct}>
          Add New Product
        </button>
      )}
      <div className="search-container">
        <h3>Search Products</h3>
        <input
          type="text"
          className="search-input"
          placeholder="Search by Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Search by Category"
          value={search.category}
          onChange={(e) => setSearch({ ...search, category: e.target.value })}
        />
        <input
          type="number"
          className="search-input"
          placeholder="Maximum Price"
          value={search.maxPrice}
          onChange={(e) => setSearch({ ...search, maxPrice: e.target.value })}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button className="clear-search-button" onClick={handleClearSearch}>
          Clear Search
        </button>
      </div>
      {showAddProductForm ? (
        <div className="add-product-form">
          <h3>Add New Product</h3>
          <form onSubmit={handleSubmitNewProduct}>
            <label>
              Name:
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Description:
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Image URL:
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <button type="submit" className="submit-button">
              Add Product
            </button>
            <button
              onClick={() => setShowAddProductForm(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
      {error && <p className="error-message">{error}</p>}
      {editProduct && (
        <div className="edit-product-form">
          <h3>Edit Product</h3>
          <form onSubmit={handleSubmitEditedProduct}>
            <label>
              Name:
              <input
                type="text"
                value={editProduct.name || ''}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Description:
              <textarea
                value={editProduct.description || ''}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                value={editProduct.price || 0}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                value={editProduct.category || ''}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <label>
              Image URL:
              <input
                type="text"
                value={editProduct.image || ''}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, image: e.target.value })
                }
                required
                className="input-field"
              />
            </label>
            <button type="submit" className="submit-button">
              Save Changes
            </button>
            <button
              onClick={() => setEditProduct(null)}
              className="cancel-button"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <h3 className="product-list-title">Product List</h3>
      <div className="product-cards">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <strong className="product-name">{product.name}</strong>
            <p className="product-description">Description: {product.description}</p>
            <p className="product-price">Price: ${product.price}</p>
            <p className="product-category">Category: {product.category}</p>
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            {renderVendorActions(product._id)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;


