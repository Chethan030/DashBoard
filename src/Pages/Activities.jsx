import { useState, useEffect } from "react";
import api from "../service/api"; // your custom axios instance

export default function ActivitiesDashboard() {
  const [tab, setTab] = useState("gurukulam"); // gurukulam | adrishya
  const [gurukulamData, setGurukulamData] = useState([]);
  const [adrishyaData, setAdrishyaData] = useState([]);
  const [form, setForm] = useState({ title: "", des: "", image: null });
  const [editId, setEditId] = useState(null);
  const [uploadImage, setUploadImage] = useState(null); // for 3rd API upload
  const [uploadTarget, setUploadTarget] = useState(null); // activity ID

  // Endpoints
  const endpoints = {
    gurukulam: "gurukulam/activities/",
    adrishya: "adrishya/activities/",
    adrishyaImage: "adrishya/image/",
  };

  // Fetch Gurukulam
  const fetchGurukulam = async () => {
    try {
      const res = await api.get(endpoints.gurukulam);
      setGurukulamData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Adrishya
  const fetchAdrishya = async () => {
    try {
      const res = await api.get(endpoints.adrishya);
      setAdrishyaData(res.data);
    } catch (err) {
      console.error(err);
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
    try {
      if (tab === "gurukulam") {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("des", form.des);
        if (form.image) formData.append("image", form.image);

        if (editId) {
          await api.put(`${endpoints.gurukulam}${editId}/`, formData);
          alert("Gurukulam updated");
        } else {
          await api.post(endpoints.gurukulam, formData);
          alert("Gurukulam created");
        }
        fetchGurukulam();
      } else if (tab === "adrishya") {
        const payload = { title: form.title, des: form.des };

        if (editId) {
          await api.put(`${endpoints.adrishya}${editId}/`, payload, {
            headers: { "Content-Type": "application/json" },
          });
          alert("Adrishya updated");
        } else {
          await api.post(endpoints.adrishya, payload, {
            headers: { "Content-Type": "application/json" },
          });
          alert("Adrishya created");
        }
        fetchAdrishya();
      }
      resetForm();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error: " + JSON.stringify(err.response?.data));
    }
  };

  // Edit
  const handleEdit = (activity) => {
    setForm({ title: activity.title, des: activity.des, image: null });
    setEditId(activity.id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const endpoint = tab === "gurukulam" ? endpoints.gurukulam : endpoints.adrishya;
      await api.delete(`${endpoint}${id}/`);
      alert("Deleted successfully");
      tab === "gurukulam" ? fetchGurukulam() : fetchAdrishya();
    } catch (err) {
      console.error(err);
    }
  };

  // Upload Image for Adrishya (3rd API)
  const handleImageUpload = async (e, activityId) => {
    e.preventDefault();
    if (!uploadImage) {
      alert("Select an image first");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("adrishya", activityId); // FK id
      formData.append("images", uploadImage);

      await api.post(endpoints.adrishyaImage, formData);
      alert("Image uploaded");
      setUploadImage(null);
      setUploadTarget(null);
      fetchAdrishya(); // refresh
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Upload error: " + JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => { setTab("gurukulam"); resetForm(); }}
          className={`px-4 py-2 rounded ${tab === "gurukulam" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Gurukulam
        </button>
        <button
          onClick={() => { setTab("adrishya"); resetForm(); }}
          className={`px-4 py-2 rounded ${tab === "adrishya" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Adrishya
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded shadow">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter title"
          className="border p-2 w-full"
          required
        />
        <textarea
          name="des"
          value={form.des}
          onChange={handleChange}
          placeholder="Enter description"
          className="border p-2 w-full"
          required
        />
        {tab === "gurukulam" && (
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        )}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {editId ? "Update" : "Create"}
        </button>
      </form>

      {/* List */}
      {tab === "gurukulam" && (
        <div>
          <h2 className="text-lg font-bold mb-3">Gurukulam Activities</h2>
          <ul className="space-y-4">
            {gurukulamData.map((act) => (
              <li key={act.id} className="border p-3 rounded shadow">
                <h3 className="font-semibold">{act.title}</h3>
                <p>{act.des}</p>
                {act.image && <img src={act.image} alt="upload" className="w-32 mt-2" />}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(act)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(act.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "adrishya" && (
        <div>
          <h2 className="text-lg font-bold mb-3">Adrishya Activities</h2>
          <ul className="space-y-4">
            {adrishyaData.map((act) => (
              <li key={act.id} className="border p-3 rounded shadow">
                <h3 className="font-semibold">{act.title}</h3>
                <p>{act.des}</p>

                {/* Show images */}
                {act.image && act.image.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {act.image.map((img, i) => (
                      <img key={i} src={img} alt="upload" className="w-24 h-24 object-cover border" />
                    ))}
                  </div>
                )}

                {/* Upload new image */}
                {uploadTarget === act.id ? (
                  <form onSubmit={(e) => handleImageUpload(e, act.id)} className="mt-2 flex gap-2">
                    <input
                      type="file"
                      onChange={(e) => setUploadImage(e.target.files[0])}
                      className="border p-2"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Upload</button>
                  </form>
                ) : (
                  <button
                    onClick={() => setUploadTarget(act.id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded mt-2"
                  >
                    Add Image
                  </button>
                )}

                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(act)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(act.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}