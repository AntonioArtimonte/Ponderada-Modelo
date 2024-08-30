'use client';

import { FC } from 'react';
import Header from '../components/train/Header';
import ParameterForm from '../components/train/ParameterForm';
import TrainingButton from '../components/train/TrainingButton';
import ProgressIndicator from '../components/train/ProgressIndicator';
import ResultsSection from '../components/train/ResultSection';

const Treino: FC = () => {
  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Header />
      <ParameterForm />
      <TrainingButton />
      <ProgressIndicator />
      <ResultsSection />
    </div>
  );
};

export default Treino;
