import { FC } from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';


const Header: FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Typography variant="h4" className="font-playfair text-[#3E2723]">
        Treinar Modelo
      </Typography>
      <Typography variant="body1" className="text-[#5A473D] mt-2">
        Configure os parâmetros abaixo e inicie o treinamento do modelo. Você poderá visualizar os resultados, como a matriz de confusão, recall, e acurácia após o término do treinamento.
      </Typography>
    </motion.header>
  );
};

export default Header;
