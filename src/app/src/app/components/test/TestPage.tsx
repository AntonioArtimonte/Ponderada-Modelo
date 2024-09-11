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

  const runTest = async (symbol: string) => {
    setLoading(true);
    setStockSymbol(symbol);

    try {

      const response = await fetch(`http://localhost:9000/api/test?crypto=${symbol}`);
      if (!response.ok) {
        throw new Error("Failed to fetch test result");
      }


      const data = await response.json();


      const actual = data.actual_price;
      const predicted = data.predicted_price;
      const percentageDifference = Math.abs((actual - predicted) / actual) * 100;


      const result = {
        symbol: data.crypto,
        actualValue: actual,
        predictedValue: predicted,
        match: percentageDifference <= 5,
      };

      setTestResult(result);
    } catch (error) {
      console.error("Error fetching test result:", error);
      setTestResult(null);
    } finally {
      setLoading(false);
    }
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
