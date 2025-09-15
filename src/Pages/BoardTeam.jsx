import { useState, useEffect } from "react";
import axios from "../service/api"; // Your axios instance

export default function SteeringTeam() {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [members, setMembers] = useState([]);
  const [editId, setEditId] = useState(null);

  const endpoint = "steeringboard-team/";

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Fetch members
  const fetchMembers = async () => {
    try {
      const response = await axios.get(endpoint);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editId) {
        await axios.put(`${endpoint}${editId}/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Member updated!");
      } else {
        await axios.post(endpoint, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Member added!");
      }

      setFormData({ name: "", image: null });
      setEditId(null);
      fetchMembers();
    } catch (error) {
      alert("Failed to submit: " + (error.response?.data || error.message));
    }
  };

  // Delete member
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await axios.delete(`${endpoint}${id}/`);
      alert("Deleted successfully!");
      fetchMembers();
    } catch (error) {
      alert("Error deleting: " + (error.response?.data || error.message));
    }
  };

  // Edit member
  const handleEdit = (member) => {
    setFormData({ name: member.name, image: null });
    setEditId(member.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit
  const cancelEdit = () => {
    setFormData({ name: "", image: null });
    setEditId(null);
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Left side: form */}
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-6">
          {editId ? "Edit Member" : "Add Steering Board Member"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6"
          encType="multipart/form-data"
        >
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
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
        <h2 className="text-2xl font-semibold mb-6">Steering Team</h2>
        <div className="space-y-4">
          {members.length === 0 ? (
            <p className="text-gray-500">No team members available.</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-start gap-4 bg-white shadow rounded p-4"
              >
                {/* Image */}
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{member.name}</h3>

                  {/* Actions */}
                  <div className="mt-2 flex gap-2">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
