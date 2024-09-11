'use client';

import { FC, useState } from 'react';
import Header from '../components/train/Header';
import ParameterForm from '../components/train/ParameterForm';
import TrainingButton from '../components/train/TrainingButton';
import ProgressIndicator from '../components/train/ProgressIndicator';
import ResultsSection from '../components/train/ResultSection';

const Treino: FC = () => {

  const [formValid, setFormValid] = useState(false);
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);

  const handleFormValidation = (isValid: boolean) => {
    setFormValid(isValid);
  }

  const handleTrainingStart = () => {
    setIsTrainingStarted(true);
    setIsTrainingCompleted(false);


    // Simular tempo de treino por ora

    setTimeout(() => {
      setIsTrainingCompleted(true);

    },3000)
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Header />
      <ParameterForm onFormValidation={handleFormValidation}/>
      <TrainingButton 
      isDisabled={!formValid}
      onTrainingStart={handleTrainingStart}
      />
      {isTrainingStarted && !isTrainingCompleted && <ProgressIndicator />}
      {isTrainingCompleted && <ResultsSection />}
    </div>
  );
};

export default Treino;
