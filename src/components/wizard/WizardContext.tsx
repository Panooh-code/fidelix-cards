// CAMINHO DO FICHEIRO: src/components/wizard/WizardContext.tsx
// VERSÃO DE DIAGNÓSTICO PARA VER O QUE ESTÁ A SER GUARDADO

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// As suas interfaces de dados (mantidas)
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
    handleSaveAndPublish: () => Promise<void>; // Função de guardar
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialState: WizardState = {
    businessData: { name: "", segment: "", phone: "", country: 'BR', isWhatsApp: false, email: "", address: "", socialNetwork: "", logoFile: null, logoUrl: "", clientCode: "" },
    customization: { primaryColor: "#480da2", backgroundColor: "#ffffff", backgroundPattern: 'none' },
    rewardConfig: { sealShape: 'star', sealCount: 9, rewardDescription: "Complete e ganhe um prémio", instructions: "Ganhe um selo a cada compra" },
    currentQuestion: 1,
    isComplete: false,
};

// --- COMPONENTE PROVIDER COM A LÓGICA DE DIAGNÓSTICO ---
export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<WizardState>(initialState);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Funções de gestão de estado (mantidas)
    const updateBusinessData = (data: Partial<BusinessData>) => setState(prev => ({...prev, businessData: { ...prev.businessData, ...data }}));
    const updateCustomization = (data: Partial<CustomizationData>) => setState(prev => ({...prev, customization: { ...prev.customization, ...data }}));
    const updateRewardConfig = (data: Partial<RewardConfig>) => setState(prev => ({...prev, rewardConfig: { ...prev.rewardConfig, ...data }}));
    const setCurrentQuestion = (question: number) => setState(prev => ({ ...prev, currentQuestion: question }));
    const nextQuestion = () => setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    const prevQuestion = () => setState(prev => ({ ...prev, currentQuestion: Math.max(1, prev.currentQuestion - 1) }));
    const setComplete = (complete: boolean) => setState(prev => ({ ...prev, isComplete: complete }));
    const clearSavedState = () => { /* Lógica mantida */ };
    const loadExistingCard = async (cardId: string) => { /* Lógica mantida */ };

    // ### FUNÇÃO DE DIAGNÓSTICO ###
    const handleSaveAndPublish = async () => {
        console.log("--- INICIANDO DIAGNÓSTICO DE GRAVAÇÃO ---");
        
        if (!user) {
            console.error("ERRO DE DIAGNÓSTICO: Utilizador não autenticado.");
            toast.error("Precisa de estar autenticado para guardar um cartão.");
            return;
        }

        console.log("Utilizador autenticado:", user.id);
        console.log("Estado atual do formulário (state):", state);

        const generatePublicCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
            return result;
        };
        
        const cardToInsert = {
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
            is_active: true,
            public_code: generatePublicCode(),
        };

        console.log("Objeto que será enviado para o Supabase:", cardToInsert);

        try {
            toast.info("A tentar guardar o cartão...");
            const { data, error } = await supabase.from('loyalty_cards').insert(cardToInsert).select().single();
            
            if (error) {
                console.error("ERRO RETORNADO PELO SUPABASE:", error);
                throw error; // Lança o erro para ser apanhado pelo 'catch'
            }

            console.log("SUCESSO! Dados retornados pelo Supabase:", data);
            toast.success("Cartão criado com sucesso!");
            navigate(`/card/${data.public_code}`);

        } catch (err: any) {
            console.error("ERRO FINAL no bloco try/catch:", err);
            toast.error(`Falha ao guardar o cartão: ${err.message}`);
        }
        console.log("--- FIM DO DIAGNÓSTICO ---");
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
