import { useState, useEffect } from "react";
import axios from "../service/api"; // your axios instance

export default function News() {
  const [formData, setFormData] = useState({
    news_name: "",
    description: "",
    date: "",
    image: null,
  });

  const [newsList, setNewsList] = useState([]);
  const [editId, setEditId] = useState(null);

  const endpoint = "news/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(endpoint);
      setNewsList(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("news_name", formData.news_name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("date", formData.date);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editId) {
        await axios.put(`${endpoint}${editId}/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("News updated!");
      } else {
        await axios.post(endpoint, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("News added!");
      }

      setFormData({
        news_name: "",
        description: "",
        date: "",
        image: null,
      });
      setEditId(null);
      fetchNews();
    } catch (error) {
      alert(
        "Failed to submit: " +
          (error.response?.data
            ? JSON.stringify(error.response.data)
            : error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;

    try {
      await axios.delete(`${endpoint}${id}/`);
      alert("Deleted successfully!");
      fetchNews();
    } catch (error) {
      alert(
        "Error deleting: " +
          (error.response?.data
            ? JSON.stringify(error.response.data)
            : error.message)
      );
    }
  };

  const handleEdit = (item) => {
    setFormData({
      news_name: item.news_name,
      description: item.description,
      date: item.date,
      image: null,
    });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setFormData({
      news_name: "",
      description: "",
      date: "",
      image: null,
    });
    setEditId(null);
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Left side: form */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-6">
          {editId ? "Edit News" : "Add News"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6"
          encType="multipart/form-data"
        >
          {/* News Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">News Title</label>
            <input
              type="text"
              name="news_name"
              value={formData.news_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows="4"
              required
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {editId ? "Change Image (optional)" : "Image"}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required={!editId}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editId ? "Update" : "Submit"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right side: list */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-6">News Items</h2>
        <div className="space-y-4">
          {newsList.length === 0 ? (
            <p className="text-gray-500">No news available.</p>
          ) : (
            newsList.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 bg-white shadow rounded p-4"
              >
                {/* Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.news_name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.news_name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-400">📅 {item.date}</p>

                  {/* Actions */}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
