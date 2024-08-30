"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AboutSection from "./AboutSection";

const SobrePage = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Mock function to simulate fetching more data
  const fetchMoreData = () => {
    setLoading(true);
    setTimeout(() => {
      const moreData = [
        "Informação adicional sobre o app.",
        "História do desenvolvimento.",
        "Tecnologias utilizadas no projeto.",
        "Contribuições e colaborações.",
        "Roadmap futuro e próximos passos.",
      ];

      if (data.length >= 20) {
        setHasMore(false); // Stop loading more after 20 items
      } else {
        setData((prevData) => [...prevData, ...moreData]);
      }

      setLoading(false);
    }, 1500); // Simulate network delay
  };

  // Load initial data
  useEffect(() => {
    fetchMoreData();
  }, []);

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    )
      return;
    fetchMoreData();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-playfair text-[#3E2723] mb-6">Sobre o Projeto</h1>
      <div>
        {data.map((item, index) => (
          <AboutSection key={index} content={item} />
        ))}
      </div>
      {loading && (
        <div className="text-center mt-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block"
          >
            <span className="text-3xl font-bold text-[#3E2723]">⏳</span>
          </motion.div>
          <p className="mt-2 text-lg text-[#3E2723]">Carregando mais informações...</p>
        </div>
      )}
      {!hasMore && <p className="text-center mt-6 text-lg text-[#3E2723]">Você chegou ao fim da página.</p>}
    </div>
  );
};

export default SobrePage;
