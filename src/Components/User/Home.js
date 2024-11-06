import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../../Redux/actions/cartActions";

const Home = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [showVariations, setShowVariations] = useState({});

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

  const dispatch = useDispatch();
  const handleAddToCart = (product) => {
    console.log("Product:", product); // Log the product to check its structure
    const selectedVariation =
      product.variations && product.variations.length > 0
        ? selectedVariations[product._id] || product.variations[0]
        : null;

    console.log("Selected Variation:", selectedVariation);

    dispatch(
      addToCart(
        product,
        selectedVariation ? selectedVariation._id : null,
        selectedVariation
      )
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto container mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ">
        {products && products.length > 0 ? (
          products.map((product) => {
            const hasVariations =
              product.variations && product.variations.length > 0;
            const selectedVariation = hasVariations
              ? selectedVariations[product._id] || product.variations[0]
              : null;

            return (
              <div key={product._id} className="p-4 border">
                {hasVariations && selectedVariation?.image ? (
                  <img
                    src={selectedVariation.image}
                    alt={product.name}
                    style={{ width: "100px", height: "auto" }}
                  />
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

                <p className="font-bold text-lg">{product.name}</p>

                <p>
                  Price: Ksh
                  {hasVariations && selectedVariation
                    ? selectedVariation.price
                    : product.generalPrice}
                </p>
                <p className="font-semibold">
                  {hasVariations && selectedVariation
                    ? selectedVariation.stock > 0
                      ? "In stock"
                      : "Out of stock"
                    : product.stock > 0
                    ? "In stock"
                    : "Out of stock"}
                </p>

                <p>{product.description}</p>

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
                    {(product.variations || []).map((variation) => (
                      <button
                        key={variation._id}
                        className={`border px-2 py-1 m-1 ${
                          selectedVariation?._id === variation._id
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() =>
                          handleSelectVariation(product._id, variation)
                        }
                      >
                        {variation.size}, {variation.color}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-teal-700 text-white p-2 rounded-md mt-2"
                >
                  Add to cart
                </button>
              </div>
            );
          })
        ) : (
          <p>No products available</p>
        )}
      </div>

      <Link to={"/cart"}>View cart</Link>
      <ToastContainer />
    </div>
  );
};

export default Home;
