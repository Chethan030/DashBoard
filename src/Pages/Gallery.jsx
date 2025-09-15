import { useState, useEffect } from "react";
import axios from '../service/api'; // Make sure baseURL is configured here

export default function GalleryToggle() {
  const [galleryType, setGalleryType] = useState("gurukulam"); // "gurukulam" | "adrishya"
  const [formData, setFormData] = useState({ date: "", image: null });
  const [images, setImages] = useState([]);

  const endpoint = `gallery/${galleryType}/`;

  // GET
  const fetchGallery = async () => {
    try {
      const res = await axios.get(endpoint);
      const data = res.data;
      setImages(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
    setFormData({ date: "", image: null }); // Reset form when toggling
  }, [galleryType]);

  // FORM
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, image: e.target.files[0] });

  // POST
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("date", formData.date);
    form.append(galleryType === "gurukulam" ? "images" : "image", formData.image);

    try {
      await axios.post(endpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Image uploaded!");
      setFormData({ date: "", image: null });
      fetchGallery();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + (err.response?.data?.detail || err.message));
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this image?")) return;
    try {
      await axios.delete(`${endpoint}${id}/`);
      alert("Deleted!");
      fetchGallery();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          className={`px-4 py-2 rounded ${
            galleryType === "gurukulam"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setGalleryType("gurukulam")}
        >
          Gurukulam Gallery
        </button>
        <button
          className={`px-4 py-2 rounded ${
            galleryType === "adrishya"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setGalleryType("adrishya")}
        >
          Adrishya Gallery
        </button>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Upload to {galleryType === "gurukulam" ? "Gurukulam" : "Adrishya"} Gallery
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          {galleryType === "gurukulam" ? "Gurukulam" : "Adrishya"} Gallery
        </h2>
        {images.length === 0 ? (
          <p className="text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) =>
              img.image || img.images ? (
                <div
                  key={img.id}
                  className="bg-white shadow rounded overflow-hidden relative group"
                >
                  <img
                    src={img.image || img.images}
                    alt="Gallery"
                    className="w-full h-64 object-cover group-hover:opacity-90 transition duration-200"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      📅 {img.date || "N/A"}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
