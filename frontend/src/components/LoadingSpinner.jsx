import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white/20 backdrop-blur-2xl flex items-center justify-center relative overflow-hidden border border-white/30 shadow-lg">
      {/* Glassmorphic Loading Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-t-purple-400 border-white/40 rounded-full shadow-xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
