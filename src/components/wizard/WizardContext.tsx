import React, { createContext, useContext, useState, ReactNode } from "react";

export interface BusinessData {
  name: string;
  phone: string;
  phoneCountryCode: string;
  phoneIsWhatsapp: boolean;
  email: string;
  address: string;
  socialNetwork?: string;   // Campo Rede Social Principal (opcional)
  logoFile: File | null;
  logoUrl: string;
  clientCode: string;       // Código único FI + iniciais + números
}

export interface CustomizationData {
  primaryColor: string;
  backgroundColor: string;
  backgroundPattern: 'dots' | 'lines' | 'waves' | 'grid' | 'none';
}

export interface RewardConfig {
  sealShape: 'star' | 'circle' | 'square' | 'heart';
  sealCount: number;
  rewardDescription: string;
  instructions: string;
}

export interface WizardState {
  businessData: BusinessData;
  customization: CustomizationData;
  rewardConfig: RewardConfig;
  isComplete: boolean;
}

interface WizardContextType {
  state: WizardState;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  updateCustomization: (data: Partial<CustomizationData>) => void;
  updateRewardConfig: (data: Partial<RewardConfig>) => void;
  setComplete: (complete: boolean) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const generateClientCode = (businessName: string): string => {
  const initials = businessName.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase() || 'XX';
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `FI${initials}${numbers}`;
};

const initialState: WizardState = {
  businessData: {
    name: "",
    phone: "",
    phoneCountryCode: "+55",
    phoneIsWhatsapp: false,
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
    sealShape: 'circle',
    sealCount: 10,
    rewardDescription: "",
    instructions: "",
  },
  isComplete: false,
};

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>(initialState);

  const updateBusinessData = (data: Partial<BusinessData>) => {
    setState(prev => {
      const updatedData = { ...prev.businessData, ...data };
      
      // Gerar código único quando o nome for alterado
      if (data.name && data.name !== prev.businessData.name) {
        updatedData.clientCode = generateClientCode(data.name);
      }
      
      return {
        ...prev,
        businessData: updatedData
      };
    });
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
        setComplete,
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