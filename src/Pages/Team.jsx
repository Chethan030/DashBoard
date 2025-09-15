import { useState, useEffect } from "react";

export default function Team() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    des: "",
    image: null,
  });

  const [team, setTeam] = useState([]);
  const [editId, setEditId] = useState(null);

  const host_url = "http://127.0.0.1:8000/";

  const fetchTeam = async () => {
    try {
      const response = await fetch(host_url + "team/");
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (err) {
      console.error("Error fetching team:", err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("designation", formData.designation);
    dataToSend.append("des", formData.des);
    if (formData.image) {
      dataToSend.append("image", formData.image);
    }

    const url = host_url + "team/" + (editId ? `${editId}/` : "");

    try {
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        body: dataToSend,
      });

      if (response.ok) {
        alert(editId ? "Team member updated!" : "Team member added!");
        setFormData({
          name: "",
          designation: "",
          des: "",
          image: null,
        });
        setEditId(null);
        fetchTeam();
      } else {
        const error = await response.json();
        alert("Error: " + JSON.stringify(error));
      }
    } catch (err) {
      alert("Failed to submit: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await fetch(host_url + `team/${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Deleted successfully!");
        fetchTeam();
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      alert("Delete error: " + err.message);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      designation: member.designation,
      des: member.des,
      image: null,
    });
    setEditId(member.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setFormData({
      name: "",
      designation: "",
      des: "",
      image: null,
    });
    setEditId(null);
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
      {/* Left: Form */}
      <div className="md:w-1/2 w-full">
        <h2 className="text-2xl font-semibold mb-6">
          {editId ? "Edit Team Member" : "Add Team Member"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6"
          encType="multipart/form-data"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="des"
              value={formData.des}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows="3"
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

      {/* Right: Team Members */}
      <div className="md:w-1/2 w-full">
        <h2 className="text-2xl font-semibold mb-6">Team Members</h2>

        {team.length === 0 ? (
          <p className="text-gray-500">No team members added.</p>
        ) : (
          <div className="space-y-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-start gap-4 bg-white shadow rounded p-4"
              >
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {member.designation}
                  </p>
                  <p className="text-gray-700 mt-1">{member.des}</p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
