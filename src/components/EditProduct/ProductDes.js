import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

export default function ProductDes({ productData, setProductData }) {
  const dataaa = "<p>hlw</p>";

  const [dataDes, seDataDes] = useState(productData.productDescription);

  return (
    <div className="form-group">
      <label htmlFor="productDescription">
        Product Description -- {dataDes}
      </label>
      <CKEditor
        editor={ClassicEditor}
        data={dataDes}
        onChange={(event, editor) =>
          setProductData({
            ...productData,
            productDescription: editor.getData(),
          })
        }
      />
    </div>
  );
}
