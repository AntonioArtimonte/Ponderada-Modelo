"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StockSelector from "./StockSelector";
import StockChart from "./StockChart";
import StockDetails from "./StockDetails";

// Define the type for stock data
interface StockData {
  stock: string;
  dailyClose: number;
  weeklyAverage: number;
}

const Dashboard = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);

  // Function to fetch prediction data from the API and calculate dailyClose and weeklyAverage
  const fetchStockData = async (stock: string) => {
    try {
      const response = await fetch(`http://localhost:9000/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crypto: stock }), // Send the stock symbol as the body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();

      // Extract the prediction data from the response
      const predictions = data.prediction;

      // Calculate the weekly average by summing up the values and dividing by 7
      const weeklyAverage =
        predictions.reduce((sum: number, value: number) => sum + value, 0) / 7;

      // Set the dailyClose as the last predicted value
      const dailyClose = predictions[predictions.length - 1];

      // Update the stockData state with the new values
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
    fetchStockData(stock); // Fetch stock data when a stock is selected
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
          <StockChart stock={selectedStock} /> {/* Pass the selected stock to StockChart */}
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
