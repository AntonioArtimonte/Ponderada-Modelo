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
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log(apiUrl)

  const fetchStockData = async (stock: string) => {
    try {
      setError(null); // Reset error state
      const response = await fetch(`${apiUrl}/api/predict?crypto=${stock}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();

      const predictions = data.prediction;
      if (!Array.isArray(predictions) || predictions.length === 0) {
        throw new Error("Invalid predictions data");
      }

      const weeklyAverage =
        predictions.slice(-7).reduce((sum: number, value: number) => sum + value, 0) / 7;

      const dailyClose = predictions[predictions.length - 1];

      setStockData({
        stock: stock,
        dailyClose: dailyClose,
        weeklyAverage: weeklyAverage,
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("An error occurred while fetching stock data.");
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
      {error && <p className="text-red-500">{error}</p>}
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
