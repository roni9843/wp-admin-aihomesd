import { useState } from "react";

const ImageUpload = () => {
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", file);
        console.log("FormData prepared with file:", file.name);
    
        try {
            const res = await fetch("https://backend.aihomesd.com/upload", {
                method: "POST",
                body: formData,
            });
    
            const data = await res.json();
            console.log("Server Response:", data);
    
            if (!res.ok) {
                throw new Error(data.error || "Failed to upload");
            }
    
            setImageUrl(data.imageUrl);
            setError(null);
        } catch (error) {
            console.error("Upload failed:", error);
            setError(error.message);
        }
    };
    
    
    
    
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />}
        </div>
    );
};

export default ImageUpload;