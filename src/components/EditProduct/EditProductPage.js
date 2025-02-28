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
  const [newProductImage, setNewProductImage] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("productId=")[1];
    setProductId(id);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://backend.aihomesd.com/getAllCategory");
        if (!response.ok) throw new Error("Network response was not ok");
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

  useEffect(() => {
    if (productId) callProduct(productId);
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
      console.error("Error fetching product:", error);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("https://backend.aihomesd.com/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return response.ok ? data.imageUrl : null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const deleteFetchImageFromArray = (link) => {
    setProductImage(productImage.filter((img) => img !== link));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    const uploadedImageUrls = [];
    for (const image of newProductImage) {
      const url = await handleImageUpload(image);
      if (url) uploadedImageUrls.push(url);
    }

    const updatedImages = [...productImage, ...uploadedImageUrls];
    setProductImage(updatedImages);
    setNewProductImage([]);

    if (updatedImages.length === 0) {
      setErrors((prev) => ({ ...prev, image: "Please upload at least one image" }));
      setUploadLoading(false);
      return;
    }

    if (!validatePrices() || !validateFields()) {
      setUploadLoading(false);
      return;
    }

    const formDataObject = {
      productName,
      productStock: productStock || 0,
      productRegularPrice,
      productOffer: productOffer || 0,
      productTag,
      shortDescription,
      productYoutubeLink,
      additionalInfo,
      productTP: productTP || 0,
      productMRP: productMRP || 0,
      productDescription: productDescriptionState,
      category: selectedCategory,
      productLive: isProductLive,
      images: updatedImages,
    };

    try {
      const response = await fetch(`https://backend.aihomesd.com/updateProduct/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataObject),
      });
      if (response.ok) {
        alert("Product updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    } finally {
      setUploadLoading(false);
    }
  };

  const validatePrices = () => {
    if (productRegularPrice <= 0 || productOffer < 0 || productTP < 0 || productMRP < 0) {
      setErrors((prev) => ({
        ...prev,
        price: "Prices must be non-negative and Regular Price must be positive.",
      }));
      return false;
    }
    return true;
  };

  const validateFields = () => {
    const newErrors = {};
    if (!productName.trim()) newErrors.productName = "Product Name is required.";
    if (productRegularPrice <= 0)
      newErrors.productRegularPrice = "Regular Price must be positive.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">Error: {error.message}</div>;
  }

  return (
    <div className="container my-4">
      <form className="p-4 " onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label htmlFor="productName" className="form-label fw-bold">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              className={`form-control ${errors.productName ? "is-invalid" : ""}`}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="category" className="form-label fw-bold">
              Categories
            </label>
            <select
              id="category"
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label htmlFor="productStock" className="form-label fw-bold">
              Product Stock
            </label>
            <input
              type="number"
              id="productStock"
              className="form-control"
              value={productStock}
              onChange={(e) => setProductStock(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="productTag" className="form-label fw-bold">
              Product Tags
            </label>
            <input
              type="text"
              id="productTag"
              className="form-control"
              value={productTag.join(",")}
              onChange={(e) =>
                setProductTag(e.target.value.split(",").map((tag) => tag.trim()))
              }
              placeholder="e.g., tag1, tag2"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Product Live Status</label>
            <button
              type="button"
              className={`btn w-100 ${isProductLive ? "btn-success" : "btn-danger"}`}
              onClick={() => setIsProductLive(!isProductLive)}
            >
              {isProductLive ? "Live" : "Off"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="shortDescription" className="form-label fw-bold">
            Short Description
          </label>
          <textarea
            id="shortDescription"
            className="form-control"
            rows="3"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label htmlFor="productCode" className="form-label fw-bold">
              Product Code
            </label>
            <input
              type="text"
              id="productCode"
              className="form-control"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value.replace(/\s/g, ""))}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="productTP" className="form-label fw-bold">
              Trade Price (TP)
            </label>
            <input
              type="number"
              id="productTP"
              className="form-control"
              value={productTP}
              onChange={(e) => setProductTP(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="productMRP" className="form-label fw-bold">
              MRP
            </label>
            <input
              type="number"
              id="productMRP"
              className="form-control"
              value={productMRP}
              onChange={(e) => setProductMRP(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label htmlFor="productRegularPrice" className="form-label fw-bold">
              Regular Price
            </label>
            <input
              type="number"
              id="productRegularPrice"
              className={`form-control ${errors.productRegularPrice ? "is-invalid" : ""}`}
              value={productRegularPrice}
              onChange={(e) => setProductRegularPrice(parseFloat(e.target.value) || 0)}
            />
            {errors.productRegularPrice && (
              <div className="invalid-feedback">{errors.productRegularPrice}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="productOffer" className="form-label fw-bold">
              Offer Price (%)
            </label>
            <input
              type="number"
              id="productOffer"
              className="form-control"
              value={productOffer}
              onChange={(e) => setProductOffer(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="finalPrice" className="form-label fw-bold">
            Final Price
          </label>
          <input
            type="text"
            id="finalPrice"
            className="form-control"
            value={(productRegularPrice - productRegularPrice * (productOffer / 100)).toFixed(2)}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productYoutubeLink" className="form-label fw-bold">
            YouTube Link
          </label>
          <input
            type="text"
            id="productYoutubeLink"
            className="form-control"
            value={productYoutubeLink}
            onChange={(e) => setProductYoutubeLink(e.target.value)}
          />
        </div>

        <EditProductPageImage
          setNewProductImage={setNewProductImage}
          newProductImage={newProductImage}
          deleteFetchImageFromArray={deleteFetchImageFromArray}
          productImage={productImage}
        />

        <div className="mb-3">
          <label className="form-label fw-bold">Product Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={productDescriptionState}
            onChange={(event, editor) => setProductDescriptionState(editor.getData())}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Additional Info</label>
          <CKEditor
            editor={ClassicEditor}
            data={additionalInfo}
            onChange={(event, editor) => setAdditionalInfo(editor.getData())}
          />
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary px-5 py-2"
            disabled={uploadLoading}
          >
            {uploadLoading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {uploadLoading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-control,
        .form-select {
          border-radius: 6px;
        }
        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
          border-radius: 6px;
          transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
          background-color: #0056b3;
          border-color: #0056b3;
        }
      `}</style>
    </div>
  );
}