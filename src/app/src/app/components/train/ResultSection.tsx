import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const ResultsSection: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[#FAF3E0] p-6 rounded-xl shadow-lg mt-6"
    >
      <Typography variant="h6" className="font-playfair text-[#3E2723] mb-4">
        Resultados
      </Typography>
      <Box className="mb-6">
        <Typography variant="body1" className="text-[#5A473D]">
          Acurácia
        </Typography>
        <Box className="bg-white h-20 rounded-lg shadow-inner mt-2">

        </Box>
      </Box>
    </motion.div>
  );
};

export default ResultsSection;
