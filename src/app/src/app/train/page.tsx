'use client';

import { FC, useState } from 'react';
import Header from '../components/train/Header';
import ParameterForm from '../components/train/ParameterForm';
import TrainingButton from '../components/train/TrainingButton';
import ProgressIndicator from '../components/train/ProgressIndicator';
import ResultsSection from '../components/train/ResultSection';

interface TrainRequest {
  crypto: string;
  start_date: string;
  end_date: string;
}

interface TrainResponse {
  message: string;
  test_loss?: number;
  test_mae?: number;
}

// Não sei pq fiz essa pagina diferente mas agora to com preguiça de mudar, vai com deus

const Treino: FC = () => {
  const [formValid, setFormValid] = useState(false);
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [trainResults, setTrainResults] = useState<TrainResponse | null>(null);
  const [formData, setFormData] = useState<TrainRequest>({
    crypto: '',
    start_date: '',
    end_date: ''
  });

  const handleFormValidation = (isValid: boolean, data: TrainRequest) => {
    setFormValid(isValid);
    setFormData(data);
  };

  const handleTrainingStart = async () => {
    setIsTrainingStarted(true);
    setIsTrainingCompleted(false);

    try {
      const response = await fetch('http://localhost:9000/api/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data: TrainResponse = await response.json();
        setTrainResults(data);
        setIsTrainingCompleted(true);
      } else {
        console.error('Training failed');
      }
    } catch (error) {
      console.error('Error occurred while training:', error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Header />
      <ParameterForm onFormValidation={handleFormValidation} />
      <TrainingButton 
        isDisabled={!formValid} 
        onTrainingStart={handleTrainingStart} 
      />
      {isTrainingStarted && !isTrainingCompleted && <ProgressIndicator />}
      {isTrainingCompleted && trainResults && <ResultsSection results={trainResults} />}
    </div>
  );
};

export default Treino;
