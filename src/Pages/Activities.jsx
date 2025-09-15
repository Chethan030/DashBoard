import { useState, useEffect } from "react";

export default function Activities() {
  const [formData, setFormData] = useState({
    title: "",
    des: "",
    image: null,
  });

  const [activities, setActivities] = useState([]);
  const [editId, setEditId] = useState(null); // 🔁 New state to track if editing

  const host_url = "http://127.0.0.1:8000/";

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Fetch Gurukulam
  const fetchGurukulam = async () => {
    try {
      const response = await fetch(host_url + "gukulam_activities/");
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchGurukulam();
    fetchAdrishya();
  }, []);

  // Handle form inputs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setForm({ ...form, image: e.target.files[0] });

  const resetForm = () => {
    setForm({ title: "", des: "", image: null });
    setEditId(null);
  };

  // Submit (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("des", formData.des);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    const url = host_url + "gukulam_activities/" + (editId ? `${editId}/` : "");

    try {
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST", // 🔁 Use PUT when editing
        body: formDataToSend,
      });

      if (response.ok) {
        alert(editId ? "Activity updated!" : "Activity added!");
        setFormData({ title: "", des: "", image: null });
        setEditId(null); // 🔁 Reset edit mode
        fetchActivities();
      } else {
        const error = await response.json();
        alert("Error: " + JSON.stringify(error));
      }
    } catch (error) {
      alert("Failed to submit: " + error.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const response = await fetch(host_url + `gukulam_activities/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Deleted successfully!");
        fetchActivities();
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  // Edit
  const handleEdit = (activity) => {
    setFormData({
      title: activity.title,
      des: activity.des,
      image: null, // File can't be prefilled in input
    });
    setEditId(activity.id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // optional
  };

  // Cancel Edit
  const cancelEdit = () => {
    setFormData({ title: "", des: "", image: null });
    setEditId(null);
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Left side: form */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-6">
          {editId ? "Edit Activity" : "Add Gurukulam Activity"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6"
          encType="multipart/form-data"
        >
          {/* Title */}
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

          {/* Description */}
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

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              // Only required when adding
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
                {/* Image */}
                {act.image && (
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{act.title}</h3>
                  <p className="text-gray-600">{act.des}</p>

                  {/* Actions */}
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
