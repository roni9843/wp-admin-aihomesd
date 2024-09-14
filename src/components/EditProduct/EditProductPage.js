import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productId, setProductId] = useState("");
  const [productData, setProductData] = useState({
    productName: "",
    productStock: 0,
    productRegularPrice: 0,
    productOffer: 0,
    productTag: [],
    productDescription: "",
    shortDescription: "",
    productYoutubeLink: "",
    additionalInfo: "",
    productTP: 0,
    productMRP: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("productId=")[1];
    setProductId(id);
  }, []);

  useEffect(() => {
    if (productId) {
      callProduct(productId);
    }
  }, [productId]);

  const callProduct = async (productId) => {
    const url = "https://backend.aihomesd.com/getProductById";
    const payload = { productId };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log("Product Data:", data); // Check the data here
      setProductData(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePrices() || !validateFields()) return;

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    try {
      const response = await fetch(
        `https://backend.aihomesd.com/updateProduct/${productId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Product updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    }
  };

  const validatePrices = () => {
    const { productRegularPrice, productOffer, productTP, productMRP } =
      productData;
    if (
      productRegularPrice < 0 ||
      productOffer < 0 ||
      productTP < 0 ||
      productMRP < 0
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Prices must be non-negative.",
      }));
      return false;
    }
    return true;
  };

  const validateFields = () => {
    const errors = {};
    if (!productData.productName.trim())
      errors.productName = "Product Name is required.";
    if (productData.productRegularPrice <= 0)
      errors.productRegularPrice =
        "Regular Price is required and must be positive.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div
      className="container mt-4"
      style={{
        maxWidth: "900px",

        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <form
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
          width: "1000px",
        }}
        onSubmit={handleSubmit}
      >
        <table className="table table-hover table-bordered    table-striped ">
          <thead className="table-primary ">
            <tr>
              <th
                style={{
                  //  backgroundColor: "#4caf50",
                  //  color: "#fff",
                  textAlign: "center",
                  padding: "10px",
                }}
                colSpan="2"
              >
                Update Product Information
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Row for Product Name */}
            <tr>
              <td style={{ width: "30%", fontWeight: "bold", padding: "15px" }}>
                Product Name
              </td>
              <td>
                <input
                  type="text"
                  className={`form-control ${
                    errors.productName ? "is-invalid" : ""
                  }`}
                  id="productName"
                  value={productData.productName}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productName: e.target.value,
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
                {errors.productName && (
                  <div className="invalid-feedback">{errors.productName}</div>
                )}
              </td>
            </tr>

            {/* Row for Product Stock */}
            <tr style={{ backgroundColor: "#e8f5e9" }}>
              <td style={{ width: "30%", fontWeight: "bold", padding: "15px" }}>
                Product Stock
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  id="productStock"
                  value={productData.productStock}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productStock: parseInt(e.target.value),
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
              </td>
            </tr>

            {/* Row for Regular Price */}
            <tr>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Regular Price
              </td>
              <td>
                <input
                  type="number"
                  className={`form-control ${
                    errors.productRegularPrice ? "is-invalid" : ""
                  }`}
                  id="productRegularPrice"
                  value={productData.productRegularPrice}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productRegularPrice: parseFloat(e.target.value),
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
                {errors.productRegularPrice && (
                  <div className="invalid-feedback">
                    {errors.productRegularPrice}
                  </div>
                )}
              </td>
            </tr>

            {/* Row for Offer Price */}
            <tr style={{ backgroundColor: "#e8f5e9" }}>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Offer Price
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  id="productOffer"
                  value={productData.productOffer}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productOffer: parseFloat(e.target.value),
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
                {productData?.productOffer
                  ? `${productData.productOffer}% off - 
                    ৳${(
                      productData.productRegularPrice -
                      (productData.productRegularPrice *
                        productData.productOffer) /
                        100
                    ).toFixed(2)}`
                  : `৳${productData?.productRegularPrice.toFixed(2)}`}
              </td>
            </tr>

            {/* Row for Product Tags */}
            <tr>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Product Tags
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  id="productTag"
                  value={productData.productTag.join(", ")}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productTag: e.target.value
                        .split(",")
                        .map((tag) => tag.trim()),
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
              </td>
            </tr>

            {/* Row for Product Description */}
            <tr style={{ backgroundColor: "#e8f5e9" }}>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Product Description
              </td>
              <td>
                <CKEditor
                  editor={ClassicEditor}
                  data={productData.productDescription}
                  onChange={(event, editor) =>
                    setProductData({
                      ...productData,
                      productDescription: editor.getData(),
                    })
                  }
                />
              </td>
            </tr>

            {/* Row for Short Description */}
            <tr>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Short Description
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  id="shortDescription"
                  value={productData.shortDescription}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      shortDescription: e.target.value,
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
              </td>
            </tr>

            {/* Row for YouTube Link */}
            <tr style={{ backgroundColor: "#e8f5e9" }}>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                YouTube Link
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  id="productYoutubeLink"
                  value={productData.productYoutubeLink}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productYoutubeLink: e.target.value,
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
              </td>
            </tr>

            {/* Row for Additional Information */}
            <tr>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Additional Information
              </td>
              <td>
                <CKEditor
                  editor={ClassicEditor}
                  data={productData.additionalInfo}
                  onChange={(event, editor) =>
                    setProductData({
                      ...productData,
                      additionalInfo: editor.getData(),
                    })
                  }
                />
              </td>
            </tr>

            {/* Row for Product TP */}
            <tr style={{ backgroundColor: "#e8f5e9" }}>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Product TP
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  id="productTP"
                  value={productData.productTP}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productTP: parseFloat(e.target.value),
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
              </td>
            </tr>

            {/* Row for Product MRP */}
            <tr>
              <td style={{ fontWeight: "bold", padding: "15px" }}>
                Product MRP
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  id="productMRP"
                  value={productData.productMRP}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productMRP: parseFloat(e.target.value),
                    })
                  }
                  style={{ border: "2px solid #4caf50" }}
                />
              </td>
            </tr>

            {/* Submit Button */}
            <tr>
              <td colSpan="2" className="text-center">
                <button
                  type="submit"
                  className="btn btn-success px-5 py-2 mt-4"
                  style={{
                    backgroundColor: "#4caf50",
                    border: "none",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "16px",
                    letterSpacing: "1px",
                  }}
                >
                  Update Product
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
