import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import EditProductPageImage from "./EditProductPageImage";

export default function EditProductPage() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [productRegularPrice, setProductRegularPrice] = useState(0);
  const [productOffer, setProductOffer] = useState(0);
  const [productTag, setProductTag] = useState([]);
  const [shortDescription, setShortDescription] = useState("");
  const [productYoutubeLink, setProductYoutubeLink] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [productTP, setProductTP] = useState(0);
  const [productMRP, setProductMRP] = useState(0);
  const [productDescriptionState, setProductDescriptionState] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [isProductLive, setIsProductLive] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("productId=")[1];
    setProductId(id);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(""); // Default selected ID

  // State to store categories
  const [categories, setCategories] = useState([]);
  // State to handle loading state
  const [loading, setLoading] = useState(true);
  // State to handle errors
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backend.aihomesd.com/getAllCategory"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

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
      setProductName(data.productName);
      setProductStock(data.productStock);
      setProductRegularPrice(data.productRegularPrice);
      setProductOffer(data.productOffer);
      setProductTag(data.productTag);
      setShortDescription(data.shortDescription);
      setProductYoutubeLink(data.productYoutubeLink);
      setAdditionalInfo(data.additionalInfo);
      setProductTP(data.productTP);
      setProductMRP(data.productMRP);
      setProductDescriptionState(data.productDescription);
      setProductCode(data.productCode);
      setSelectedCategory(data.category._id);
      setProductImage(data.images);
      setIsProductLive(data.productLive);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const [newProductImage, setNewProductImage] = useState([]);

  const deleteFetchImageFromArray = (props) => {
    console.log(props);

    setProductImage(productImage.filter((link) => link !== props));
  };

  const [uploadLoading, setUploadLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploadLoading(true);

    const uploadedImageUrls = [];

    for (let i = 0; i < newProductImage.length; i++) {
      const url = await handleImageUpload(newProductImage[i]);
      if (url) {
        uploadedImageUrls.push(url);
      }
    }

    setProductImage([...productImage, ...uploadedImageUrls]);
    setNewProductImage([]);

    let verifyImage = [...productImage, ...uploadedImageUrls];

    if (verifyImage === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Please upload an attested image",
      }));
      setUploadLoading(false);
      return;
    }

    //return;

    // uploadImage();

    if (!validatePrices() || !validateFields()) return;

    const formDataObject = {
      productName: productName,
      productStock: !productStock ? 0 : productStock,
      productRegularPrice: productRegularPrice,
      productOffer: !productOffer ? 0 : productOffer,
      productTag: productTag,
      shortDescription: shortDescription,
      productYoutubeLink: productYoutubeLink,
      additionalInfo: additionalInfo,
      productTP: !productTP ? 0 : productTP,
      productMRP: !productMRP ? 0 : productMRP,
      productDescription: productDescriptionState,
      category: selectedCategory,
      productLive: isProductLive,
      images: [...productImage, ...uploadedImageUrls],
    };

    console.log("", formDataObject);

    try {
      const response = await fetch(
        `https://backend.aihomesd.com/updateProduct/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject), // Convert object to JSON
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

  const handleImageUpload = async (file) => {
    //   setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=b7424c6aa6bf3ab8f5c2a405e70531a2",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        console.error("Image upload failed");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image", error);
      return null;
    } finally {
      // setUploadingImage(false);
    }
  };

  const [errors, setErrors] = useState({});

  const validatePrices = () => {
    if (
      productRegularPrice < 0 ||
      productOffer < 0 ||
      productTP < 0 ||
      productMRP < 0 ||
      !productRegularPrice
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Prices must be non-negative.",
      }));
      setUploadLoading(false);
      return false;
    }
    return true;
  };

  const validateFields = () => {
    const newErrors = {};

    if (!productName.trim())
      newErrors.productName = "Product Name is required.";
    if (productRegularPrice <= 0)
      newErrors.productRegularPrice =
        "Regular Price is required and must be positive.";

    setErrors(newErrors);
    setUploadLoading(false);
    return Object.keys(newErrors).length === 0;
  };

  const messageStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontSize: "1.2em",
    textAlign: "center",
  };

  const loadingStyle = {
    ...messageStyle,
    color: "#007bff",
    fontSize: "1.5em",
  };

  const errorStyle = {
    ...messageStyle,
    color: "#dc3545",
    fontSize: "1.5em",
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        <p>Error: {error.message}</p>
      </div>
    );
  }

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
        }}
        onSubmit={handleSubmit}
      >
        <div className="row mb-3">
          <EditProductPageImage
            setNewProductImage={setNewProductImage}
            newProductImage={newProductImage}
            deleteFetchImageFromArray={deleteFetchImageFromArray}
            productImage={productImage}
          ></EditProductPageImage>
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.productName ? "is-invalid" : ""
              }`}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Categories</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          {/* Product Stock and Tags */}
          <div className="col-md-4">
            <label className="form-label">Product Stock</label>
            <input
              type="number"
              className={`form-control ${
                errors.productStock ? "is-invalid" : ""
              }`}
              value={productStock}
              onChange={(e) => setProductStock(parseInt(e.target.value))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Product Tag</label>
            <input
              type="text"
              className={`form-control ${
                errors.productTag ? "is-invalid" : ""
              }`}
              value={productTag}
              onChange={(e) => setProductTag(e.target.value.split(","))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Product Live Status</label>
            <div>
              <div
                onClick={() => setIsProductLive(!isProductLive)}
                style={{
                  backgroundColor: isProductLive ? "green" : "red",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                  borderRadius: "5px",
                  textAlign: "center", // Center the text inside the button
                  userSelect: "none", // Disable text selection on double-click
                }}
              >
                {isProductLive ? "Product Live" : "Product Off"}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          {/* Short Description */}
          <div className="col-md-12">
            <label className="form-label">Short Description</label>
            <textarea
              className={`form-control ${
                errors.shortDescription ? "is-invalid" : ""
              }`}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="row mb-3">
          {/* Product Code, TP, MRP */}
          <div className="col-md-4">
            <label className="form-label">Product Code</label>
            <input
              type="text"
              className={`form-control ${
                errors.productCode ? "is-invalid" : ""
              }`}
              value={productCode}
              onChange={(e) =>
                setProductCode(e.target.value.replace(/\s/g, ""))
              }
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">TP</label>
            <input
              type="number"
              className={`form-control ${errors.productTP ? "is-invalid" : ""}`}
              value={productTP}
              onChange={(e) => setProductTP(parseFloat(e.target.value))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">MRP</label>
            <input
              type="number"
              className={`form-control ${
                errors.productMRP ? "is-invalid" : ""
              }`}
              value={productMRP}
              onChange={(e) => setProductMRP(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="row mb-3">
          {/* Product Regular Price and Offer Price */}
          <div className="col-md-6">
            <label className="form-label">Regular Price</label>
            <input
              type="number"
              className={`form-control ${
                errors.productRegularPrice ? "is-invalid" : ""
              }`}
              value={productRegularPrice}
              onChange={(e) =>
                setProductRegularPrice(parseFloat(e.target.value))
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Offer Price (%)</label>
            <input
              type="number"
              className={`form-control ${
                errors.productOffer ? "is-invalid" : ""
              }`}
              value={productOffer}
              onChange={(e) => setProductOffer(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="row mb-3">
          {/* Calculated Final Price */}
          <div className="col-md-12">
            <label className="form-label">Final Price</label>
            <input
              type="text"
              className="form-control"
              value={(
                productRegularPrice -
                productRegularPrice * (productOffer / 100)
              ).toFixed(2)}
              readOnly
            />
          </div>
        </div>

        <div className="row mb-3">
          {/* Product YouTube Link */}
          <div className="col-md-12">
            <label className="form-label">YouTube Link</label>
            <input
              type="text"
              className={`form-control ${
                errors.productYoutubeLink ? "is-invalid" : ""
              }`}
              value={productYoutubeLink}
              onChange={(e) => setProductYoutubeLink(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          {/* Product Description */}
          <div className="col-md-12">
            <label className="form-label">Product Description</label>
            <CKEditor
              editor={ClassicEditor}
              data={productDescriptionState}
              onChange={(event, editor) =>
                setProductDescriptionState(editor.getData())
              }
            />
          </div>
        </div>

        <div className="row mb-3">
          {/* Additional Info */}
          <div className="col-md-12">
            <label className="form-label">Additional Info</label>
            <CKEditor
              editor={ClassicEditor}
              data={additionalInfo}
              onChange={(event, editor) => setAdditionalInfo(editor.getData())}
            />
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="alert alert-danger">
            <ul>
              {Object.keys(errors).map((key) => (
                <li key={key}>{errors[key]}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="d-flex justify-content-center">
          {uploadLoading ? (
            <div style={{ textAlign: "center" }}> Loading... </div>
          ) : (
            <button type="submit" className="btn btn-success px-5 py-2 mt-4">
              Update Product
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
