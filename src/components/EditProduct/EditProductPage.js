import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useLayoutEffect, useState } from "react";

export default function EditProductPage() {
  const [productId, setProductId] = useState("");
  const [productData, setProductData] = useState({});
  const [allCategory, setAllCategory] = useState([]);

  useLayoutEffect(() => {
    // Extract the productId from the URL path
    const path = window.location.pathname;
    const id = path.split("productId=")[1];

    setProductId(id);
  }, []);

  useEffect(() => {
    callProduct(productId);
    callCategory();
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

  const callCategory = async (productId) => {
    const url = "https://elec-ecommerce-back.vercel.app/getAllCategory";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setAllCategory(data);
      // Handle the fetched product data here
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const productDescriptionFunc = async (props) => {
    if (Object.keys(productData).length !== 0) {
      console.log("this is inside call ", productData);

      setProductData({
        ...productData,
        productDescription: props,
      });
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
                      //   value={productData && productData.category.category}
                      // onChange={(e) =>
                      // setProductData({
                      //   ...productData,
                      //   category: e.target.value,
                      // })
                      // }
                      value={productData && productData?.category?.category}
                      onChange={(e) => {
                        let targetCategory = allCategory.filter(
                          (c) => c.category === e.target.value
                        );

                        console.log("this is category", targetCategory[0]);

                        setProductData((prevData) => ({
                          ...prevData,
                          category: {
                            ...targetCategory[0],
                          },
                        }));
                      }}
                      style={{
                        borderRadius: "5px",
                        borderColor: "#ced4da",
                        marginBottom: "10px",
                        padding: "10px",
                        width: "100%",
                      }}
                    >
                      {allCategory &&
                        allCategory.map((c) => (
                          <option key={c.category} value={c.category}>
                            {c.category}
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
                    value={productData.productStock}
                    onChange={(e) => setProductData(e.target.value)}
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
                    value={productData?.productTag?.join(", ")}
                    onChange={(e) => {
                      const tagsArray = e.target.value
                        .split(",")
                        .map((tag) => tag.trim());
                      setProductData({
                        ...productData,
                        productTag: tagsArray,
                      });
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

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Product Live</label>
                  <select
                    className="form-control"
                    value={productData.productLive}
                    onChange={(e) => {
                      setProductData({
                        ...productData,
                        productLive: e.target.value === "true" ? true : false,
                      });
                    }}
                    style={{
                      borderRadius: "5px",
                      borderColor: "#ced4da",
                      marginBottom: "10px",
                      padding: "10px",
                      width: "100%",
                    }}
                  >
                    <option value="">Select an option</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Product Description</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={productData.productDescription}
                  onChange={async (event, editor) => {
                    const data = editor.getData();

                    productDescriptionFunc(data);
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
