import { FC } from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

interface RetrainButtonProps {
  isDisabled: boolean;
  onRetrainingStart: () => void;
}

const RetrainButton: FC<RetrainButtonProps> = ({ isDisabled, onRetrainingStart }) => {
  const enabledBgColor = "#FF5722";
  const disabledBgColor = "A9A9A9";

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className="mt-4"
    >
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        style={{
          backgroundColor: isDisabled ? disabledBgColor : enabledBgColor,
          color: 'white',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
        disabled={isDisabled}
        onClick={onRetrainingStart}
      >
        Retreinar Modelo
      </Button>
    </motion.div>
  );
};

export default RetrainButton;
