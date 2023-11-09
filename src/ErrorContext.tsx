import React, { useContext, useEffect, useState } from 'react';

const initialState = {
  errorMessage: '',
  setErrorMessage: () => { },
};

type ErrorState = {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
};

const errorContext = React.createContext<ErrorState>(initialState);

interface Props {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const value = {
    errorMessage,
    setErrorMessage,
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage]);

  return (
    <errorContext.Provider value={value}>
      {children}
    </errorContext.Provider>
  );
};

export const useError = () => useContext(errorContext);
