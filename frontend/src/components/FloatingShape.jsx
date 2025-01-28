import { motion } from "framer-motion";

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-30 backdrop-blur-3xl`}
      style={{ top, left }}
      animate={{
        y: ["-10%", "20%", "-10%"],
        x: ["-10%", "20%", "-10%"],
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 25,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
