"use client";

import { FC } from "react";
import { motion } from "framer-motion";

const LoadingIndicator: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center mt-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="inline-block"
      >
        <span className="text-3xl font-bold text-[#3E2723]">⏳</span>
      </motion.div>
      <p className="mt-2 text-lg text-[#3E2723]">Executando teste...</p>
    </motion.div>
  );
};

export default LoadingIndicator;
