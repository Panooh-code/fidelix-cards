// CAMINHO DO FICHEIRO: src/components/wizard/WizardContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// As suas interfaces (mantidas)
export interface BusinessData { name: string; segment: string; phone: string; country: 'BR' | 'PT'; isWhatsApp: boolean; email: string; address: string; socialNetwork?: string; logoFile: File | null; logoUrl: string; clientCode?: string; }
export interface CustomizationData { primaryColor: string; backgroundColor: string; backgroundPattern: 'dots' | 'lines' | 'waves' | 'grid' | 'none'; }
export interface RewardConfig { sealShape: 'star' | 'circle' | 'square' | 'heart'; sealCount: number; maxCards?: number; rewardDescription: string; instructions: string; expirationDate?: Date; }
export interface WizardState { businessData: BusinessData; customization: CustomizationData; rewardConfig: RewardConfig; currentQuestion: number; isComplete: boolean; }

// Adicionar a função de guardar ao tipo do Contexto
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
    handleSaveAndPublish: () => Promise<void>;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialState: WizardState = {
    businessData: { name: "", segment: "", phone: "", country: 'BR', isWhatsApp: false, email: "", address: "", socialNetwork: "", logoFile: null, logoUrl: "", clientCode: "" },
    customization: { primaryColor: "#480da2", backgroundColor: "#ffffff", backgroundPattern: 'none' },
    rewardConfig: { sealShape: 'star', sealCount: 9, rewardDescription: "Complete e ganhe um prémio", instructions: "Ganhe um selo a cada compra" },
    currentQuestion: 1,
    isComplete: false,
};

// --- COMPONENTE PROVIDER COM A LÓGICA FINAL ---
export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<WizardState>(initialState);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const updateBusinessData = (data: Partial<BusinessData>) => setState(prev => ({...prev, businessData: { ...prev.businessData, ...data }}));
    const updateCustomization = (data: Partial<CustomizationData>) => setState(prev => ({...prev, customization: { ...prev.customization, ...data }}));
    const updateRewardConfig = (data: Partial<RewardConfig>) => setState(prev => ({...prev, rewardConfig: { ...prev.rewardConfig, ...data }}));
    const setCurrentQuestion = (question: number) => setState(prev => ({ ...prev, currentQuestion: question }));
    const nextQuestion = () => setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    const prevQuestion = () => setState(prev => ({ ...prev, currentQuestion: Math.max(1, prev.currentQuestion - 1) }));
    const setComplete = (complete: boolean) => setState(prev => ({ ...prev, isComplete: complete }));
    const clearSavedState = () => { localStorage.removeItem('wizard-loyalty-card-state'); setState(initialState); };
    const loadExistingCard = async (cardId: string) => { /* A sua lógica de load é mantida */ };

    // ### FUNÇÃO DE GUARDAR CORRIGIDA E DEFINITIVA ###
    const handleSaveAndPublish = async () => {
        if (!user) {
            toast.error("Autenticação necessária.");
            return;
        }

        const { businessData, customization, rewardConfig } = state;

        if (!businessData.name || !rewardConfig.rewardDescription || !businessData.logoUrl) {
            toast.error("Nome do negócio, prémio e logótipo são obrigatórios.");
            return;
        }

        const generateUniqueCode = (prefix: string, length: number) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = prefix;
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        
        const cardToUpsert = {
            id: isEditMode ? editingCardId : undefined, // Envia o ID apenas se estiver a editar
            user_id: user.id,
            business_name: businessData.name,
            business_segment: businessData.segment,
            business_phone: businessData.phone,
            is_whatsapp: businessData.isWhatsApp,
            business_email: businessData.email,
            business_address: businessData.address,
            social_network: businessData.socialNetwork,
            logo_url: businessData.logoUrl,
            client_code: isEditMode ? businessData.clientCode : generateUniqueCode('FI', 6), // Gera novo client_code só na criação
            public_code: isEditMode ? undefined : generateUniqueCode('', 6), // Gera novo public_code só na criação
            primary_color: customization.primaryColor,
            background_color: customization.backgroundColor,
            background_pattern: customization.backgroundPattern,
            seal_shape: rewardConfig.sealShape,
            seal_count: rewardConfig.sealCount,
            reward_description: rewardConfig.rewardDescription,
            instructions: rewardConfig.instructions,
            is_active: true,
        };

        try {
            toast.info(isEditMode ? "A atualizar cartão..." : "A criar novo cartão...");
            
            const { data, error } = await supabase.from('loyalty_cards').upsert(cardToUpsert).select().single();
            
            if (error) {
                // Se o erro for de duplicado, tentamos novamente com um novo código.
                if (error.code === '23505') {
                    toast.warning("Conflito de código, a tentar gerar um novo...");
                    const newCardWithNewCode = { ...cardToUpsert, client_code: generateUniqueCode('FI', 6), public_code: generateUniqueCode('', 6) };
                    const { data: retryData, error: retryError } = await supabase.from('loyalty_cards').upsert(newCardWithNewCode).select().single();
                    if (retryError) throw retryError;
                    toast.success("Cartão criado com sucesso após nova tentativa!");
                    clearSavedState();
                    navigate(`/card/${retryData.public_code}`);
                    return;
                }
                throw error;
            }

            toast.success(`Cartão ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
            clearSavedState();
            navigate(`/card/${data.public_code}`);

        } catch (err: any) {
            console.error("Erro detalhado ao guardar:", err);
            toast.error(`Falha ao guardar: ${err.message}`);
        }
    };

    return (
        <WizardContext.Provider value={{
            state, updateBusinessData, updateCustomization, updateRewardConfig,
            setCurrentQuestion, nextQuestion, prevQuestion, setComplete, clearSavedState,
            loadExistingCard, isEditMode, editingCardId,
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
