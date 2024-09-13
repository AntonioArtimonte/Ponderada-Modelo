import { FC, useState, useEffect } from 'react';
import { TextField, Box, Autocomplete } from '@mui/material';
import { motion } from 'framer-motion';
import { coins } from './Coins'

interface TrainRequest {
  crypto: string;
  start_date: string;
  end_date: string;
}

interface ParameterFormProps {
  onFormValidation: (isValid: boolean, data: TrainRequest) => void;
}

const ParameterForm: FC<ParameterFormProps> = ({ onFormValidation }) => {
  const [startDate, setStartDate] = useState('');
  const [crypto, setCrypto] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const isValid = startDate !== '' && crypto !== '' && endDate !== '';
    const formData = { crypto, start_date: startDate, end_date: endDate };

    onFormValidation(isValid, formData);
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

        <Autocomplete
                  freeSolo
                  options={coins}
                  inputValue={crypto}
                  onInputChange={(event, newInputValue) => {
                    setCrypto(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Criptomoeda"
                      placeholder="e.g., BTC-USD, ETH-USD"
                      InputLabelProps={{ shrink: true }}
                      className="mb-4"
                      InputProps={{
                        ...params.InputProps,
                        style: { backgroundColor: '#FAF3E0' },
                      }}
                    />
                  )}
                  componentsProps={{
                    paper: {
                      sx: {
                        backgroundColor: '#FAF3E0',
                      },
                    },
                  }}
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
