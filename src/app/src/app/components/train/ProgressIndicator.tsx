import { FC } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ProgressIndicator: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center my-6"
    >
      <CircularProgress />
      <Typography variant="body2" className="text-[#5A473D] mt-2">
        Treinamento em andamento...
      </Typography>
    </motion.div>
  );
};

export default ProgressIndicator;
