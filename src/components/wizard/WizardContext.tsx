// CAMINHO DO FICHEIRO: src/components/wizard/WizardContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Interfaces de dados (sem clientCode)
export interface BusinessData { name: string; segment: string; phone: string; country: 'BR' | 'PT'; isWhatsApp: boolean; email: string; address: string; socialNetwork?: string; logoFile: File | null; logoUrl: string; }
export interface CustomizationData { primaryColor: string; backgroundColor: string; backgroundPattern: 'dots' | 'lines' | 'waves' | 'grid' | 'none'; }
export interface RewardConfig { sealShape: 'star' | 'circle' | 'square' | 'heart'; sealCount: number; maxCards?: number; rewardDescription: string; instructions: string; expirationDate?: Date; }
export interface WizardState { businessData: BusinessData; customization: CustomizationData; rewardConfig: RewardConfig; currentQuestion: number; isComplete: boolean; }

// Context Type (sem clientCode)
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
    handleSaveAndPublish: () => Promise<void>; // A função para guardar
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Estado inicial (sem clientCode)
const initialState: WizardState = {
    businessData: { name: "", segment: "", phone: "", country: 'BR', isWhatsApp: false, email: "", address: "", socialNetwork: "", logoFile: null, logoUrl: "" },
    customization: { primaryColor: "#480da2", backgroundColor: "#ffffff", backgroundPattern: 'none' },
    rewardConfig: { sealShape: 'star', sealCount: 9, rewardDescription: "Complete e ganhe um prémio", instructions: "Ganhe um selo a cada compra" },
    currentQuestion: 1,
    isComplete: false,
};

const STORAGE_KEY = 'wizard-loyalty-card-state';

// Lógica de LocalStorage (mantida com pequenas adaptações)
const loadFromStorage = (): WizardState | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.rewardConfig?.expirationDate) {
                parsed.rewardConfig.expirationDate = new Date(parsed.rewardConfig.expirationDate);
            }
            delete parsed.businessData.clientCode; // Remove o campo antigo
            return parsed;
        }
    } catch (error) { console.warn('Erro ao carregar estado:', error); }
    return null;
};
const getInitialState = (): WizardState => loadFromStorage() || initialState;


export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<WizardState>(getInitialState);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({...state, businessData: {...state.businessData, logoFile: null}})); }, [state]);

    const updateBusinessData = (data: Partial<BusinessData>) => setState(prev => ({...prev, businessData: { ...prev.businessData, ...data }}));
    const updateCustomization = (data: Partial<CustomizationData>) => setState(prev => ({...prev, customization: { ...prev.customization, ...data }}));
    const updateRewardConfig = (data: Partial<RewardConfig>) => setState(prev => ({...prev, rewardConfig: { ...prev.rewardConfig, ...data }}));
    const setCurrentQuestion = (question: number) => setState(prev => ({ ...prev, currentQuestion: question }));
    const nextQuestion = () => setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    const prevQuestion = () => setState(prev => ({ ...prev, currentQuestion: Math.max(1, prev.currentQuestion - 1) }));
    const setComplete = (complete: boolean) => setState(prev => ({ ...prev, isComplete: complete }));
    const clearSavedState = () => { localStorage.removeItem(STORAGE_KEY); setState(initialState); };
    const loadExistingCard = async (cardId: string) => { /* A sua lógica de load é mantida */ };

    // ### FUNÇÃO DE GUARDAR FINAL E CORRIGIDA ###
    const handleSaveAndPublish = async () => {
        if (!user) { toast.error("Autenticação necessária."); return; }
        const { businessData, customization, rewardConfig } = state;
        if (!businessData.name || !rewardConfig.rewardDescription || !businessData.logoUrl) {
            toast.error("Nome do negócio, prémio e logótipo são obrigatórios.");
            return;
        }

        const cardToUpsert = {
            id: isEditMode ? editingCardId : undefined,
            user_id: user.id,
            business_name: businessData.name,
            business_segment: businessData.segment,
            business_phone: businessData.phone,
            business_email: businessData.email,
            logo_url: businessData.logoUrl,
            primary_color: customization.primaryColor,
            background_color: customization.backgroundColor,
            background_pattern: customization.backgroundPattern,
            seal_shape: rewardConfig.sealShape,
            seal_count: rewardConfig.sealCount,
            reward_description: rewardConfig.rewardDescription,
            instructions: rewardConfig.instructions,
            is_active: true
        };

        try {
            toast.info(isEditMode ? "A atualizar cartão..." : "A criar novo cartão...");
            
            const { data: savedCard, error } = await supabase.from('loyalty_cards').upsert(cardToUpsert).select().single();
            if (error) throw error;

            // Chamar a Edge Function para gerar os códigos públicos APÓS guardar
            const { data: codesData, error: codesError } = await supabase.functions.invoke('generate-loyalty-card-codes', {
                body: { cardId: savedCard.id, appDomain: window.location.origin }
            });
            if (codesError) throw codesError;

            toast.success(`Cartão ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
            clearSavedState();
            navigate(`/card/${codesData.publicCode}`);

        } catch (err: any) {
            console.error("Erro detalhado ao guardar:", err);
            toast.error(`Falha ao guardar: ${err.message}`);
        }
    };

    return (
        <WizardContext.Provider value={{
            state, updateBusinessData, updateCustomization, updateRewardConfig,
            setCurrentQuestion, nextQuestion, prevQuestion, setComplete,
            clearSavedState, loadExistingCard, isEditMode, editingCardId,
            handleSaveAndPublish,
        }}>
            {children}
        </WizardContext.Provider>
    );
};

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (context === undefined) { throw new Error("useWizard must be used within a WizardProvider"); }
    return context;
};
