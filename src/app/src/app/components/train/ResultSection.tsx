import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface  ResultsSectionProps {
  results: {
    message: string;
    test_loss?: number;
    test_mae?: number;
  };
}

const ResultsSection: FC<ResultsSectionProps> = ({ results }) => {
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
        <Typography variant="body1" className="text-[#5A473D] mb-2">
          Treino: {results.message}
        </Typography>
        <Typography variant="body1" className="text-[#5A473D] mb-2">
          Test Loss: {results.test_loss?.toFixed(4)}%
        </Typography>
        <Typography variant="body1" className="text-[#5A473D] mb-2">
          Test Mae: {results.test_mae?.toFixed(4)}%
        </Typography>
      </Box>

    </motion.div>
  );
};

export default ResultsSection;
