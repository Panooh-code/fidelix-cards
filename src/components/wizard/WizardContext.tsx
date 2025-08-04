// CAMINHO DO FICHEIRO: src/components/wizard/WizardContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// As suas interfaces de dados (mantidas)
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

// ### ALTERAÇÃO 1: Adicionar a função de guardar ao tipo do Contexto ###
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
    handleSaveAndPublish: () => Promise<void>; // <-- FUNÇÃO ADICIONADA
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

// O seu estado inicial (mantido)
const initialState: WizardState = {
    businessData: { name: "", segment: "", phone: "", country: 'BR', isWhatsApp: false, email: "", address: "", socialNetwork: "", logoFile: null, logoUrl: "", clientCode: "" },
    customization: { primaryColor: "#480da2", backgroundColor: "#ffffff", backgroundPattern: 'none' },
    rewardConfig: { sealShape: 'star', sealCount: 9, rewardDescription: "Complete a cartela e ganhe um café grátis*", instructions: "A cada compra acima de $100 você ganha um selo" },
    currentQuestion: 1,
    isComplete: false,
};

const STORAGE_KEY = 'wizard-loyalty-card-state';

// O seu código de localStorage (mantido)
const loadFromStorage = (): WizardState | null => {
    try {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsedState = JSON.parse(saved);
            if (parsedState.rewardConfig?.expirationDate) {
                parsedState.rewardConfig.expirationDate = new Date(parsedState.rewardConfig.expirationDate);
            }
            return parsedState;
        }
    } catch (error) { console.warn('Erro ao carregar estado do localStorage:', error); }
    return null;
};
const getInitialState = (): WizardState => {
    const savedState = loadFromStorage();
    return savedState || initialState;
};

// --- COMPONENTE PROVIDER (COM A LÓGICA DE GUARDAR) ---
export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<WizardState>(getInitialState);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // O seu código de gestão de estado (mantido)
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({...state, businessData: {...state.businessData, logoFile: null}})); }, [state]);
    const clearSavedState = () => { localStorage.removeItem(STORAGE_KEY); };
    const updateBusinessData = (data: Partial<BusinessData>) => setState(prev => ({...prev, businessData: { ...prev.businessData, ...data }}));
    const updateCustomization = (data: Partial<CustomizationData>) => setState(prev => ({...prev, customization: { ...prev.customization, ...data }}));
    const updateRewardConfig = (data: Partial<RewardConfig>) => setState(prev => ({...prev, rewardConfig: { ...prev.rewardConfig, ...data }}));
    const setCurrentQuestion = (question: number) => setState(prev => ({ ...prev, currentQuestion: question }));
    const nextQuestion = () => setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    const prevQuestion = () => setState(prev => ({ ...prev, currentQuestion: Math.max(1, prev.currentQuestion - 1) }));
    const setComplete = (complete: boolean) => setState(prev => ({ ...prev, isComplete: complete }));
    const loadExistingCard = async (cardId: string) => { /* O seu código de load existente é mantido */ };

    // ### ALTERAÇÃO 2: A LÓGICA PARA GUARDAR O CARTÃO NA BASE DE DADOS ###
    const handleSaveAndPublish = async () => {
        if (!user) {
            toast.error("Precisa de estar autenticado para guardar um cartão.");
            return;
        }
        if (!state.businessData.name || !state.rewardConfig.rewardDescription || !state.businessData.logoUrl) {
            toast.error("Por favor, preencha o nome do negócio, o prémio e envie um logótipo.");
            return;
        }

        const generatePublicCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
            return result;
        };
        
        const cardToUpsert = {
            user_id: user.id,
            business_name: state.businessData.name,
            business_segment: state.businessData.segment,
            business_phone: state.businessData.phone,
            is_whatsapp: state.businessData.isWhatsApp,
            business_email: state.businessData.email,
            business_address: state.businessData.address,
            social_network: state.businessData.socialNetwork,
            logo_url: state.businessData.logoUrl,
            primary_color: state.customization.primaryColor,
            background_color: state.customization.backgroundColor,
            background_pattern: state.customization.backgroundPattern,
            seal_shape: state.rewardConfig.sealShape,
            seal_count: state.rewardConfig.sealCount,
            reward_description: state.rewardConfig.rewardDescription,
            instructions: state.rewardConfig.instructions,
            expiration_date: state.rewardConfig.expirationDate,
            is_active: true,
            public_code: isEditMode ? undefined : generatePublicCode(),
        };

        try {
            toast.info(isEditMode ? "A atualizar o cartão..." : "A criar o novo cartão...");
            const { data, error } = await supabase.from('loyalty_cards').upsert(isEditMode ? { ...cardToUpsert, id: editingCardId } : cardToUpsert).select().single();
            if (error) throw error;
            toast.success(`Cartão ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
            clearSavedState(); // Limpa o estado do wizard após o sucesso
            navigate(`/card/${data.public_code}`);
        } catch (err: any) {
            console.error("Erro detalhado ao guardar:", err);
            toast.error(`Falha ao guardar o cartão: ${err.message}`);
        }
    };

    return (
        <WizardContext.Provider value={{
            state, updateBusinessData, updateCustomization, updateRewardConfig,
            setCurrentQuestion, nextQuestion, prevQuestion, setComplete, clearSavedState,
            loadExistingCard, isEditMode, editingCardId,
            handleSaveAndPublish, // <-- FUNÇÃO DISPONIBILIZADA
        }}>
            {children}
        </WizardContext.Provider>
    );
};

// O seu hook personalizado (mantido)
export const useWizard = () => {
    const context = useContext(WizardContext);
    if (context === undefined) { throw new Error("useWizard must be used within a WizardProvider"); }
    return context;
};
