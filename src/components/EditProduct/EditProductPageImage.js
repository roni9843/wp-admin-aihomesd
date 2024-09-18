import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";

const ImageUpload = ({
  productImage,
  deleteFetchImageFromArray,
  setNewProductImage,
  newProductImage,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png"].includes(file.type);
      return isValidType;
    });

    validImages.forEach((file) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;
        img.onload = () => {
          if (img.width === img.height) {
            setNewProductImage((prevImages) => [...prevImages, file]);
          } else {
            alert("Image must be square.");
          }
        };
      };

      reader.readAsDataURL(file);
    });
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleDeleteImage = (index) => {
    setNewProductImage((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <Container
        style={{
          padding: "30px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Images
        </div>
        <Row>
          {productImage.length > 0 ? (
            productImage.map((image, index) => (
              <Col xs={6} sm={6} md={4} lg={3} key={index} className="mb-4">
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: "0px",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={image}
                    alt={`Product ${index}`}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      borderBottom: "1px solid #ddd",
                      // marginBottom: "10px",
                      // fetch image
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#dc3545",
                      fontSize: "20px",
                      transition: "color 0.3s ease",
                    }}
                    onClick={() => deleteFetchImageFromArray(image)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </Col>
            ))
          ) : (
            <Col>
              <p>No images available</p>
            </Col>
          )}
        </Row>

        <Row>
          {newProductImage.length > 0 &&
            newProductImage.map((image, index) => (
              <Col xs={6} sm={6} md={4} lg={3} key={index} className="mb-4">
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: "0px",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      borderBottom: "1px solid #ddd",
                      //   marginBottom: "10px",
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#dc3545",
                      fontSize: "20px",
                      transition: "color 0.3s ease",
                    }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </Col>
            ))}
        </Row>
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onClick={handleChooseFile}
          >
            Upload new image
          </button>
          <input
            style={{
              display: "none",
            }}
            type="file"
            accept=".jpg,.png,.jpeg"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </Container>
    </div>
  );
};

export default ImageUpload;

/**
 *   <Row>
            {productImage.length > 0 ? (
              productImage.map((image, index) => (
                <Col xs={6} sm={6} md={4} lg={3} key={index} className="mb-4">
                  <div
                    style={{
                      border: "1px solid #ddd",
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Product ${index}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        borderBottom: "1px solid #ddd",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                </Col>
              ))
            ) : (
              <Col>
                <p>No images available</p>
              </Col>
            )}
          </Row>
 */
