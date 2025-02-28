import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Card, ProgressBar } from "react-bootstrap";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Crop = () => {
  const [upImgs, setUpImgs] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [croppedImages, setCroppedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    aspect: 1,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      const filesArray = Array.from(e.target.files);
      const imagesArray = filesArray.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagesArray)
        .then((images) => {
          setUpImgs(images);
          setCurrentImgIndex(0);
          setCroppedImages([]);
          setCompletedCrop(null);
        })
        .finally(() => setIsProcessing(false));
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  const saveCroppedImage = useCallback(() => {
    if (!previewCanvasRef.current || !completedCrop) return Promise.resolve();

    return new Promise((resolve, reject) => {
      previewCanvasRef.current.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create cropped image"));
            return;
          }
          setCroppedImages((prev) => {
            const newCroppedImages = prev.filter(
              (img) => img.name !== `cropped_image_${currentImgIndex + 1}.jpeg`
            );
            return [
              ...newCroppedImages,
              { blob, name: `cropped_image_${currentImgIndex + 1}.jpeg` }
            ];
          });
          resolve();
        },
        "image/jpeg",
        1
      );
    });
  }, [currentImgIndex, completedCrop]);

  const handleNextImage = async () => {
    if (currentImgIndex < upImgs.length - 1) {
      if (completedCrop) {
        await saveCroppedImage();
      }
      setCurrentImgIndex(currentImgIndex + 1);
      setCompletedCrop(null);
    }
  };

  const handlePreviousImage = async () => {
    if (currentImgIndex > 0) {
      if (completedCrop) {
        await saveCroppedImage();
      }
      setCurrentImgIndex(currentImgIndex - 1);
      setCompletedCrop(null);
    }
  };

  const downloadAllCroppedImages = async () => {
    setIsProcessing(true);
    try {
      // Save the current crop if it exists
      if (completedCrop) {
        await saveCroppedImage();
      }

      const zip = new JSZip();
      const promises = [];

      // Process each image
      for (let index = 0; index < upImgs.length; index++) {
        const imgName = `cropped_image_${index + 1}.jpeg`;
        const existingCrop = croppedImages.find(img => img.name === imgName);

        if (existingCrop) {
          // If image is already cropped, add it to zip
          zip.file(existingCrop.name, existingCrop.blob);
        } else {
          // If not cropped, go to that image and crop it
          promises.push(
            (async () => {
              setCurrentImgIndex(index);
              // Wait for the image to render and crop to be applied
              await new Promise(resolve => setTimeout(resolve, 100));
              if (completedCrop) {
                await saveCroppedImage();
                const latestCrop = croppedImages.find(img => img.name === imgName);
                if (latestCrop) {
                  zip.file(latestCrop.name, latestCrop.blob);
                }
              }
            })()
          );
        }
      }

      // Wait for all uncropped images to be processed
      await Promise.all(promises);

      // Generate and download the ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "cropped_images.zip");
    } catch (error) {
      console.error("Error downloading images:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "1200px" }}>
      <Card className="shadow border-0" style={{ borderRadius: "8px" }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-4" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Image Cropper
          </Card.Title>
          
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              multiple
              disabled={isProcessing}
              className="form-control"
              style={{ padding: "0.375rem 0.75rem" }}
            />
            {isProcessing && <ProgressBar animated now={100} className="mt-2" />}
          </div>

          {upImgs.length > 0 && (
            <>
              <div className="mb-3 text-center" style={{ color: "#6c757d" }}>
                Image {currentImgIndex + 1} of {upImgs.length}
              </div>
              
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="text-center" style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
                    Original Image
                  </div>
                  <ReactCrop
                    src={upImgs[currentImgIndex]}
                    onImageLoaded={onLoad}
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    keepSelection
                    style={{ maxHeight: "500px", width: "100%" }}
                  />
                </Col>
                <Col md={6}>
                  <div className="text-center" style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
                    Preview
                  </div>
                  {completedCrop ? (
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "500px",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "block",
                        margin: "0 auto"
                      }}
                    />
                  ) : (
                    <div 
                      className="text-center bg-light"
                      style={{
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        color: "#6c757d"
                      }}
                    >
                      Make a selection to see preview
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="justify-content-center mb-3">
                <Col xs="auto">
                  <Button
                    variant="outline-primary"
                    onClick={handlePreviousImage}
                    disabled={currentImgIndex === 0 || isProcessing}
                    className="me-2"
                    style={{ minWidth: "100px" }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={handleNextImage}
                    disabled={currentImgIndex === upImgs.length - 1 || isProcessing}
                    style={{ minWidth: "100px" }}
                  >
                    Next
                  </Button>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col xs="auto">
                  <Button
                    variant="primary"
                    onClick={downloadAllCroppedImages}
                    disabled={upImgs.length === 0 || isProcessing}
                    style={{ 
                      padding: "0.5rem 1.5rem",
                      fontWeight: "500"
                    }}
                  >
                    {isProcessing ? "Processing..." : "Download All Cropped Images"}
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Crop;