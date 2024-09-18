"use client";

import { useEffect, useState } from "react";
import Preloader from "./components/preloader/preload";
import { AnimatePresence, motion } from "framer-motion";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/playfair-display/400.css'; 
import '@fontsource/playfair-display/700.css'; 
import '@fontsource/playfair-display/900.css'; 

// Custom MUI Button with a minimalistic hover effect
const MinimalButton = styled(Button)({
  backgroundColor: 'transparent',
  border: '2px solid #3b82f6', // Blue border to match theme
  color: '#3b82f6', // Button text color matches the border
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  transition: 'all 0.3s ease-in-out',

  '&:hover': {
    backgroundColor: '#3b82f6', // Fills background with blue on hover
    color: 'white', // Changes text to white
  },
});

// Animation for quotes in different positions
const floatingQuoteAnimation = (initialX: number, initialY: number, endX: number, endY: number) => ({
  initial: { x: initialX, y: initialY, opacity: 0 },
  animate: {
    x: endX,
    y: endY,
    opacity: 1,
    transition: {
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse", // Makes it go back and forth
      ease: "easeInOut",
    },
  },
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#FDE8D0] text-gray-800 min-h-screen flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />} 
      </AnimatePresence>
      
      {!isLoading && (
        <div className="flex flex-grow flex-col items-center justify-center">
          
          {/* Hero Section with CTA */}
          <section className="text-center py-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-5xl font-bold mb-6">
                Preveja Preços de Criptomoedas com Confiança
              </h1>
              <p className="text-lg mb-10">
                Utilize o poder da IA para prever os preços das suas criptomoedas favoritas.
              </p>
            </motion.div>
          </section>

          {/* Infinite Scrolling Quotes */}
          <section className="relative w-full h-60 overflow-hidden flex items-center justify-center mb-12">
            <motion.div
              className="absolute"
              variants={floatingQuoteAnimation(-200, 0, 200, 0)} // Moving farther out to prevent disappearance
              initial="initial"
              animate="animate"
            >
              <p className="text-xl font-semibold text-center">"O futuro do mercado cripto é previsível com a tecnologia certa."</p>
            </motion.div>

            <motion.div
              className="absolute"
              variants={floatingQuoteAnimation(200, -100, -200, 100)}
              initial="initial"
              animate="animate"
            >
              <p className="text-xl font-semibold text-center">"IA pode transformar sua estratégia de investimento."</p>
            </motion.div>

            <motion.div
              className="absolute"
              variants={floatingQuoteAnimation(0, -150, 0, 150)}
              initial="initial"
              animate="animate"
            >
              <p className="text-xl font-semibold text-center">"O poder dos dados está na palma da sua mão."</p>
            </motion.div>

            <motion.div
              className="absolute"
              variants={floatingQuoteAnimation(100, 150, -100, -150)}
              initial="initial"
              animate="animate"
            >
              <p className="text-xl font-semibold text-center">"Preveja o mercado com precisão e confiança."</p>
            </motion.div>
          </section>

          {/* New Features Section */}
          <section className="w-full bg-gray py-12">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Principais Funcionalidades
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Previsões Baseadas em IA</h3>
                  <p className="text-sm">Nossas previsões de criptomoedas são alimentadas pela mais recente tecnologia de IA.</p>
                </div>
                <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Análise de Mercado em Tempo Real</h3>
                  <p className="text-sm">Fique à frente do mercado com dados de mercado ao vivo e análises de tendências.</p>
                </div>
                <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Treinamento Personalizado de Modelos</h3>
                  <p className="text-sm">Treine e personalize seus modelos com base em dados históricos específicos.</p>
                </div>
              </motion.div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
