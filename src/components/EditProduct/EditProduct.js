import React, { useEffect, useState } from "react";

export default function ProductDashboard() {
  const [allProducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [isLive, setIsLive] = useState(""); // State for live status
  const [categories, setCategories] = useState([]); // State for categories

  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://backend.aihomesd.com/getAllCategoryWithProducts"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const products = data.data.flatMap((p) => p.products);

        if (data.success) {
          setAllProducts(products);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backend.aihomesd.com/getAllCategory"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleSaveProduct = async () => {
    try {
      const response = await fetch(
        `https://backend.aihomesd.com/editProduct/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const updatedProduct = await response.json();
      setMessage("Product saved successfully");
      setEditingProduct(null);

      // Update products state to reflect the saved changes
      setAllProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage("Error saving product");
    }
  };

  // Function to truncate a string and return JSX
  const TruncatedText = ({ text, limit }) => {
    const truncateString = (str, num) => {
      if (str.length > num) {
        return str.slice(0, num) + "...";
      } else {
        return str;
      }
    };

    return <p>{truncateString(text, limit)}</p>;
  };

  // Filtered products based on search query, category, and live status
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category.category === selectedCategory
      : true;
    const matchesLive =
      isLive !== "" ? product.productLive === (isLive === "On") : true;

    return matchesSearch && matchesCategory && matchesLive;
  });

  const handleDelete = async (product) => {
    // Show product details in the confirmation dialog
    const confirmationMessage = `
    Product Name: ${product.productName}
    Category: ${product.category.category}
    Price: ${product.productRegularPrice}
    
    Type 'DELETE' to confirm
  `;

    const userConfirmation = prompt(confirmationMessage);

    if (userConfirmation && userConfirmation.toUpperCase() === "DELETE") {
      try {
        const response = await fetch(
          `https://backend.aihomesd.com/deleteProduct/${product._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        const result = await response.json();

        if (result.success) {
          alert("Product deleted successfully");
          // Remove the deleted product from the state
          setAllProducts((prevProducts) =>
            prevProducts.filter((p) => p._id !== product._id)
          );
        } else {
          alert(result.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    } else {
      alert("Delete action was cancelled");
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
            width: "1000px",
          }}
        >
          <table
            id="example"
            className="table table-striped table-bordered"
            style={{ width: "100%" }}
          >
            <thead className="table-primary ">
              <tr className="text-center">
                <th>Category</th>
                <th>Name</th>
                <th>Image</th>
                <th>Code</th>
                <th>Price</th>
                <th>Offer</th>
                <th>Live</th>
                <th>Action</th>
              </tr>
            </thead>
            <thead className="table-light ">
              <tr>
                <th>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={selectedCategory} // Bind select value to selectedCategory state
                    onChange={(e) => setSelectedCategory(e.target.value)} // Update selectedCategory state on change
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.category}>
                        {category.category}
                      </option>
                    ))}
                  </select>
                </th>
                <th colSpan="5">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Search by Name..."
                    value={searchQuery} // Bind input value to searchQuery state
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
                  />
                </th>
                <th>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={isLive} // Bind select value to isLive state
                    onChange={(e) => setIsLive(e.target.value)} // Update isLive state on change
                  >
                    <option value="">All</option>
                    <option value="On">On</option>
                    <option value="Off">Off</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.category.category}</td>
                  <td>
                    <TruncatedText text={p.productName} limit={11} />{" "}
                  </td>
                  <td>
                    <div className="row">
                      {p.images.map((p_img, index) => (
                        <div className="col-4 p-0" key={index}>
                          <img
                            className="p-2"
                            style={{ width: "100%", borderRadius: 10 }}
                            src={p_img}
                            alt={p.productName}
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{p.productCode}</td>
                  <td>
                    {(p.productOffer
                      ? p.productRegularPrice -
                        (p.productRegularPrice * p.productOffer) / 100
                      : p.productRegularPrice
                    ).toFixed(2)}
                  </td>
                  <td>{p.productOffer}%</td>

                  <td>
                    {p.productLive ? (
                      <div className="alert alert-success" role="alert">
                        On
                      </div>
                    ) : (
                      <div className="alert alert-danger" role="alert">
                        Off
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() =>
                        window.open(
                          `${window.location.origin}/dashboard/product/product-edit/productId=${p._id}`,
                          "_blank"
                        )
                      }
                      type="button"
                      className="btn btn-warning btn-sm"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)} // Pass the product to the delete handler
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-primary ">
              <tr className="text-center">
                <th>Category</th>
                <th>Name</th>
                <th>Image</th>
                <th>Code</th>
                <th>Price</th>
                <th>Offer</th>
                <th>Live</th>
                <th>Action</th>
              </tr>
            </tfoot>
          </table>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
