"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface TestResultProps {
  symbol: string;
  actualValue: number;
  predictedValue: number;
  match: boolean;
}

const TestResult: FC<TestResultProps> = ({ symbol, actualValue, predictedValue, match }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg shadow-lg ${match ? "bg-green-100" : "bg-red-100"}`}
    >
      <h2 className="text-2xl font-semibold text-[#3E2723] mb-4">Resultado do Teste</h2>
      <p className="text-lg mb-2">
        <strong>Ação:</strong> {symbol}
      </p>
      <p className="text-lg mb-2">
        <strong>Valor Real:</strong> R${actualValue.toFixed(2)}
      </p>
      <p className="text-lg mb-2">
        <strong>Valor Previsto:</strong> R${predictedValue.toFixed(2)}
      </p>
      <p className="text-lg font-bold mt-4">
        {match ? "Os valores correspondem ou estão próximos!" : "Os valores não correspondem."}
      </p>
    </motion.div>
  );
};

export default TestResult;
