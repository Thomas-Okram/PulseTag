import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { QRCodeCanvas as QRCode } from "qrcode.react";

// API base URL
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:7000"
    : "https://pulsetag-technologies.onrender.com";

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Utility actions
  const makeAdmin = async (id) => performUserAction(id, "make-admin");
  const deactivateUser = async (id) => performUserAction(id, "deactivate");
  const deleteUser = async (id) => performUserAction(id, "delete");
  const impersonateUser = async (id) => performUserAction(id, "impersonate");

  const performUserAction = async (id, action) => {
    const endpoints = {
      "make-admin": `/api/admin/users/${id}/make-admin`,
      deactivate: `/api/admin/users/${id}/deactivate`,
      delete: `/api/admin/users/${id}`,
      impersonate: `/api/admin/users/${id}/impersonate`,
    };

    try {
      const method = action === "delete" ? "delete" : "put";
      await axios[method](
        `${API_BASE_URL}${endpoints[action]}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (action === "impersonate") {
        alert("You are now impersonating this user!");
        window.location.reload();
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
    }
  };

  // Generate and download QR code
  const downloadQRCode = (id) => {
    const qrCanvas = document.getElementById(`qr-code-${id}`);
    if (!qrCanvas) return;

    const qrUrl = qrCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `User_${id}_QRCode.png`;
    link.click();
  };

  return (
    <div className="min-h-screen p-10 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-lg text-white"
        >
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 w-full mb-4 border border-gray-700 rounded-lg text-black bg-white z-10 relative"
      />

      {loading ? (
        <p className="text-white">Loading users...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Profile Link</th>
              <th className="p-3">QR Code</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter((u) =>
                  u.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((u, index) => (
                  <tr key={u._id} className="border-b border-gray-700">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md ${
                          u.status === "active"
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <a
                        href={`${API_BASE_URL}/profile/${u._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View Profile
                      </a>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col items-center">
                        <QRCode
                          id={`qr-code-${u._id}`}
                          value={`${API_BASE_URL}/profile/${u._id}`}
                          size={50}
                          level="H"
                          includeMargin={true}
                        />
                        <button
                          onClick={() => downloadQRCode(u._id)}
                          className="mt-2 bg-purple-600 px-2 py-1 text-sm rounded-lg"
                        >
                          Download QR
                        </button>
                      </div>
                    </td>
                    <td className="p-3 flex flex-wrap gap-2 relative z-10">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => makeAdmin(u._id)}
                          className="bg-blue-600 px-3 py-1 rounded-lg relative z-20"
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        onClick={() => deactivateUser(u._id)}
                        className="bg-yellow-600 px-3 py-1 rounded-lg relative z-20"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-600 px-3 py-1 rounded-lg relative z-20"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => impersonateUser(u._id)}
                        className="bg-indigo-600 px-3 py-1 rounded-lg relative z-20"
                      >
                        Impersonate
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-300">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
