import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { motion } from "framer-motion";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://pulsetagapp.com";
console.log("🔹 API Base URL:", API_BASE_URL);

const ManageUsersPage = () => {
  const { user, logout } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const performUserAction = async (id, action) => {
    const endpoints = {
      "make-admin": `/api/admin/users/${id}/make-admin`,
      "dismiss-admin": `/api/admin/users/${id}/dismiss-admin`,
      activate: `/api/admin/users/${id}/activate`,
      deactivate: `/api/admin/users/${id}/deactivate`,
      delete: `/api/admin/users/${id}`,
    };

    try {
      let method = action === "delete" ? "delete" : "put";
      const response = await axios({
        method,
        url: `${API_BASE_URL}${endpoints[action]}`,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id
            ? { ...u, isActive: action === "activate" ? true : false }
            : u
        )
      );
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
      alert(`Error: ${error.response?.data?.message || "An error occurred"}`);
    }
  };

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
    <div className="w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/10 p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-all shadow-md"
          >
            Logout
          </button>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 w-full mb-6 border border-gray-500/40 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300"
        />

        {loading ? (
          <p className="text-center text-white">Loading users...</p>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700/40">
                    <th className="p-3 text-gray-300">#</th>
                    <th className="p-3 text-gray-300">Name</th>
                    <th className="p-3 text-gray-300">Email</th>
                    <th className="p-3 text-gray-300">Role</th>
                    <th className="p-3 text-gray-300">Status</th>
                    <th className="p-3 text-gray-300">Profile Link</th>
                    <th className="p-3 text-gray-300">QR Code</th>
                    <th className="p-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-700/20 hover:bg-white/5 transition-all"
                    >
                      <td className="p-3 text-white">{index + 1}</td>
                      <td className="p-3 text-white">{u.name}</td>
                      <td className="p-3 text-white">{u.email}</td>
                      <td className="p-3 text-white">{u.role}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-md ${
                            u.isActive
                              ? "bg-green-500/70 text-white"
                              : "bg-gray-500/70 text-white"
                          }`}
                        >
                          {u.isActive ? "Active" : "Deactivated"}
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
                          />
                          <button
                            onClick={() => downloadQRCode(u._id)}
                            className="mt-2 bg-purple-500/80 text-white px-3 py-1 text-sm rounded-lg hover:bg-purple-600 transition-all"
                          >
                            Download QR
                          </button>
                        </div>
                      </td>
                      <td className="p-3 flex flex-wrap gap-2">
                        {u.role === "admin" ? (
                          <button
                            onClick={() =>
                              performUserAction(u._id, "dismiss-admin")
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:scale-105 transition-all hover:bg-red-700"
                          >
                            Dismiss Admin
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              performUserAction(u._id, "make-admin")
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:scale-105 transition-all hover:bg-blue-700"
                          >
                            Make Admin
                          </button>
                        )}

                        <button
                          onClick={() =>
                            performUserAction(
                              u._id,
                              u.isActive ? "deactivate" : "activate"
                            )
                          }
                          className={`px-3 py-1 rounded-lg shadow hover:scale-105 transition-all ${
                            u.isActive
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => performUserAction(u._id, "delete")}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:scale-105 transition-all hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
              {users.map((u, index) => (
                <div
                  key={u._id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <p className="text-gray-200">
                    <strong>#:</strong> {index + 1}
                  </p>
                  <p className="text-gray-200">
                    <strong>Name:</strong> {u.name}
                  </p>
                  <p className="text-gray-200">
                    <strong>Email:</strong> {u.email}
                  </p>
                  <p className="text-gray-200">
                    <strong>Role:</strong> {u.role}
                  </p>
                  <p className="text-gray-200">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-md ${
                        u.isActive
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-col items-center">
                    <QRCode
                      id={`qr-code-${u._id}`}
                      value={`${API_BASE_URL}/profile/${u._id}`}
                      size={100}
                    />
                    <button
                      onClick={() => downloadQRCode(u._id)}
                      className="mt-2 bg-purple-600 px-4 py-2 text-sm rounded-lg hover:bg-purple-700"
                    >
                      Download QR
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {u.role === "admin" ? (
                      <button
                        onClick={() =>
                          performUserAction(u._id, "dismiss-admin")
                        }
                        className="bg-red-600 px-4 py-2 rounded-lg"
                      >
                        Dismiss Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => performUserAction(u._id, "make-admin")}
                        className="bg-blue-600 px-4 py-2 rounded-lg"
                      >
                        Make Admin
                      </button>
                    )}

                    <button
                      onClick={() =>
                        performUserAction(
                          u._id,
                          u.isActive ? "deactivate" : "activate"
                        )
                      }
                      className={`px-4 py-2 rounded-lg ${
                        u.isActive ? "bg-yellow-600" : "bg-green-600"
                      }`}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => performUserAction(u._id, "delete")}
                      className="bg-red-600 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageUsersPage;
