import React, { createContext, useContext, useState, ReactNode } from "react";

export interface BusinessData {
  name: string;
  phone: string;
  email: string;
  address: string;
  logoFile: File | null;
  logoUrl: string;
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

const initialState: WizardState = {
  businessData: {
    name: "",
    phone: "",
    email: "",
    address: "",
    logoFile: null,
    logoUrl: "",
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