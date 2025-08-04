// CAMINHO DO FICHEIRO: src/hooks/useLoyaltyCardSave.tsx

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WizardState, useWizard } from '@/components/wizard/WizardContext';
import { toast } from 'sonner';

export const useLoyaltyCardSave = () => {
  const [saving, setSaving] = useState(false);
  const { isEditMode, editingCardId, state: wizardStateFromContext } = useWizard();
  const { user, hasRole, refreshProfile } = useAuth();

  const saveCard = async (wizardState: WizardState): Promise<{ success: boolean; cardId?: string; publicCode?: string; }> => {
    if (!user) {
      toast.error('Utilizador não autenticado');
      return { success: false };
    }

    setSaving(true);
    
    try {
      let logoUrl = wizardState.businessData.logoUrl;
      
      // PASSO 1: Upload do logótipo, se existir um ficheiro novo.
      if (wizardState.businessData.logoFile) {
        const fileExt = wizardState.businessData.logoFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_logo.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(`logos/${fileName}`, wizardState.businessData.logoFile, { upsert: true });

        if (uploadError) throw new Error('Erro ao fazer upload do logótipo');

        const { data: publicUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(`logos/${fileName}`);
        
        logoUrl = publicUrlData.publicUrl;
      }
      
      // ### CORREÇÃO CRÍTICA AQUI ###
      // Mapeia o estado do wizard para o formato da tabela, INCLUINDO o client_code.
      const cardToUpsert = {
        id: isEditMode ? editingCardId : undefined,
        user_id: user.id,
        business_name: wizardState.businessData.name,
        business_segment: wizardState.businessData.segment,
        business_phone: wizardState.businessData.phone,
        business_country: wizardState.businessData.country,
        is_whatsapp: wizardState.businessData.isWhatsApp,
        business_email: wizardState.businessData.email,
        business_address: wizardState.businessData.address || null,
        social_network: wizardState.businessData.socialNetwork || null,
        logo_url: logoUrl,
        client_code: wizardState.businessData.clientCode!, // Garante que o client_code do estado é enviado
        primary_color: wizardState.customization.primaryColor,
        background_color: wizardState.customization.backgroundColor,
        background_pattern: wizardState.customization.backgroundPattern,
        seal_shape: wizardState.rewardConfig.sealShape,
        seal_count: wizardState.rewardConfig.sealCount,
        max_cards: wizardState.rewardConfig.maxCards || null,
        reward_description: wizardState.rewardConfig.rewardDescription,
        instructions: wizardState.rewardConfig.instructions,
        expiration_date: wizardState.rewardConfig.expirationDate 
          ? wizardState.rewardConfig.expirationDate.toISOString().split('T')[0] 
          : null,
        is_active: true,
        is_published: true,
      };

      // PASSO 2: Guardar os dados do cartão na tabela.
      const { data: savedCard, error } = await supabase
        .from('loyalty_cards')
        .upsert(cardToUpsert)
        .select()
        .single();
        
      if (error) throw error;

      // PASSO 3: Gerar os códigos públicos APENAS para cartões novos.
      if (!isEditMode) {
          const { data: codesData, error: codesError } = await supabase.functions
          .invoke('generate-loyalty-card-codes', {
            body: { 
              cardId: savedCard.id,
              appDomain: window.location.origin
            }
          });

        if (codesError) throw new Error('Erro ao gerar códigos do cartão');

        // Add merchant role for first card creation
        if (!hasRole('merchant')) {
          const { error: roleError } = await supabase.rpc('add_user_role', {
            user_id_param: user.id,
            role_param: 'merchant'
          });

          if (roleError) {
            console.error('Error adding merchant role:', roleError);
          } else {
            await refreshProfile();
            toast.success('Parabéns! Você agora é um lojista');
          }
        }
        
        toast.success('Cartão publicado com sucesso!');
        return { success: true, cardId: savedCard.id, publicCode: codesData.publicCode };
      }

      toast.success('Cartão atualizado com sucesso!');
      return { success: true, cardId: savedCard.id };

    } catch (error: any) {
      console.error('Erro detalhado no saveCard:', error);
      toast.error(error.message || 'Erro ao guardar o cartão');
      return { success: false };
    } finally {
      setSaving(false);
    }
  };

  return { saveCard, saving };
};
