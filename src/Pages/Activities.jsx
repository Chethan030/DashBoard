import { useState, useEffect } from "react";

export default function Activities() {
  const [formData, setFormData] = useState({
    title: "",
    des: "",
    image: null,
  });

  const [activities, setActivities] = useState([]);

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Fetch existing activities
  const fetchActivities = async () => {
    try {
      const response = await fetch(
        "https://vande-mataram-2.onrender.com/gukulam_activities/"
      );
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = "https://vande-mataram-2.onrender.com/gukulam_activities/";

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("des", formData.des);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Gurukulam Activity added successfully!");
        setFormData({ title: "", des: "", image: null });
        fetchActivities(); // refresh list
      } else {
        const error = await response.json();
        alert("Error: " + JSON.stringify(error));
      }
    } catch (error) {
      alert("Failed to submit: " + error.message);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    const url = `https://vande-mataram-2.onrender.com/gukulam_activities/${id}/`;
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const response = await fetch(url, { method: "DELETE" });
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

  return (
    <div className="p-6 flex gap-6">
      {/* Left side: form */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-6">Add Gurukulam Activity</h2>

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
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
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
                      onClick={() => alert("Edit feature coming soon!")}
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
