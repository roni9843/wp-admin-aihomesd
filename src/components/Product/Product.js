import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useRef, useState } from "react";
import "./Product.css";

export default function Product() {
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productTags, setProductTags] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [productLive, setProductLive] = useState("");
  const [productCategory, setProductCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [regularPrice, setRegularPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productTP, setProductTP] = useState("");
  const [mrp, setMrp] = useState("");
  const fileInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/getAllCategory");
        const data = await response.json();
        // Assuming your response contains an array of categories
        setProductCategory(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleTagChange = (event) => {
    setProductTags(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
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
      setUploadingImage(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    setPendingImages([...pendingImages, ...files]);

    const newImagePreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for prices
    if (!regularPrice || Number(regularPrice) <= 0) {
      alert("Please enter a valid regular price.");
      return;
    }

    const uploadedImageUrls = [];

    for (let i = 0; i < pendingImages.length; i++) {
      const url = await handleImageUpload(pendingImages[i]);
      if (url) {
        uploadedImageUrls.push(url);
        setProductImages((prev) => [...prev, url]);
      }
    }

    setPendingImages([]);
    setImagePreviewUrls([]);

    const productData = {
      productName,
      productStock,
      productDescription,
      productRegularPrice: regularPrice,
      productOffer: offerPrice,
      productTag: productTags.split(",").map((tag) => tag.trim()),
      images: uploadedImageUrls,
      productLive: productLive === "yes",
      category: selectedCategory, // Ensure the field name matches the backend
      productCode,
      productTP,
      productMRP: mrp,
    };

    try {
      const response = await fetch("http://localhost:8000/postProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();

        setSuccessMessage("Product created successfully!");

        alert("Product created successfully!");
        // Clear the form fields after successful submission
        setProductName("");
        setProductStock("");
        setProductDescription("");
        setProductTags("");
        setProductImages([]);
        setPendingImages([]);
        setImagePreviewUrls([]);
        setProductLive("");
        setSelectedCategory("");
        setRegularPrice("");
        setOfferPrice("");
        setProductCode("");
        setProductTP("");
        setMrp("");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    }
  };

  const removeImage = (index) => {
    const updatedPendingImages = pendingImages.filter((_, i) => i !== index);
    setPendingImages(updatedPendingImages);

    const updatedImagePreviewUrls = imagePreviewUrls.filter(
      (_, i) => i !== index
    );
    setImagePreviewUrls(updatedImagePreviewUrls);
  };

  return (
    <div style={{ padding: "20px" }}>
      {successMessage && (
        <div
          className="alert alert-success"
          role="alert"
          style={{ marginBottom: "20px" }}
        >
          {successMessage}
        </div>
      )}

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
            width: "900px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-8">
                <div className="form-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    style={{
                      borderRadius: "5px",
                      borderColor: "#ced4da",
                      marginBottom: "10px",
                      padding: "10px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="productCategory">Product Category</label>
                  <select
                    className="form-control"
                    id="productCategory"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    style={{
                      borderRadius: "5px",
                      borderColor: "#ced4da",
                      marginBottom: "10px",
                      padding: "10px",
                      width: "100%",
                    }}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {productCategory.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="productStock">Product Stock</label>
                <input
                  type="number"
                  className="form-control"
                  id="productStock"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="productTags">Product Tags ( , )</label>
                <input
                  type="text"
                  className="form-control"
                  id="productTags"
                  value={productTags}
                  onChange={handleTagChange}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Product Live</label>
                <select
                  className="form-control"
                  value={productLive}
                  onChange={(e) => setProductLive(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="productDescription">Product Description</label>
              <CKEditor
                editor={ClassicEditor}
                data={productDescription}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setProductDescription(data);
                }}
                style={{
                  borderRadius: "5px",
                  borderColor: "#ced4da",
                  marginBottom: "10px",
                  padding: "10px",
                  width: "100%",
                }}
              />
            </div>

            <div className="form-group">
              <label>Product Images</label>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleChooseFile}
                style={{
                  borderRadius: "5px",
                  borderColor: "#ced4da",
                  marginBottom: "10px",
                  padding: "10px",
                  width: "100%",
                }}
              >
                Choose Files
              </button>
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={url}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="productCode">Product Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="productCode"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="productTP">Product TP</label>
                <input
                  type="number"
                  className="form-control"
                  id="productTP"
                  value={productTP}
                  onChange={(e) => setProductTP(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="mrp">Product MRP</label>
                <input
                  type="number"
                  className="form-control"
                  id="mrp"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="regularPrice">Regular Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="offerPrice">Offer Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="offerPrice"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#ced4da",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success"
              style={{
                borderRadius: "5px",
                borderColor: "#ced4da",
                marginBottom: "10px",
                padding: "10px",
                width: "100%",
              }}
              disabled={uploadingImage}
            >
              {uploadingImage ? "Uploading..." : "Save Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
