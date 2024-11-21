import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../../Redux/actions/cartActions";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [showVariations, setShowVariations] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/product/${id}`);
        const result = await response.json();
        setProduct(result);
        if (result.variations && result.variations.length > 0) {
          setSelectedVariation(result.variations[0]);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleToggleVariations = () => {
    setShowVariations((prev) => !prev);
  };

  const handleSelectVariation = (variation) => {
    setSelectedVariation(variation);
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart(
        product,
        selectedVariation ? selectedVariation._id : null,
        selectedVariation
      )
    );
    toast.success(`${product.name} added to cart`);
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
  }

  if (!product) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="mx-auto container mt-10 px-4 max-w-3xl">
      <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="sm:w-1/2 p-4 flex items-center justify-center bg-gray-100">
          <img
            src={selectedVariation?.image || product.image}
            alt={product.name}
            style={{ width: "200px", height: "auto" }}
          />
        </div>

        <div className="sm:w-1/2 p-6 space-y-4">
          <h2 className="font-bold text-2xl text-gray-800">{product.name}</h2>
          <p className="text-xl text-teal-700 font-semibold">
            Price: Ksh {selectedVariation ? selectedVariation.price : product.generalPrice}
          </p>

          <p className="font-semibold text-sm text-green-600">
            {selectedVariation
              ? selectedVariation.stock > 0
                ? "In stock"
                : "Out of stock"
              : product.stock > 0
              ? "In stock"
              : "Out of stock"}
          </p>

          <p className="text-gray-700">{product.description}</p>

          {product.variations && product.variations.length > 0 && (
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-4 flex items-center justify-center rounded-md shadow-md hover:bg-blue-600 transition"
              onClick={handleToggleVariations}
            >
              Available Variations
              {showVariations ? (
                <FaCaretUp className="ml-2" />
              ) : (
                <FaCaretDown className="ml-2" />
              )}
            </button>
          )}

          {showVariations && (
            <div className="mt-4 flex flex-wrap">
              {product.variations.map((variation) => (
                <button
                  key={variation._id}
                  className={`border px-3 py-1 rounded-md m-1 transition ${
                    selectedVariation?._id === variation._id
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => handleSelectVariation(variation)}
                >
                  {variation.size}, {variation.color}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="bg-teal-700 text-white px-6 py-2 rounded-md mt-4 shadow-md hover:bg-teal-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
