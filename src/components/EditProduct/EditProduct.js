import React, { useEffect, useState } from "react";

export default function ProductDashboard() {
  const [allProducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://elec-ecommerce-back.vercel.app/getAllCategoryWithProducts"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log("Fetched data:", data.data);

        const products = data.data.flatMap((p) => p.products);

        if (data.success) {
          setAllProducts(products);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
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
        `http://localhost:8000/editProduct/${editingProduct._id}`,
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

      // Update categoriesWithProducts state to reflect the saved changes
      setAllProducts((prevCategories) =>
        prevCategories.map((category) =>
          category.category._id === updatedProduct.category._id
            ? {
                ...category,
                products: category.products.map((product) =>
                  product._id === updatedProduct._id ? updatedProduct : product
                ),
              }
            : category
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
                <th>Stock</th>
                <th>TP</th>
                <th>MRP</th>
                <th>Action</th>
              </tr>
            </thead>
            <thead className="table-light ">
              <tr>
                <th>
                  <select
                    className="form-select  "
                    aria-label="Default select example"
                  >
                    <option selected>Filter</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </th>
                <th colSpan="5">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Search by Name..."
                  ></input>
                </th>

                <th>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>Filter</option>
                    <option value="1">On</option>
                    <option value="2">Off</option>
                  </select>
                </th>
                <th>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>Filter</option>
                    <option value="1">On</option>
                    <option value="2">Off</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {allProducts &&
                allProducts.map((p) => (
                  <tr>
                    <td>{p.category.category}</td>
                    <td>
                      <TruncatedText text={p.productName} limit={11} />{" "}
                    </td>
                    <td>
                      <div className="row">
                        {p.images.map((p_img) => (
                          <div className="col-4 p-0">
                            <img
                              style={{ width: "100%" }}
                              src={p_img}
                              alt={p.productName}
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{p?.productCode}</td>
                    <td>
                      {p?.productOffer
                        ? p?.productRegularPrice -
                          (p?.productRegularPrice * p?.productOffer) / 100
                        : p?.productRegularPrice}
                    </td>
                    <td>{p?.productOffer}%</td>
                    <td>
                      {p?.productLive ? (
                        <div className="alert alert-success" role="alert">
                          On
                        </div>
                      ) : (
                        <div className="alert alert-danger" role="alert">
                          Off
                        </div>
                      )}
                    </td>
                    <td>
                      {p?.productLive ? (
                        <div className="alert alert-success  " role="alert">
                          On
                        </div>
                      ) : (
                        <div className="alert alert-danger" role="alert">
                          Off
                        </div>
                      )}
                    </td>
                    <td>{p.productTP}</td>
                    <td>{p.productMRP}</td>
                    <td>
                      <button
                        onClick={() =>
                          window.open(
                            `${window.location.origin}/product/product-edit/productId=${p._id}`,
                            "_blank"
                          )
                        }
                        type="button"
                        className="btn btn-warning btn-sm"
                      >
                        Edit
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
                <th>Stock</th>
                <th>TP</th>
                <th>MRP</th>
                <th>Action</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
