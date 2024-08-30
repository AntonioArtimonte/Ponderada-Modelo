"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface StockSelectorProps {
  onChange: (stock: string) => void;
}

const StockSelector: FC<StockSelectorProps> = ({ onChange }) => {
  const stocks = ["AAPL", "GOOGL", "AMZN", "MSFT"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <label htmlFor="stock-select" className="block text-lg font-medium text-[#3E2723]">
        Selecione uma Ação:
      </label>
      <select
        id="stock-select"
        className="mt-2 p-2 border rounded-lg w-full"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">--Selecione--</option>
        {stocks.map((stock) => (
          <option key={stock} value={stock}>
            {stock}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default StockSelector;
