"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StockSelector from "./StockSelector";
import StockChart from "./StockChart";
import StockDetails from "./StockDetails";

interface StockData {
  stock: string;
  dailyClose: number;
  weeklyAverage: number;
}

const Dashboard = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);

  const fetchStockData = async (stock: string) => {
    try {
      const response = await fetch(`http://localhost:9000/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crypto: stock }), 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();

      const predictions = data.prediction;

      const weeklyAverage =
        predictions.reduce((sum: number, value: number) => sum + value, 0) / 7;

      const dailyClose = predictions[predictions.length - 1];

      setStockData({
        stock: stock,
        dailyClose: dailyClose,
        weeklyAverage: weeklyAverage,
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handleStockChange = (stock: string) => {
    setSelectedStock(stock);
    fetchStockData(stock);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-screen-lg mx-auto p-4"
    >
      <h1 className="text-3xl font-playfair text-[#3E2723] mb-6">
        Dashboard de Ações
      </h1>
      <StockSelector onChange={handleStockChange} />
      {selectedStock && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StockChart stock={selectedStock} />
          {stockData && (
            <StockDetails
              dailyClose={stockData.dailyClose}
              weeklyAverage={stockData.weeklyAverage}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
