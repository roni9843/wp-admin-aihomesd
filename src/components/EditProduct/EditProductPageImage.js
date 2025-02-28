import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";

const ImageUpload = ({
  productImage,
  deleteFetchImageFromArray,
  setNewProductImage,
  newProductImage,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

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
    <Container className="p-4 bg-light rounded shadow-sm mb-4">
      <h5 className="fw-bold mb-3">Images</h5>
      <Row className="g-3">
        {productImage.map((image, index) => (
          <Col xs={6} sm={4} md={3} key={index}>
            <div className="position-relative border rounded shadow-sm overflow-hidden">
              <img
                src={image}
                alt={`Product ${index}`}
                className="img-fluid rounded"
              />
              <Button
                variant="danger"
                className="position-absolute top-0 end-0 m-1 p-1 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}
                onClick={() => deleteFetchImageFromArray(image)}
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </Button>
            </div>
          </Col>
        ))}

        {newProductImage.map((image, index) => (
          <Col xs={6} sm={4} md={3} key={index}>
            <div className="position-relative border rounded shadow-sm overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="img-fluid rounded"
              />
              <Button
                variant="danger"
                className="position-absolute top-0 end-0 m-1 p-1 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "24px", height: "24px" }}
                onClick={() => handleDeleteImage(index)}
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </Button>
            </div>
          </Col>
        ))}

        {/* Upload New Image Button */}
        <Col xs={6} sm={4} md={3}>
          <div
            className="d-flex align-items-center justify-content-center border rounded shadow-sm"
            style={{
              height: "100%",
              minHeight: "120px",
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
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ImageUpload;
