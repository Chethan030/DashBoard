import { useEffect, useState } from "react";

export default function EventGallery() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    image: null,
  });

  const host_url = "http://127.0.0.1:8000/";

  const fetchEvents = async () => {
    try {
      const res = await fetch(host_url + "gallery/gurukulam/");
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : [data]);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching event gallery:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("date", formData.date);
    data.append("images", formData.image);

    try {
      const res = await fetch(host_url + "gallery/gurukulam/", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Event image uploaded!");
        setFormData({ date: "", image: null });
        fetchEvents();
      } else {
        const error = await res.json();
        alert("Upload failed: " + JSON.stringify(error));
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await fetch(host_url + `gallery/gurukulam/${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Deleted!");
        fetchEvents();
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      alert("Delete error: " + err.message);
    }
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
      {/* Left: Upload Form */}
      <div className="md:w-1/2 w-full">
        <h2 className="text-2xl font-semibold mb-6">Upload Event Image</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6"
          encType="multipart/form-data"
        >
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
              required
              className="w-full"
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

      {/* Right: Gallery Grid */}
      <div className="md:w-1/2 w-full">
        <h2 className="text-2xl font-semibold mb-6">Event Gallery</h2>

        {events.length === 0 ? (
          <p className="text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((event) =>
              event.images ? (
                <div
                  key={event.id}
                  className="bg-white shadow rounded overflow-hidden relative group"
                >
                  <img
                    src={event.images}
                    alt="Event"
                    className="w-full h-48 object-cover group-hover:opacity-90 transition duration-200"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      📅 {event.date || "No date"}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(event.id)}
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
