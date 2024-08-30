"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface StockChartProps {
  history: { date: string; close: number }[];
}

const StockChart: FC<StockChartProps> = ({ history }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-lg mb-6"
    >
      <h2 className="text-xl font-semibold text-[#3E2723] mb-4">Histórico de Preços</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="close" stroke="#3E2723" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default StockChart;
