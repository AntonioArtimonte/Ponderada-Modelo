import { FC, useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface ParameterFormProps {
  onFormValidation: (isValid: boolean) => void;
}

const ParameterForm: FC<ParameterFormProps> = ({ onFormValidation }) => {
  const [startDate, setStartDate] = useState('');
  const [crypto, setCrypto] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const isValid = startDate !== '' && crypto !== '' && endDate !== '';
    onFormValidation(isValid);
  }, [startDate, crypto, endDate, onFormValidation]);

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
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          label="Criptomoeda"
          type="text"
          fullWidth
          InputLabelProps={{ shrink: true }}
          className="mb-4"
          value={crypto}
          onChange={(e) => setCrypto(e.target.value)}
        />

        <TextField
          label="Data de fim"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          className="mb-4"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>
    </motion.div>
  );
};

export default ParameterForm;
