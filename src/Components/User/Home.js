import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../../Redux/actions/cartActions";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

const Home = () => {
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product`);
        const result = await response.json();
        setProducts(result);
      } catch (error) {
        setError(error);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectVariation = (productId, variation) => {
    setSelectedVariations((prevState) => ({
      ...prevState,
      [productId]: variation,
    }));
  };

  const handleAddToCart = (product) => {
    const selectedVariation =
      product.variations && product.variations.length > 0
        ? selectedVariations[product._id] || product.variations[0]
        : null;

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
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="mx-auto container mt-6">
      <h2 className="flex justify-center font-bold text-2xl mb-6">Products</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products && products.length > 0 ? (
          products.map((product) => {
            const hasVariations =
              product.variations && product.variations.length > 0;
            const selectedVariation = hasVariations
              ? selectedVariations[product._id] || product.variations[0]
              : null;

            return (
              <div
                key={product._id}
                className=" flex flex-col justify-between h-full p-4 border"
              >
                <Link to={`/product/${product._id}`}>
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
                </Link>

                <Link to={`/product/${product._id}`}>
                  <p className="font-bold text-lg">{product.name}</p>
                </Link>

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

                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-700 text-white p-2 rounded-md mt-2 self-end"
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
      <ToastContainer />
    </div>
  );
};

export default Home;
