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
  loadExistingCard: (cardId: string) => Promise<void>;
  isEditMode: boolean;
  editingCardId: string | null;
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

// Função para carregar estado do localStorage (síncrona)
const loadFromStorage = (): WizardState | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedState = JSON.parse(saved);
      console.log('🔄 Estado carregado do localStorage:', parsedState);
      
      // Converter data de string para Date se existir
      if (parsedState.rewardConfig?.expirationDate) {
        parsedState.rewardConfig.expirationDate = new Date(parsedState.rewardConfig.expirationDate);
      }
      return parsedState;
    }
  } catch (error) {
    console.warn('❌ Erro ao carregar estado do localStorage:', error);
  }
  return null;
};

// Inicializar com estado salvo se existir
const getInitialState = (): WizardState => {
  const savedState = loadFromStorage();
  if (savedState) {
    console.log('✅ Usando estado salvo na inicialização');
    return savedState;
  }
  console.log('📝 Usando estado inicial padrão');
  return initialState;
};

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>(getInitialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Função para salvar estado no localStorage
  const saveToStorage = (newState: WizardState) => {
    try {
      if (typeof window === 'undefined') return;
      
      const stateToSave = {
        ...newState,
        businessData: {
          ...newState.businessData,
          // Não salvar o arquivo diretamente, apenas a URL se existir
          logoFile: null
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      console.log('💾 Estado salvo no localStorage:', stateToSave);
    } catch (error) {
      console.warn('❌ Erro ao salvar estado no localStorage:', error);
    }
  };

  // Função para limpar estado salvo
  const clearSavedState = () => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Estado limpo do localStorage');
    } catch (error) {
      console.warn('❌ Erro ao limpar estado do localStorage:', error);
    }
  };

  // Marcar como inicializado na primeira renderização
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Salvar estado sempre que houver mudanças (após inicialização)
  useEffect(() => {
    if (!isInitialized) return;
    
    // Só salvar se não for o estado inicial (evitar salvar o estado vazio)
    if (state.businessData.name || state.currentQuestion > 1) {
      saveToStorage(state);
    }
  }, [state, isInitialized]);

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

  const loadExistingCard = async (cardId: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('id', cardId)
        .single();

      if (error) {
        console.error('Erro ao carregar cartão:', error);
        return;
      }

      if (data) {
        setEditingCardId(cardId);
        setIsEditMode(true);
        
        // Mapear dados do banco para o estado do wizard
        setState({
          businessData: {
            name: data.business_name,
            segment: data.business_segment,
            phone: data.business_phone,
            country: data.business_country as 'BR' | 'PT',
            isWhatsApp: data.is_whatsapp,
            email: data.business_email,
            address: data.business_address || '',
            socialNetwork: data.social_network || '',
            logoFile: null,
            logoUrl: data.logo_url,
            clientCode: data.client_code,
          },
          customization: {
            primaryColor: data.primary_color,
            backgroundColor: data.background_color,
            backgroundPattern: data.background_pattern as any,
          },
          rewardConfig: {
            sealShape: data.seal_shape as any,
            sealCount: data.seal_count,
            maxCards: data.max_cards || undefined,
            rewardDescription: data.reward_description,
            instructions: data.instructions,
            expirationDate: data.expiration_date ? new Date(data.expiration_date) : undefined,
          },
          currentQuestion: 1,
          isComplete: true,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar cartão:', error);
    }
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
        loadExistingCard,
        isEditMode,
        editingCardId,
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