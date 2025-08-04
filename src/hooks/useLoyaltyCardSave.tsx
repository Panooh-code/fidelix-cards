// CAMINHO DO FICHEIRO: src/hooks/useLoyaltyCardSave.tsx

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WizardState, useWizard } from '@/components/wizard/WizardContext';
import { toast } from 'sonner';

export const useLoyaltyCardSave = () => {
  const [saving, setSaving] = useState(false);
  const { isEditMode, editingCardId } = useWizard();
  const { user } = useAuth();

  const saveCard = async (wizardState: WizardState): Promise<{ success: boolean; cardId?: string }> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return { success: false };
    }

    setSaving(true);
    
    try {
      let logoUrl = wizardState.businessData.logoUrl;
      
      if (wizardState.businessData.logoFile) {
        const fileExt = wizardState.businessData.logoFile.name.split('.').pop();
        const fileName = `${Date.now()}_logo.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assets')
          .upload(`logos/${fileName}`, wizardState.businessData.logoFile, {
            upsert: true
          });

        if (uploadError) throw new Error('Erro ao fazer upload do logo');

        const { data: publicUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(`logos/${fileName}`);
        
        logoUrl = publicUrlData.publicUrl;
      }

      // Mapeia o estado do wizard para o formato correto da tabela 'loyalty_cards'
      // SEM o campo 'client_code'
      const cardToUpsert = {
        id: isEditMode ? editingCardId : undefined,
        user_id: user.id,
        business_name: wizardState.businessData.name,
        business_segment: wizardState.businessData.segment,
        business_phone: wizardState.businessData.phone,
        is_whatsapp: wizardState.businessData.isWhatsApp,
        business_email: wizardState.businessData.email,
        business_address: wizardState.businessData.address,
        social_network: wizardState.businessData.socialNetwork,
        logo_url: logoUrl,
        primary_color: wizardState.customization.primaryColor,
        background_color: wizardState.customization.backgroundColor,
        background_pattern: wizardState.customization.backgroundPattern,
        seal_shape: wizardState.rewardConfig.sealShape,
        seal_count: wizardState.rewardConfig.sealCount,
        reward_description: wizardState.rewardConfig.rewardDescription,
        instructions: wizardState.rewardConfig.instructions,
        expiration_date: wizardState.rewardConfig.expirationDate,
        is_active: true,
      };

      const { data: savedCard, error } = await supabase
        .from('loyalty_cards')
        .upsert(cardToUpsert)
        .select()
        .single();
        
      if (error) throw error;

      // Apenas gera novos códigos se for um cartão novo
      if (!isEditMode) {
          const { data: codesData, error: codesError } = await supabase.functions
          .invoke('generate-loyalty-card-codes', {
            body: { 
              cardId: savedCard.id,
              appDomain: window.location.origin
            }
          });

        if (codesError) throw new Error('Erro ao gerar códigos do cartão');
        if (!codesData.success) throw new Error(codesData.error || 'Erro ao gerar códigos do cartão');
      }

      toast.success(`Cartão ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
      return { success: true, cardId: savedCard.id };

    } catch (error: any) {
      console.error('Error in saveCard:', error);
      toast.error(error.message || 'Erro ao salvar cartão');
      return { success: false };
    } finally {
      setSaving(false);
    }
  };

  return { saveCard, saving };
};
