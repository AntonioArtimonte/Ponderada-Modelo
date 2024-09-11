import { FC } from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

interface TrainingButtonProps {
  isDisabled: boolean;
  onTrainingStart: () => void;
}


const TrainingButton: FC<TrainingButtonProps> = ({ isDisabled, onTrainingStart }) => {

  const enabledBgColor = "#3E2723";
  const disabledBgColor = "A9A9A9";

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.05 } : {}}  
      whileTap={!isDisabled ? { scale: 0.95 } : {}} 
    >
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{
          backgroundColor: isDisabled ? disabledBgColor : enabledBgColor,
          color: 'white',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
        disabled={isDisabled}
        onClick={onTrainingStart}
      >
        Iniciar Treinamento
      </Button>
    </motion.div>
  );
};

export default TrainingButton;