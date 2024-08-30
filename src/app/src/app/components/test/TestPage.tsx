"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TestInput from "./TestInput";
import TestResult from "./TestResult";
import LoadingIndicator from "./LoadingIndicator";

const TestPage = () => {
  const [stockSymbol, setStockSymbol] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runTest = (symbol: string) => {
    setLoading(true);
    setStockSymbol(symbol);

    // Mock test logic for demonstration
    setTimeout(() => {
      const result = {
        symbol: symbol,
        actualValue: 150.25,
        predictedValue: 150.23,
        match: true,
      };
      setTestResult(result);
      setLoading(false);
    }, 2000); // Simulating a 2-second delay for AI processing
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-screen-lg mx-auto p-4"
    >
      <h1 className="text-3xl font-playfair text-[#3E2723] mb-6">Teste de Ações</h1>
      <TestInput onTest={runTest} />

      {loading && <LoadingIndicator />}

      {testResult && !loading && (
        <TestResult
          symbol={testResult.symbol}
          actualValue={testResult.actualValue}
          predictedValue={testResult.predictedValue}
          match={testResult.match}
        />
      )}
    </motion.div>
  );
};

export default TestPage;
