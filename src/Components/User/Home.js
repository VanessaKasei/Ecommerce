import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa"; // Import caret icons

const Home = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({}); // Store selected variation per product
  const [showVariations, setShowVariations] = useState({}); // Track if variations are shown for each product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product");
        const result = await response.json();
        setProducts(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Toggle showing variations for a specific product
  const handleToggleVariations = (productId) => {
    setShowVariations((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleSelectVariation = (productId, variation) => {
    setSelectedVariations((prevState) => ({
      ...prevState,
      [productId]: variation,
    }));
  };

  return (
    <div className="mx-auto container">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ">
        {products && products.length > 0 ? (
          products.map((product) => {
            const hasVariations = product.variations && product.variations.length > 0;
            const selectedVariation = selectedVariations[product._id] || product.variations?.[0];

            return (
              <div key={product._id} className="p-4 border">
                {/* Display product or selected variation image */}
                {hasVariations ? (
                  selectedVariation.image && (
                    <img
                      src={selectedVariation.image}
                      alt={product.name}
                      style={{ width: "200px", height: "auto" }}
                    />
                  )
                ) : (
                  product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )
                )}

                <p>{product.name}</p>

                {/* Display price and stock based on variation or product */}
                <p>Price: ksh{hasVariations ? selectedVariation.price : product.generalPrice}</p>
                <p>Stock: {hasVariations ? selectedVariation.stock : product.stock}</p>

                {/* Product description */}
                <p>{product.description}</p>

                {/* Toggle variations button if the product has variations */}
                {hasVariations && (
                 <button
                 className="bg-blue-500 text-white px-2 py-1 mt-2 flex items-center"
                 onClick={() => handleToggleVariations(product._id)}
               >
                 Available variations
                 {showVariations[product._id] ? (
                   <FaCaretUp className="ml-2" />
                 ) : (
                   <FaCaretDown className="ml-2" />
                 )}
               </button>
                )}

                {hasVariations && showVariations[product._id] && (
                  <div className="mt-2">
                    {product.variations.map((variation) => (
                      <button
                        key={variation._id}
                        className={`border px-2 py-1 m-1 ${
                          selectedVariation._id === variation._id
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handleSelectVariation(product._id, variation)}
                      >
                        {variation.size}, {variation.color}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Home;
