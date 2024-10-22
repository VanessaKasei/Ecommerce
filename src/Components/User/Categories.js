import React, { useEffect, useState } from "react";

const Categories = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/category");
          const result = await response.json();
          console.log("Fetched categories:", result);
          setCategories(result);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      
    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id}>
              <p>{category.name}</p>
              <p>{category.description}</p>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
