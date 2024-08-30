"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StockSelector from "./StockSelector";
import StockChart from "./StockChart";
import StockDetails from "./StockDetails";

const Dashboard = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [stockData, setStockData] = useState<any>(null);

  // Mock data fetching function
  const fetchStockData = (stock: string) => {
    const data = {
      stock: stock,
      dailyClose: 150,
      weeklyAverage: 145,
      monthlyAverage: 140,
      yearlyAverage: 130,
      history: [
        { date: "2024-01-01", close: 145 },
        { date: "2024-01-02", close: 150 },
        { date: "2024-01-03", close: 148 },
      ],
    };

    setStockData(data);
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
      <h1 className="text-3xl font-playfair text-[#3E2723] mb-6">Dashboard de Ações</h1>
      <StockSelector onChange={handleStockChange} />
      {stockData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StockChart history={stockData.history} />
          <StockDetails
            dailyClose={stockData.dailyClose}
            weeklyAverage={stockData.weeklyAverage}
            monthlyAverage={stockData.monthlyAverage}
            yearlyAverage={stockData.yearlyAverage}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
