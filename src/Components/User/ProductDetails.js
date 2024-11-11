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
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto container mt-6">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/2 border border-solid border-gray-100">
          {selectedVariation && selectedVariation.image ? (
            <img
              src={selectedVariation.image}
              alt={product.name}
              style={{ width: "300px", height: "auto" }}
            />
          ) : (
            product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "300px", height: "auto" }}
              />
            )
          )}
        </div>

        <div className="sm:w-1/2 p-4">
        <p className="font-bold text-xl">{product.name}</p>
          <p className="text-lg">
            Price: Ksh{" "}
            {selectedVariation ? selectedVariation.price : product.generalPrice}
          </p>

          <p className="font-semibold">
            {selectedVariation
              ? selectedVariation.stock > 0
                ? "In stock"
                : "Out of stock"
              : product.stock > 0
              ? "In stock"
              : "Out of stock"}
          </p>

          <p>{product.description}</p>

          {product.variations && product.variations.length > 0 && (
            <button
              className="bg-blue-500 text-white px-2 py-1 mt-2 flex items-center"
              onClick={handleToggleVariations}
            >
              Available variations
              {showVariations ? (
                <FaCaretUp className="ml-2" />
              ) : (
                <FaCaretDown className="ml-2" />
              )}
            </button>
          )}

          {showVariations && (
            <div className="mt-2">
              {product.variations.map((variation) => (
                <button
                  key={variation._id}
                  className={`border px-2 py-1 m-1 ${
                    selectedVariation?._id === variation._id
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200"
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
            className="bg-teal-700 text-white p-2 rounded-md mt-4"
          >
            Add to cart
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
