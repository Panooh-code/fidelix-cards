// CAMINHO DO FICHEIRO: src/components/wizard/WizardContext.tsx
// VERSÃO DE DIAGNÓSTICO COM INSERÇÃO MÍNIMA

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

// --- COMPONENTE PROVIDER COM A LÓGICA DE DIAGNÓSTICO ---
export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<WizardState>(initialState);
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

    // ### FUNÇÃO DE DIAGNÓSTICO MÍNIMA ###
    const handleSaveAndPublish = async () => {
        console.log("--- INICIANDO TESTE DE INSERÇÃO MÍNIMA ---");
        if (!user) {
            toast.error("Utilizador não autenticado.");
            return;
        }
        if (!state.businessData.name || !state.rewardConfig.rewardDescription || !state.businessData.logoUrl) {
            toast.error("Nome, prémio e logótipo são obrigatórios para o teste.");
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

        const cardToInsert = {
            user_id: user.id,
            business_name: state.businessData.name,
            business_segment: state.businessData.segment || "Teste",
            business_phone: state.businessData.phone || "000",
            business_email: state.businessData.email || "teste@teste.com",
            logo_url: state.businessData.logoUrl,
            reward_description: state.rewardConfig.rewardDescription,
            instructions: state.rewardConfig.instructions || "Instruções",
            public_code: generateUniqueCode("T", 5), // Código de teste
        };

        console.log("A tentar inserir este objeto MÍNIMO:", cardToInsert);

        try {
            const { data, error } = await supabase.from('loyalty_cards').insert(cardToInsert).select().single();
            if (error) throw error;
            console.log("SUCESSO! DADOS GUARDADOS:", data);
            toast.success("TESTE BEM SUCEDIDO! Cartão guardado!");
            navigate(`/card/${data.public_code}`);
        } catch (err: any) {
            console.error("ERRO DE INSERÇÃO:", err);
            toast.error(`Falha no teste de inserção: ${err.message}`);
        }
    };

    return (
        <WizardContext.Provider value={{
            state, updateBusinessData, updateCustomization, updateRewardConfig,
            setCurrentQuestion, nextQuestion, prevQuestion, setComplete,
            // Funções não usadas neste teste
            clearSavedState: () => {},
            loadExistingCard: async () => {},
            isEditMode: false,
            editingCardId: null,
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
