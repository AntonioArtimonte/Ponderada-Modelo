import { FC } from 'react';
import { TextField, Box } from '@mui/material';
import { motion } from 'framer-motion';


const ParameterForm: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Box className="bg-[#FAF3E0] p-6 rounded-xl shadow-lg mb-6">
        <TextField
          label="Data de Início"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          className="mb-4"
        />
        <TextField
          label="Parâmetro X"
          type="number"
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Parâmetro Y"
          type="number"
          fullWidth
          className="mb-4"
        />
      </Box>
    </motion.div>
  );
};

export default ParameterForm;
