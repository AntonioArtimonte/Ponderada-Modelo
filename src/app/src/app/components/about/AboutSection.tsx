"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface AboutSectionProps {
  content: string;
}

const AboutSection: FC<AboutSectionProps> = ({ content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#FAF3E0] p-4 rounded-lg shadow-lg mb-4"
    >
      <p className="text-lg text-[#3E2723]">{content}</p>
    </motion.div>
  );
};

export default AboutSection;
