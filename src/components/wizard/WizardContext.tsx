import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BusinessData {
  name: string;
  segment: string;
  phone: string;
  country: 'BR' | 'PT';
  isWhatsApp: boolean;
  email: string;
  address: string;
  socialNetwork?: string;
  logoFile: File | null;
  logoUrl: string;
  clientCode?: string;
}

export interface CustomizationData {
  primaryColor: string;
  backgroundColor: string;
  backgroundPattern: 'dots' | 'lines' | 'waves' | 'grid' | 'none';
}

export interface RewardConfig {
  sealShape: 'star' | 'circle' | 'square' | 'heart';
  sealCount: number;
  maxCards?: number;
  rewardDescription: string;
  instructions: string;
  expirationDate?: Date;
}

export interface WizardState {
  businessData: BusinessData;
  customization: CustomizationData;
  rewardConfig: RewardConfig;
  currentQuestion: number;
  isComplete: boolean;
}

interface WizardContextType {
  state: WizardState;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  updateCustomization: (data: Partial<CustomizationData>) => void;
  updateRewardConfig: (data: Partial<RewardConfig>) => void;
  setCurrentQuestion: (question: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setComplete: (complete: boolean) => void;
  clearSavedState: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialState: WizardState = {
  businessData: {
    name: "",
    segment: "",
    phone: "",
    country: 'BR',
    isWhatsApp: false,
    email: "",
    address: "",
    socialNetwork: "",
    logoFile: null,
    logoUrl: "",
    clientCode: "",
  },
  customization: {
    primaryColor: "#480da2",
    backgroundColor: "#ffffff",
    backgroundPattern: 'none',
  },
  rewardConfig: {
    sealShape: 'star',
    sealCount: 9,
    rewardDescription: "Complete a cartela e ganhe um café grátis*",
    instructions: "A cada compra acima de $100 você ganha um selo",
  },
  currentQuestion: 1,
  isComplete: false,
};

const STORAGE_KEY = 'wizard-loyalty-card-state';

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>(initialState);

  // Função para salvar estado no localStorage
  const saveToStorage = (newState: WizardState) => {
    try {
      const stateToSave = {
        ...newState,
        businessData: {
          ...newState.businessData,
          // Não salvar o arquivo diretamente, apenas a URL se existir
          logoFile: null
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Erro ao salvar estado no localStorage:', error);
    }
  };

  // Função para carregar estado do localStorage
  const loadFromStorage = (): WizardState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Converter data de string para Date se existir
        if (parsedState.rewardConfig?.expirationDate) {
          parsedState.rewardConfig.expirationDate = new Date(parsedState.rewardConfig.expirationDate);
        }
        return parsedState;
      }
    } catch (error) {
      console.warn('Erro ao carregar estado do localStorage:', error);
    }
    return null;
  };

  // Função para limpar estado salvo
  const clearSavedState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Erro ao limpar estado do localStorage:', error);
    }
  };

  // Carregar estado salvo na inicialização
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState) {
      setState(savedState);
    }
  }, []);

  // Salvar estado sempre que houver mudanças
  useEffect(() => {
    // Só salvar se não for o estado inicial (evitar salvar o estado vazio)
    if (state.businessData.name || state.currentQuestion > 1) {
      saveToStorage(state);
    }
  }, [state]);

  const generateClientCode = (businessName: string): string => {
    const letters = businessName.replace(/[^a-zA-Z]/g, '');
    const initials = letters.substring(0, 2).toUpperCase().padEnd(2, 'X');
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return `FI${initials}${numbers}`;
  };

  const updateBusinessData = (data: Partial<BusinessData>) => {
    if (data.name && !data.clientCode) {
      data.clientCode = generateClientCode(data.name);
    }
    setState(prev => ({
      ...prev,
      businessData: { ...prev.businessData, ...data }
    }));
  };

  const updateCustomization = (data: Partial<CustomizationData>) => {
    setState(prev => ({
      ...prev,
      customization: { ...prev.customization, ...data }
    }));
  };

  const updateRewardConfig = (data: Partial<RewardConfig>) => {
    setState(prev => ({
      ...prev,
      rewardConfig: { ...prev.rewardConfig, ...data }
    }));
  };

  const setCurrentQuestion = (question: number) => {
    setState(prev => ({ ...prev, currentQuestion: question }));
  };

  const nextQuestion = () => {
    setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
  };

  const prevQuestion = () => {
    setState(prev => ({ ...prev, currentQuestion: Math.max(1, prev.currentQuestion - 1) }));
  };

  const setComplete = (complete: boolean) => {
    setState(prev => ({ ...prev, isComplete: complete }));
  };

  return (
    <WizardContext.Provider
      value={{
        state,
        updateBusinessData,
        updateCustomization,
        updateRewardConfig,
        setCurrentQuestion,
        nextQuestion,
        prevQuestion,
        setComplete,
        clearSavedState,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};