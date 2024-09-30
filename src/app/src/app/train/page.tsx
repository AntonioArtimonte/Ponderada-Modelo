'use client';

import { FC, useState, useCallback, useEffect } from 'react';
import Header from '../components/train/Header';
import ParameterForm from '../components/train/ParameterForm';
import TrainingButton from '../components/train/TrainingButton';
import RetrainButton from '../components/train/RetrainButton';
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

interface CryptosResponse {
  cryptos: Record<string, number>; // crypto: trained status (1 or 0)
}

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
  const [trainedCryptos, setTrainedCryptos] = useState<Record<string, number>>({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  
  useEffect(() => {
    const fetchTrainedCryptos = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/cryptos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: CryptosResponse = await response.json();
          setTrainedCryptos(data.cryptos);
        } else {
          console.error('Failed to fetch trained cryptos');
        }
      } catch (error) {
        console.error('Error fetching trained cryptos:', error);
      }
    };

    fetchTrainedCryptos();
  }, [apiUrl]);

  const handleFormValidation = useCallback(
    (isValid: boolean, data: TrainRequest) => {
      setFormValid(isValid);
      setFormData(data);
    },
    [] 
  );

  // Check if the selected crypto is already trained
  const isCryptoTrained = formData.crypto && trainedCryptos[formData.crypto] === 1;

  const handleTrainingStart = async () => {
    setIsTrainingStarted(true);
    setIsTrainingCompleted(false);
    setTrainResults(null); 

    try {
      const response = await fetch(`${apiUrl}/api/train`, {
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

        
        setTrainedCryptos((prev) => ({
          ...prev,
          [formData.crypto]: 1,
        }));
      } else {
        const errorData = await response.json();
        console.error('Training failed:', errorData);
        setTrainResults({ message: 'Training failed.' });
        setIsTrainingCompleted(true);
      }
    } catch (error) {
      console.error('Error occurred while training:', error);
      setTrainResults({ message: 'An error occurred during training.' });
      setIsTrainingCompleted(true);
    }
  };

  const handleRetrainingStart = async () => {
    setIsTrainingStarted(true);
    setIsTrainingCompleted(false);
    setTrainResults(null); 

    try {
      const response = await fetch(`${apiUrl}/api/retrain`, {
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
        const errorData = await response.json();
        console.error('Retraining failed:', errorData);
        setTrainResults({ message: 'Retraining failed.' });
        setIsTrainingCompleted(true);
      }
    } catch (error) {
      console.error('Error occurred during retraining:', error);
      setTrainResults({ message: 'An error occurred during retraining.' });
      setIsTrainingCompleted(true);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Header />
      <ParameterForm onFormValidation={handleFormValidation} />
      
      {/* Conditional Rendering of Buttons */}
      {!isCryptoTrained && (
        <TrainingButton 
          isDisabled={!formValid} 
          onTrainingStart={handleTrainingStart} 
        />
      )}

      {isCryptoTrained && (
        <RetrainButton
          isDisabled={!formValid}
          onRetrainingStart={handleRetrainingStart}
        />
      )}

      {isTrainingStarted && !isTrainingCompleted && <ProgressIndicator />}
      {isTrainingCompleted && trainResults && <ResultsSection results={trainResults} />}
    </div>
  );
};

export default Treino;
