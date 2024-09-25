"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Define the shape of the prediction data
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

  useEffect(() => {
    if (!stock) return; 

    const fetchPredictions = async (stock: string) => {
      try {
        const response = await fetch(`http://localhost:9000/api/predict?crypto=${stock}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();


        const processedData: PredictionData[] = data.prediction.map((price: number, index: number) => {
          const date = new Date(); 
          date.setDate(date.getDate() + index); 

          return {
            date: date.toLocaleDateString("en-US"), 
            close: price,
          };
        });

        setPredictions(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
        setLoading(false);
      }
    };

    fetchPredictions(stock);
  }, [stock]); 

  const minPrice = Math.min(...predictions.map(p => p.close))
  const maxPrice = Math.max(...predictions.map(p => p.close))

  const yAxisDomain = [minPrice - 100, maxPrice + 100];

  if (loading) {
    return <p>Loading...</p>;
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={predictions}>
          <XAxis dataKey="date" />
          <YAxis domain={yAxisDomain}/>
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="close" stroke="#3E2723" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default StockChart;
