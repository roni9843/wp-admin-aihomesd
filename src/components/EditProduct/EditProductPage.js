import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useLayoutEffect, useState } from "react";

export default function EditProductPage() {
  const [productId, setProductId] = useState("");
  const [productData, setProductData] = useState({});

  useLayoutEffect(() => {
    // Extract the productId from the URL path
    const path = window.location.pathname;
    const id = path.split("productId=")[1];

    setProductId(id);
  }, []);

  useEffect(() => {
    callProduct(productId);
  }, [productId]);

  const callProduct = async (productId) => {
    const url = "https://elec-ecommerce-back.vercel.app/getProductById";
    const payload = {
      productId: productId,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setProductData(data);
      // Handle the fetched product data here
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div>
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
              width: "900px",
            }}
          >
            <form>
              <div className="row">
                <div className="col-8">
                  <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="productName"
                      name="productName"
                      value={productData.productName}
                      onChange={
                        (e) =>
                          setProductData({
                            ...productData,
                            [e.target.name]: e.target.value,
                          })

                        // setProductData({
                        //   ...productData,
                        //   productData["images"] : [...productData["images"],[e.target.name]: e.target.value],

                        // })

                        // setProductData({
                        //   ...productData["images"],
                        //   [Object.keys(productData["images"]).length]:
                        //     e.target.value,
                        // })

                        // setProductData({
                        //   ...productData,
                        //   images: [...productData.images, "hellow"],
                        // })

                        // console.log(typeof productData["images"])
                      }
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
                      //  value={selectedCategory}
                      //  onChange={handleCategoryChange}
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
                    //  value={productStock}
                    //    onChange={(e) => setProductStock(e.target.value)}
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
                    //  value={productTags}
                    //  onChange={handleTagChange}
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
                    //   value={productLive}
                    //   onChange={(e) => setProductLive(e.target.value)}
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
                  //   data={productDescription}

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
                  // onClick={handleChooseFile}
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
                  // ref={fileInputRef}
                  //  onChange={handleFileInputChange}
                />
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                ></div>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="productCode">Product Code</label>
                  <input
                    type="text"
                    className="form-control"
                    //   id="productCode"
                    //   value={productCode}
                    //   onChange={(e) => setProductCode(e.target.value)}
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
                    //   value={productTP}
                    //   onChange={(e) => setProductTP(e.target.value)}
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
                    //   value={mrp}
                    //   onChange={(e) => setMrp(e.target.value)}
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
                    //   value={regularPrice}
                    //   onChange={(e) => setRegularPrice(e.target.value)}
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
                    // value={offerPrice}
                    //    onChange={(e) => setOfferPrice(e.target.value)}
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
            </form>

            <div
              className="alert alert-success"
              role="alert"
              style={{ marginBottom: "20px" }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, at?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
