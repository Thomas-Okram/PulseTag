import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get reset token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://pulsetag-technologies.onrender.com/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while resetting the password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-700/30 backdrop-blur-lg backdrop-saturate-150 rounded-2xl shadow-2xl border border-gray-400 overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100 drop-shadow-md">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-700 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Set New Password"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
