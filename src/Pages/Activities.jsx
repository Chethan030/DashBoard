import { useState, useEffect } from "react";
import axios from "../service/api"; // Custom Axios instance

export default function Activities() {
  const [formData, setFormData] = useState({
    title: "",
    des: "",
    image: null,
  });

  const [activities, setActivities] = useState([]);
  const [editId, setEditId] = useState(null);

  const endpoint = "gukulam_activities/";

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const response = await axios.get(endpoint);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("des", formData.des);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editId) {
        await axios.put(`${endpoint}${editId}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Activity updated!");
      } else {
        await axios.post(endpoint, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Activity added!");
      }

      setFormData({ title: "", des: "", image: null });
      setEditId(null);
      fetchActivities();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit: " + (error.response?.data?.detail || error.message));
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      await axios.delete(`${endpoint}${id}/`);
      alert("Deleted successfully!");
      fetchActivities();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete.");
    }
  };

  // Edit
  const handleEdit = (activity) => {
    setFormData({
      title: activity.title,
      des: activity.des,
      image: null,
    });
    setEditId(activity.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setFormData({ title: "", des: "", image: null });
    setEditId(null);
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Left: Form */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-6">
          {editId ? "Edit Activity" : "Add Gurukulam Activity"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6"
          encType="multipart/form-data"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="des"
              value={formData.des}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required={!editId}
            />
          </div>

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

      {/* Right: List */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-6">Uploaded Activities</h2>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500">No activities available.</p>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-4 bg-white shadow rounded p-4"
              >
                {act.image && (
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{act.title}</h3>
                  <p className="text-gray-600">{act.des}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(act)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(act.id)}
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
