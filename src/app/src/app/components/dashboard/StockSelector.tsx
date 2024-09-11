"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StockSelectorProps {
  onChange: (stock: string) => void;
}

interface StockData {
  stock: string;
  trained: number;
}

const StockSelector: FC<StockSelectorProps> = ({ onChange }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/cryptos");
        const data = await response.json();
        
        const transformedData: StockData[] = Object.keys(data.cryptos).map((key) => ({
          stock: key,
          trained: data.cryptos[key]
        }));
        
        setStocks(transformedData);
      } catch (error) {
        console.error("Failed to fetch stocks:", error);
      }
    };

    fetchStocks();
  }, []);

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
        {stocks.map((stockData) => (
          <option
            key={stockData.stock}
            value={stockData.stock}
            disabled={stockData.trained === 0}
            className={stockData.trained === 0 ? "text-gray-400" : "text-black"}
          >
            {stockData.stock}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default StockSelector;
