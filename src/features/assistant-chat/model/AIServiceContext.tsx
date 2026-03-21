import { createContext, ReactNode, useContext, useState } from 'react';
import { AIContextData } from './useAIContext';

type AIServiceContextType = {
  contextData?: AIContextData;
  setContextData: (data: AIContextData) => void;
};

const AIServiceContext = createContext<AIServiceContextType | undefined>(undefined);

export const AIServiceProvider = ({
  children,
  initialContext,
}: {
  children: ReactNode;
  initialContext?: AIContextData;
}) => {
  const [contextData, setContextData] = useState<AIContextData | undefined>(initialContext);

  return <AIServiceContext.Provider value={{ contextData, setContextData }}>{children}</AIServiceContext.Provider>;
};

export const useAIService = () => {
  const context = useContext(AIServiceContext);
  if (!context) {
    throw new Error('useAIService must be used within AIServiceProvider');
  }
  return context;
};
