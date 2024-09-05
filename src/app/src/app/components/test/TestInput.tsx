"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";

interface TestInputProps {
  onTest: (symbol: string) => void;
}

const TestInput: FC<TestInputProps> = ({ onTest }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onTest(inputValue.trim().toUpperCase());
      setInputValue("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <label htmlFor="stock-input" className="block text-lg font-medium text-[#3E2723]">
        Insira o símbolo da Ação:
      </label>
      <input
        id="stock-input"
        type="text"
        className="mt-2 p-2 border rounded-lg w-full"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-[#3E2723] text-white px-4 py-2 rounded-lg"
        onClick={handleSubmit}
        style={{backgroundColor: '#3E2723'}}
      >
        Testar
      </motion.button>
    </motion.div>
  );
};

export default TestInput;
