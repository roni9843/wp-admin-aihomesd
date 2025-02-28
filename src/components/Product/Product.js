import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useRef, useState } from "react";
import "./Product.css";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, IconButton } from "@mui/material";
import ImageUpload from './../EditProduct/EditProductPageImage';
import ImageUpload_22 from "./ImageUpload";

const ErrorMessage = ({ message }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: red[50],
        border: `1px solid ${red[300]}`,
        borderRadius: "4px",
        padding: "8px 12px",
        marginTop: "8px",
        width: "100%",
        position: "relative",
      }}
    >
      <ErrorOutlineIcon sx={{ color: red[600], marginRight: "8px" }} />
      <Typography variant="body2" color={red[800]} sx={{ flexGrow: 1 }}>
        {message}
      </Typography>
      <IconButton
        sx={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        //   onClick={() => setVisible(false)}
      >
        <ErrorOutlineIcon />
      </IconButton>
    </Box>
  );
};

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
  const [shortDescription, setShortDescription] = useState("");
  const [productYoutubeLink, setProductYoutubeLink] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const pdfInputRef = useRef(null);

  const [discountedPrice, setDiscountedPrice] = useState("");

  useEffect(() => {
    if (regularPrice && offerPrice) {
      const regPrice = parseFloat(regularPrice);
      const offerPercentage = parseFloat(offerPrice);

      // Calculate the discounted price
      const discountAmount = (regPrice * offerPercentage) / 100;
      const calculatedDiscountedPrice = regPrice - discountAmount;

      setDiscountedPrice(calculatedDiscountedPrice.toFixed(2));
    } else {
      setDiscountedPrice("");
    }
  }, [regularPrice, offerPrice]);

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backend.aihomesd.com/getAllCategory"
        );
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
      const res = await fetch("https://backend.aihomesd.com/upload", {
        method: "POST",
        body: formData,
    });

      const data = await res.json();


      if (res.ok) {
        return data.imageUrl;
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

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const isValidType = ["image/jpeg", "image/png"].includes(file.type);

        if (!isValidType) {
          alert(`File type not allowed: ${file.name}`);
          resolve({ file, isValid: false });
          return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;
          img.onload = () => {
            const isSquare = img.width === img.height;
            if (isSquare) {
              resolve({ file, isValid: true });
            } else {
              alert(`Image must be square: ${file.name}`);
              resolve({ file, isValid: false });
            }
          };
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((results) => {
      const validImages = results
        .filter((result) => result.isValid)
        .map((result) => result.file);
      const newImagePreviewUrls = validImages.map((file) =>
        URL.createObjectURL(file)
      );

      setPendingImages((prevImages) => [...prevImages, ...validImages]);
      setImagePreviewUrls((prevUrls) => [...prevUrls, ...newImagePreviewUrls]);
    });
  };

  // const handleFileInputChange = (event) => {
  //   const files = Array.from(event.target.files);
  //   setPendingImages([...pendingImages, ...files]);

  //   const newImagePreviewUrls = files.map((file) => URL.createObjectURL(file));
  //   setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   // Validation for prices
  //   if (!regularPrice || Number(regularPrice) <= 0) {
  //     alert("Please enter a valid regular price.");
  //     return;
  //   }

  //   const uploadedImageUrls = [];

  //   for (let i = 0; i < pendingImages.length; i++) {
  //     const url = await handleImageUpload(pendingImages[i]);
  //     if (url) {
  //       uploadedImageUrls.push(url);
  //       setProductImages((prev) => [...prev, url]);
  //     }
  //   }

  //   setPendingImages([]);
  //   setImagePreviewUrls([]);

  //   const productData = {
  //     productName,
  //     productStock,
  //     productDescription,
  //     productRegularPrice: regularPrice,
  //     productOffer: offerPrice,
  //     productTag: productTags.split(",").map((tag) => tag.trim()),
  //     images: uploadedImageUrls,
  //     productLive: productLive === "yes",
  //     category: selectedCategory, // Ensure the field name matches the backend
  //     productCode,
  //     productTP,
  //     productMRP: mrp,
  //   };

  //   try {
  //     const response = await fetch("https://backend.aihomesd.com/postProduct", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(productData),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();

  //       setSuccessMessage("Product created successfully!");

  //       alert("Product created successfully!");
  //       // Clear the form fields after successful submission
  //       setProductName("");
  //       setProductStock("");
  //       setProductDescription("");
  //       setProductTags("");
  //       setProductImages([]);
  //       setPendingImages([]);
  //       setImagePreviewUrls([]);
  //       setProductLive("");
  //       setSelectedCategory("");
  //       setRegularPrice("");
  //       setOfferPrice("");
  //       setProductCode("");
  //       setProductTP("");
  //       setMrp("");
  //     } else {
  //       const errorData = await response.json();
  //       alert(`Error: ${errorData.error}`);
  //     }
  //   } catch (error) {
  //     console.error("Error saving product:", error);
  //     alert("An error occurred while saving the product.");
  //   }
  // };

  const removeImage = (index) => {
    const updatedPendingImages = pendingImages.filter((_, i) => i !== index);
    setPendingImages(updatedPendingImages);

    const updatedImagePreviewUrls = imagePreviewUrls.filter(
      (_, i) => i !== index
    );
    setImagePreviewUrls(updatedImagePreviewUrls);
  };

  // Function to validate if offerPrice is less than or equal to regularPrice
  const validatePrices = () => {
    if (offerPrice && Number(offerPrice) > Number(regularPrice)) {
      alert("Offer price should not be greater than the regular price.");
      return false;
    }
    return true;
  };

  // Function to clear the form fields after successful submission
  const clearFormFields = () => {
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
    setShortDescription("");
    setProductYoutubeLink("");
    setAdditionalInfo("");
    
  };

  // Function to handle image removal with confirmation
  const handleRemoveImage = (index) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      removeImage(index);
    }
  };

  // Function to toggle the live status of the product
  const toggleProductLive = () => {
    setProductLive((prev) => (prev === "yes" ? "no" : "yes"));
  };

  const [pdfFile, setPdfFile] = useState(null);

  const [pdfFileName, setPdfFileName] = useState("");

  // Handle the change event when a PDF file is selected
  const handlePdfFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFileName(file.name);
      setPdfFile(file); // This line was missing and ensures the file is stored in the state
    }
  };

  // Enhance the handleSubmit function with the new validation and clearing functions

  // ? this is new submit btn
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   // Validation
  //   if (!validateForm()) return;

  //   const uploadedImageUrls = [];

  //   for (let i = 0; i < pendingImages.length; i++) {
  //     const url = await handleImageUpload(pendingImages[i]);
  //     if (url) {
  //       uploadedImageUrls.push(url);
  //       setProductImages((prev) => [...prev, url]);
  //     }
  //   }

  //   setPendingImages([]);
  //   setImagePreviewUrls([]);

  //   // Create a product data object instead of FormData
  //   const productData = {
  //     productName,
  //     productStock,
  //     productDescription,
  //     productRegularPrice: regularPrice,
  //     productOffer: offerPrice,
  //     productTag: productTags.split(",").map((tag) => tag.trim()), // Split and trim tags
  //     productLive: productLive === "yes",
  //     category: selectedCategory,
  //     productCode,
  //     productTP,
  //     productMRP: mrp,
  //     shortDescription,
  //     productYoutubeLink,
  //     additionalInfo,
  //     images: uploadedImageUrls, // Add image URLs directly as an array
  //     pdfFile: pdfFile || null, // Add the PDF file (assuming it's being uploaded separately)
  //   };

  //   console.log("this is data -> ", productData);

  //   try {
  //     const response = await fetch("https://backend.aihomesd.com/postProduct", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json", // Send as JSON
  //       },
  //       body: JSON.stringify(productData), // Convert the product data object to JSON
  //     });

  //     if (response.ok) {
  //       const data = await response.json();

  //       setSuccessMessage("Product created successfully!");
  //       alert("Product created successfully!");

  //       // Clear the form fields after successful submission
  //       clearFormFields();
  //     } else {
  //       const errorData = await response.json();
  //       alert(`Error: ${errorData.error}`);
  //     }
  //   } catch (error) {
  //     console.error("Error saving product:", error);
  //     alert("An error occurred while saving the product.");
  //   }
  // };

  // ? hide
  const handleSubmit = async (event) => {
    event.preventDefault();

   

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

       // Validation for prices
       if (!validateForm(uploadedImageUrls)) return;

    // Create a product data object instead of FormData
    const productData = {
      productName,
      productStock,
      productDescription,
      productRegularPrice: regularPrice,
      productOffer: offerPrice,
      productTag: productTags.split(",").map((tag) => tag.trim()), // Split and trim tags
      productLive: productLive === "yes",
      category: selectedCategory,
      productCode,
      productTP,
      productMRP: mrp,
      shortDescription,
      productYoutubeLink,
      additionalInfo,
      images: uploadedImageUrls, // Add image URLs directly as an array
      pdfFile: pdfFile || null, // Add the PDF file (assuming it's being uploaded separately)
    };

    console.log("this is data -> ", productData);

    try {
      //  const response = await fetch("https://backend.aihomesd.com/postProduct", {
      const response = await fetch("https://backend.aihomesd.com/postProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send as JSON
        },
        body: JSON.stringify(productData), // Convert the product data object to JSON
      });

      if (response.ok) {
        const data = await response.json();

        setSuccessMessage("Product created successfully!");
        alert("Product created successfully!");

        // Clear the form fields after successful submission
        clearFormFields();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    }
  };

  // Handle the click to choose a PDF file
  const handleChoosePdfFile = () => {
    pdfInputRef.current.click();
  };

  const inputStyle = {
    borderRadius: "5px",
    borderColor: "#ced4da",
    marginBottom: "10px",
    padding: "10px",
    width: "100%",
  };

  const labelStyle = {
    marginBottom: "5px",
    fontWeight: "bold",
  };

  const buttonStyle = {
    borderRadius: "5px",
    borderColor: "#ced4da",
    marginBottom: "10px",
    padding: "10px",
    width: "100%",
  };

  const [errors, setErrors] = useState({});

  const isNotEmpty = (value) => value.trim() !== "";

  const validateForm = (uploadedImageUrls) => {
    let isValid = true;
    const newErrors = {};

    // Trim values before validation
    const trimmedProductName = productName.trim();
    const trimmedCategory = selectedCategory.trim();
    const trimmedRegularPrice = regularPrice.trim();

    if (!isNotEmpty(trimmedProductName)) {
      isValid = false;
      newErrors.productName = "Product Name is required.";
    }
    if (!isNotEmpty(trimmedCategory)) {
      isValid = false;
      newErrors.selectedCategory = "Product Category is required.";
    }
    if (uploadedImageUrls.length === 0) {
      isValid = false;
      newErrors.productImages = "At least one Product Image is required.";
    }
    if (!isNotEmpty(trimmedRegularPrice) || Number(trimmedRegularPrice) <= 0) {
      isValid = false;
      newErrors.regularPrice =
        "Product Regular Price is required and must be greater than zero.";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleRegularPriceChange = (e) => {
    setRegularPrice(e.target.value.trim());
  };
  const handleProductStockChange = (e) => {
    setProductStock(e.target.value.trim());
  };
  const handleProductDesChange = (e) => {
    setShortDescription(e.target.value);
  };
  const handleProductCode = (e) => {
    setProductCode(e.target.value.trim());
  };
  const handleProductTP = (e) => {
    setProductTP(e.target.value.trim());
  };
  const handleProductMRP = (e) => {
    setMrp(e.target.value.trim());
  };
  const handleProductOffer = (e) => {
    setOfferPrice(e.target.value.trim());
  };

  return (
    <div className="container-fluid" style={{ padding: "20px", backgroundColor: "#f1f3f5" }}>
    {successMessage && (
      <div 
        className="alert alert-success alert-dismissible fade show" 
        role="alert"
        style={{ marginBottom: "20px", borderRadius: "8px" }}
      >
        {successMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )}
  
    <div className="row justify-content-center">
      <div 
        className="col-12 col-lg-10 card"
        style={{
          padding: "25px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "none",
          marginBottom: "20px"
        }}
      >
        <h3 className="mb-4" style={{ color: "#2c3e50", fontWeight: "600" }}>
          Create New Product
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label htmlFor="productName" className="form-label" style={{ color: "#495057" }}>
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                value={productName}
                onChange={handleProductNameChange}
                style={{
                  borderRadius: "6px",
                  padding: "12px",
                  borderColor: "#dee2e6",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)"
                }}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="productCategory" className="form-label" style={{ color: "#495057" }}>
                Product Category
              </label>
              <select
                className="form-select"
                id="productCategory"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  borderRadius: "6px",
                  padding: "12px",
                  borderColor: "#dee2e6",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)"
                }}
              >
                <option value="" disabled>Select a category</option>
                {productCategory.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label htmlFor="productStock" className="form-label" style={{ color: "#495057" }}>
                Product Stock
              </label>
              <input
                type="number"
                className="form-control"
                id="productStock"
                value={productStock}
                onChange={handleProductStockChange}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="productTags" className="form-label" style={{ color: "#495057" }}>
                Product Tags (comma-separated)
              </label>
              <input
                type="text"
                className="form-control"
                id="productTags"
                value={productTags}
                onChange={handleTagChange}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" style={{ color: "#495057" }}>
                Product Live
              </label>
              <select
                className="form-select"
                value={productLive}
                onChange={(e) => setProductLive(e.target.value)}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
  
          <div className="mb-3">
            <label htmlFor="shortDescription" className="form-label" style={{ color: "#495057" }}>
              Short Description
            </label>
            <input
              type="text"
              className="form-control"
              id="shortDescription"
              value={shortDescription}
              onChange={handleProductDesChange}
              style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
            />
          </div>
  
          <div className="p-3 bg-light rounded shadow-sm mb-4">
      <label className="form-label fw-bold text-secondary">
        Product Images
      </label>

      {/* Upload Button */}
      <div className="d-flex align-items-center mb-3">
        <div
          className="border rounded shadow-sm d-flex align-items-center justify-content-center"
          style={{
            width: "120px",
            height: "120px",
            cursor: "pointer",
            background: "#f0f0f0",
          }}
          onClick={handleChooseFile}
        >
          <FontAwesomeIcon icon={faPlus} size="2x" className="text-primary" />
        </div>
        <input
          type="file"
          accept=".jpg,.png,.jpeg"
          multiple
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
      </div>

      {/* Image Previews */}
      <div className="d-flex flex-wrap gap-2">
        {imagePreviewUrls.map((url, index) => (
          <div key={index} className="position-relative border rounded shadow-sm overflow-hidden">
            <img
              src={url}
              alt="Preview"
              className="img-thumbnail"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-1 rounded-circle"
              style={{ width: "24px", height: "24px" }}
              onClick={() => removeImage(index)}
            >
              <FontAwesomeIcon icon={faTimes} size="sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label htmlFor="productCode" className="form-label" style={{ color: "#495057" }}>
                Product Code
              </label>
              <input
                type="text"
                className="form-control"
                id="productCode"
                value={productCode}
                onChange={handleProductCode}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="productTP" className="form-label" style={{ color: "#495057" }}>
                Product TP
              </label>
              <input
                type="number"
                className="form-control"
                id="productTP"
                value={productTP}
                onChange={handleProductTP}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="mrp" className="form-label" style={{ color: "#495057" }}>
                Product MRP
              </label>
              <input
                type="number"
                className="form-control"
                id="mrp"
                value={mrp}
                onChange={handleProductMRP}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              />
            </div>
          </div>
  
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="regularPrice" className="form-label" style={{ color: "#495057" }}>
                Regular Price
              </label>
              <input
                type="number"
                className="form-control"
                id="regularPrice"
                value={regularPrice}
                onChange={handleRegularPriceChange}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="offerPrice" className="form-label" style={{ color: "#495057" }}>
                Offer Price (%)
              </label>
              <input
                type="number"
                className="form-control"
                id="offerPrice"
                value={offerPrice}
                onChange={handleProductOffer}
                style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
              />
              {discountedPrice && (
                <div className="mt-2 text-muted">
                  Discounted Price: ৳{discountedPrice}
                </div>
              )}
            </div>
          </div>
  
          <div className="mb-3">
            <label htmlFor="productYoutubeLink" className="form-label" style={{ color: "#495057" }}>
              Product YouTube Link
            </label>
            <input
              type="text"
              className="form-control"
              id="productYoutubeLink"
              value={productYoutubeLink}
              onChange={(e) => setProductYoutubeLink(e.target.value)}
              style={{ borderRadius: "6px", padding: "12px", borderColor: "#dee2e6" }}
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="productDescription" className="form-label" style={{ color: "#495057" }}>
              Product Description
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={productDescription}
              onChange={(event, editor) => {
                const data = editor.getData();
                setProductDescription(data);
              }}
              config={{
                toolbar: {
                  items: [
                    'heading', '|',
                    'bold', 'italic', 'link', '|',
                    'bulletedList', 'numberedList', '|',
                    'undo', 'redo'
                  ]
                }
              }}
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="additionalInfo" className="form-label" style={{ color: "#495057" }}>
              Additional Information
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={additionalInfo}
              onChange={(event, editor) => {
                const data = editor.getData();
                setAdditionalInfo(data);
              }}
              config={{
                toolbar: {
                  items: [
                    'heading', '|',
                    'bold', 'italic', 'link', '|',
                    'bulletedList', 'numberedList', '|',
                    'undo', 'redo'
                  ]
                }
              }}
            />
          </div>
  
          <button
            type="submit"
            className="btn btn-success w-100"
            style={{ 
              borderRadius: "6px", 
              padding: "12px",
              fontWeight: "500",
              backgroundColor: "#28a745",
              borderColor: "#28a745"
            }}
            disabled={uploadingImage}
          >
            {uploadingImage ? "Uploading..." : "Save Product"}
          </button>
  
          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger mt-3" style={{ borderRadius: "6px" }}>
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
  );
}
