import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface ResultsData {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

const testResults: ResultsData = {
  accuracy: 92.5,
  precision: 88.2,
  recall: 90.7,
  f1: 89.4
}

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
        <Typography variant="body1" className="text-[#5A473D] mb-2">
          Acurácia: {testResults.accuracy}%
        </Typography>
        <Typography variant="body1" className="text-[#5A473D] mb-2">
          Precisão: {testResults.precision}%
        </Typography>
        <Typography variant="body1" className="text-[#5A473D] mb-2">
          Recall: {testResults.recall}%
        </Typography>
        <Typography variant="body1" className="text-[#5A473D] mb-2">
          F1-Score: {testResults.f1}%
        </Typography>
      </Box>

      <Box className="bg-white h-20 rounded-lg shadow-inner mt-2">
        {/* da pra tacalhe um grafico aq, se vou fazer so deus sabe*/}
      </Box>
    </motion.div>
  );
};

export default ResultsSection;
