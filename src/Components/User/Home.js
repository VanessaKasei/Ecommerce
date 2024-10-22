import React, { useEffect, useState } from "react";

const Home = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product");
        const result = await response.json();
        setProducts(result);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4s">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id}>
              <div className="">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "200px", height: "auto" }}
                  />
                )}
                <p>{product.name}</p>
                <p>{product.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Home;
