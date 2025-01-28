import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import FloatingShape from "../components/FloatingShape";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-700 to-pink-600 overflow-hidden">
      {/* Floating Animations */}
      <FloatingShape
        color="bg-pink-400"
        size="w-32 h-32"
        top="10%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-blue-400"
        size="w-40 h-40"
        top="50%"
        left="80%"
        delay={1}
      />
      <FloatingShape
        color="bg-purple-400"
        size="w-28 h-28"
        top="80%"
        left="30%"
        delay={2}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full mx-auto p-8 bg-white/10 backdrop-filter backdrop-blur-3xl rounded-2xl shadow-xl border border-white/20"
      >
        <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-transparent bg-clip-text">
          Welcome to Your Dashboard
        </h2>

        <div className="space-y-8">
          {/* Profile Information */}
          <motion.div
            className="p-6 bg-white/10 rounded-2xl border border-white/20 shadow-lg backdrop-filter backdrop-blur-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-4">
              Profile Information
            </h3>
            <p className="text-white text-lg">Name: {user.name}</p>
            <p className="text-white text-lg">Email: {user.email}</p>
          </motion.div>

          {/* Account Activity */}
          <motion.div
            className="p-6 bg-white/10 rounded-2xl border border-white/20 shadow-lg backdrop-filter backdrop-blur-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Account Activity
            </h3>
            <p className="text-white text-lg">
              <span className="font-bold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-white text-lg">
              <span className="font-bold">Last Login:</span>{" "}
              {formatDate(user.lastLogin)}
            </p>
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#9333ea" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full py-4 px-6 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white font-bold rounded-full shadow-xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2"
          >
            Logout
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
