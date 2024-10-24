import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    generalPrice: "",
    description: "",
    image: "",
    stock: "",
    categories: [],
    variations: [{ size: "", color: "", material: "", price: "", image: "", stock: "" }],
  });

  // Fetch all products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle variation input changes
  const handleVariationChange = (index, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[index][field] = value;
    setFormData({ ...formData, variations: newVariations });
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setProducts([...products, data]); // Add the new product to the list
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Edit a product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/product/${currentProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setProducts(
        products.map((product) =>
          product._id === currentProduct._id ? { ...product, ...formData } : product
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/product/${id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((product) => product._id !== id)); // Remove the deleted product from the list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Set product data for editing
  const startEditing = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      generalPrice: product.generalPrice,
      description: product.description,
      image: product.image,
      stock: product.stock,
      categories: product.categories,
      variations: product.variations || [{ size: "", color: "", material: "", price: "", image: "", stock: "" }]
    });
  };

  // Reset form data
  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({
      name: "",
      generalPrice: "",
      description: "",
      image: "",
      stock: "",
      categories: [],
      variations: [{ size: "", color: "", material: "", price: "", image: "", stock: "" }],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Product Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Stock</th>
              <th className="border px-4 py-2">Variations</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">${product.generalPrice}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">
                  {product.variations && product.variations.length > 0 ? (
                    <ul>
                      {product.variations.map((variation, index) => (
                        <li key={index}>
                          {variation.size} / {variation.color} / Stock: {variation.stock}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No Variations</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => startEditing(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Add / Edit Product Form */}
      <form
        onSubmit={isEditing ? handleEditProduct : handleAddProduct}
        className="bg-white p-4 border border-gray-300 rounded"
      >
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Product" : "Add Product"}
        </h2>
        <div className="mb-4">
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="generalPrice"
            value={formData.generalPrice}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            
          />
        </div>

        {/* Variations */}
        <h3 className="text-lg font-bold mb-4">Variations(optional)</h3>
        {formData.variations.map((variation, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <label className="block mb-2">Size</label>
            <input
              type="text"
              value={variation.size}
              onChange={(e) => handleVariationChange(index, "size", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <label className="block mt-2">Color</label>
            <input
              type="text"
              value={variation.color}
              onChange={(e) => handleVariationChange(index, "color", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <label className="block mt-2">Material</label>
            <input
              type="text"
              value={variation.material}
              onChange={(e) => handleVariationChange(index, "material", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <label className="block mt-2">Price</label>
            <input
              type="number"
              value={variation.price}
              onChange={(e) => handleVariationChange(index, "price", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <label className="block mt-2">Image URL</label>
            <input
              type="text"
              value={variation.image}
              onChange={(e) => handleVariationChange(index, "image", e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <label className="block mt-2">Stock</label>
            <input
              type="number"
              value={variation.stock}
              onChange={(e) => handleVariationChange(index, "stock", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, variations: [...formData.variations, { size: "", color: "", material: "", price: "", image: "", stock: "" }] })}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Variation
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
