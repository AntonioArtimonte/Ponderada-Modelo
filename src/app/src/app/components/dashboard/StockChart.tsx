"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface PredictionData {
  date: string;
  close: number;
}

interface StockChartProps {
  stock: string | null; 
}

const StockChart: FC<StockChartProps> = ({ stock }) => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!stock) return; 

    const fetchPredictions = async (stock: string) => {
      try {
        const response = await fetch(`${apiUrl}/api/predict?crypto=${stock}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (!data.prediction || !Array.isArray(data.prediction)) {
          throw new Error("Invalid prediction data received from the backend.");
        }

        const processedData: PredictionData[] = data.prediction.map((price: number, index: number) => {
          const date = new Date(); 
          date.setDate(date.getDate() + index); 

          return {
            date: date.toLocaleDateString("en-US"), 
            close: Math.floor(price), 
          };
        });

        setPredictions(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
        setPredictions([]); 
        setLoading(false);
      }
    };

    fetchPredictions(stock);
  }, [stock, apiUrl]); 

  // Calculate min and max prices with dynamic padding
  const calculateYAxisDomain = (data: PredictionData[]) => {
    if (data.length === 0) {
      // Default Y-axis domain if no data is available
      return [0, 100];
    }

    const prices = data.map(p => p.close);
    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);

    const range = maxPrice - minPrice;
    let padding = range * 0.1;

    if (range === 0) {
      
      padding = maxPrice * 0.1 || 10; 
    }

    minPrice = minPrice - padding > 0 ? minPrice - padding : 0;
    maxPrice = maxPrice + padding;

    return [minPrice, maxPrice];
  };

  const yAxisDomain = calculateYAxisDomain(predictions);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center my-6"
      >
        <p>Loading...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-lg mb-6"
    >
      <h2 className="text-xl font-semibold text-[#3E2723] mb-4">
        Previsão de Preços - {predictions.length > 0 && stock}
      </h2>
      {predictions.length === 0 ? (
        <p className="text-[#5A473D]">Nenhuma previsão disponível para esta criptomoeda.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictions}>
            <XAxis dataKey="date" />
            <YAxis domain={yAxisDomain} />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="close" stroke="#3E2723" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default StockChart;
