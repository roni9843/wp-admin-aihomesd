import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Crop = () => {
  const [upImgs, setUpImgs] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [croppedImages, setCroppedImages] = useState([]);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 1 }); // Set aspect ratio to 1 for square cropping
  const [completedCrop, setCompletedCrop] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const imagesArray = filesArray.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagesArray).then((images) => {
        setUpImgs(images);
        setCurrentImgIndex(0); // Reset to the first image
        setCroppedImages([]); // Clear any previously cropped images
        setCompletedCrop(null); // Reset completed crop state
      });
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

  const handleNextImage = async () => {
    if (currentImgIndex < upImgs.length - 1) {
      if (completedCrop) {
        await saveCroppedImage();
      }
      setCurrentImgIndex(currentImgIndex + 1);
      setCompletedCrop(null);
      setCrop({ unit: "%", width: 30, aspect: 1 }); // Set aspect ratio to 1 for square cropping
    }
  };

  const saveCroppedImage = async () => {
    const blobImg = await new Promise((resolve, reject) => {
      previewCanvasRef.current.toBlob(
        (blob) => {
          if (!blob) reject("Cannot load image from crop data.");
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });

    setCroppedImages((prev) => [
      ...prev,
      { blob: blobImg, name: `cropped_image_${currentImgIndex + 1}.jpeg` },
    ]);
  };

  const handlePreviousImage = () => {
    if (currentImgIndex > 0) {
      setCurrentImgIndex(currentImgIndex - 1);
      setCompletedCrop(null);
      setCrop({ unit: "%", width: 30, aspect: 1 }); // Set aspect ratio to 1 for square cropping
    }
  };

  const downloadAllCroppedImages = async () => {
    if (completedCrop) {
      await saveCroppedImage();
    } else {
      // If the last image is not cropped, ensure it gets cropped before downloading
      await handleNextImage();
    }

    const zip = new JSZip();
    for (let i = 0; i < upImgs.length; i++) {
      const croppedImg = croppedImages.find(
        (img) => img.name === `cropped_image_${i + 1}.jpeg`
      );
      if (croppedImg) {
        zip.file(croppedImg.name, croppedImg.blob);
      } else {
        // Crop the image if not already cropped
        await setCurrentImgIndex(i);
        await saveCroppedImage();
        const newCroppedImg = croppedImages.find(
          (img) => img.name === `cropped_image_${i + 1}.jpeg`
        );
        if (newCroppedImg) {
          zip.file(newCroppedImg.name, newCroppedImg.blob);
        }
      }
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "cropped_images.zip");
    });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              multiple
            />
          </div>

          {upImgs.length > 0 && (
            <ReactCrop
              src={upImgs[currentImgIndex]}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              keepSelection
            />
          )}

          {completedCrop && (
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  width: Math.round(completedCrop?.width ?? 0),
                  height: Math.round(completedCrop?.height ?? 0),
                }}
              />
            </div>
          )}

          <Row className="justify-content-center mt-3">
            <Col xs="auto">
              <Button
                className="mr-3"
                variant="secondary"
                onClick={handlePreviousImage}
                disabled={currentImgIndex === 0}
              >
                👈
              </Button>
              <Button
                className="ml-3"
                variant="secondary"
                onClick={handleNextImage}
                disabled={currentImgIndex === upImgs.length - 1}
              >
                👉
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-3">
        <Col md="auto">
          <Button
            variant="success"
            onClick={downloadAllCroppedImages}
            disabled={croppedImages.length === 0}
          >
            Download All Cropped Images as ZIP
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Crop;
