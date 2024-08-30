import { FC } from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const TrainingButton: FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="contained"
        color="primary"
        className="bg-[#3E2723] text-white px-6 py-2 rounded-lg"
        fullWidth
      >
        Iniciar Treinamento
      </Button>
    </motion.div>
  );
};

export default TrainingButton;
