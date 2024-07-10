import React, { useEffect, useState } from "react";

export default function Category() {
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null); // New state for image file
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://elec-ecommerce-back.vercel.app/getAllCategory")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (category.trim() && imageFile) {
      try {
        // Upload image to ImgBB
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=b7424c6aa6bf3ab8f5c2a405e70531a2",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (!data.success) {
          console.error("Image upload failed");
          return;
        }

        const imageUrl = data.data.url;

        // Add category with image URL to your database
        const categoryResponse = await fetch(
          "http://localhost:8000/addCategory",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category,
              image: imageUrl,
            }),
          }
        );

        if (!categoryResponse.ok) {
          throw new Error("Failed to add category");
        }

        const responseData = await categoryResponse.json();
        const newCategory = responseData.getCategories; // Assuming backend sends the updated list of categories in response

        setCategories(newCategory);
        setCategory(""); // Clear input field after adding category
        setImageFile(null); // Clear image file after adding category
        setMessage("Category added successfully");
      } catch (error) {
        console.error("Error adding category:", error);
        setMessage("Error adding category");
      }
    } else {
      setMessage("Please fill in the category name and select an image.");
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/removeCategory/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove category");
      }

      // Remove the category from the state
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat._id !== categoryId)
      );
      setMessage("Category deleted successfully");
    } catch (error) {
      console.error("Error removing category:", error);
      setMessage(error.message || "Error removing category");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Display any success or error messages (optional) */}
      {message && <div className="alert alert-info">{message}</div>}

      <main className="row flex-grow-1 overflow-auto py-4">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">Add Category</div>
            <div className="card-body">
              <form onSubmit={handleAddCategory}>
                {/* Category input field with validation (implement using JavaScript) */}
                <div className="mb-3">
                  <label htmlFor="categoryInput" className="form-label">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryInput"
                    value={category}
                    onChange={handleCategoryChange}
                    required
                  />
                </div>

                {/* File upload field */}
                <div className="mb-3">
                  <label htmlFor="categoryImage" className="form-label">
                    Category Image (Optional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="categoryImage"
                    onChange={handleImageChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={category.trim() === ""}
                >
                  Add Category
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-header">Categories</div>
            <ul className="list-group list-group-flush">
              {/* Category list with icons and remove buttons */}
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{cat.category}</strong>
                    <br />
                    <img
                      src={cat.image}
                      alt={cat.category}
                      style={{ maxWidth: "50px" }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveCategory(cat._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
