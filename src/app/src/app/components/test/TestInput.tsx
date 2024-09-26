"use client";

import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TestInputProps {
  onTest: (symbol: string) => void;
}

interface StockData {
  stock: string;
  trained: number;
}

const TestInput: FC<TestInputProps> = ({ onTest }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [suggestions, setSuggestions] = useState<StockData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/cryptos`);
        const data = await response.json();
        
        const transformedData: StockData[] = Object.keys(data.cryptos).map((key) => ({
          stock: key,
          trained: data.cryptos[key],
        }));
        
        setStocks(transformedData);
      } catch (error) {
        console.error("Failed to fetch stocks:", error);
      }
    };

    fetchStocks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = stocks.filter((stockData) =>
        stockData.stock.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClickSuggestion = (stock: string) => {
    setInputValue(stock);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onTest(inputValue.trim().toUpperCase());
      setInputValue("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 relative"
    >
      <label htmlFor="stock-input" className="block text-lg font-medium text-[#3E2723]">
        Insira o símbolo da Ação:
      </label>
      <input
        id="stock-input"
        type="text"
        className="mt-2 p-2 border rounded-lg w-full"
        value={inputValue}
        onChange={handleChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-t-0 rounded-b-lg shadow-lg w-full max-h-60 overflow-y-auto">
          {suggestions.map((stockData) => (
            <li
              key={stockData.stock}
              onClick={() => handleClickSuggestion(stockData.stock)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {stockData.stock}
            </li>
          ))}
        </ul>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-[#3E2723] text-white px-4 py-2 rounded-lg"
        onClick={handleSubmit}
        style={{ backgroundColor: '#3E2723' }}
      >
        Testar
      </motion.button>
    </motion.div>
  );
};

export default TestInput;
