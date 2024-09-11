"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface StockDetailsProps {
  dailyClose: number;
  weeklyAverage: number;
}

const StockDetails: FC<StockDetailsProps> = ({ dailyClose, weeklyAverage}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#FAF3E0] p-4 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-[#3E2723] mb-4">Detalhes do Fechamento</h2>
      <ul>
        <li className="mb-2">
          <strong>Fechamento do Dia: </strong> R${dailyClose.toFixed(2)}
        </li>
        <li className="mb-2">
          <strong>Média Semanal: </strong> R${weeklyAverage.toFixed(2)}
        </li>
      </ul>
    </motion.div>
  );
};

export default StockDetails;
