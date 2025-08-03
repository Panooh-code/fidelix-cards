
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WizardState } from '@/components/wizard/WizardContext';
import { toast } from 'sonner';

export const useLoyaltyCardSave = () => {
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const saveCard = async (wizardState: WizardState): Promise<{ success: boolean; cardId?: string }> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setSaving(true);
    
    try {
      // First, upload logo to Supabase Storage if it's a file
      let logoUrl = wizardState.businessData.logoUrl;
      
      if (wizardState.businessData.logoFile) {
        const fileExt = wizardState.businessData.logoFile.name.split('.').pop();
        const fileName = `${wizardState.businessData.clientCode}_logo.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assets')
          .upload(`logos/${fileName}`, wizardState.businessData.logoFile, {
            upsert: true
          });

        if (uploadError) {
          console.error('Error uploading logo:', uploadError);
          throw new Error('Erro ao fazer upload do logo');
        }

        // Get public URL for the uploaded logo
        const { data: publicUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(`logos/${fileName}`);
        
        logoUrl = publicUrlData.publicUrl;
      }

      // Save loyalty card to database
      const cardData = {
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
        client_code: wizardState.businessData.clientCode!,
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
      };

      const { data, error } = await supabase
        .from('loyalty_cards')
        .insert(cardData)
        .select()
        .single();

      if (error) {
        console.error('Error saving card:', error);
        throw new Error('Erro ao salvar cartão');
      }

      // Generate public code and QR code using Edge Function
      const { data: codesData, error: codesError } = await supabase.functions
        .invoke('generate-loyalty-card-codes', {
          body: { cardId: data.id }
        });

      if (codesError) {
        console.error('Error generating codes:', codesError);
        throw new Error('Erro ao gerar códigos do cartão');
      }

      if (!codesData.success) {
        throw new Error(codesData.error || 'Erro ao gerar códigos do cartão');
      }

      console.log('Cartão criado com códigos:', {
        cardId: data.id,
        publicCode: codesData.publicCode,
        qrCodeUrl: codesData.qrCodeUrl,
        publicUrl: codesData.publicUrl
      });

      toast.success('Cartão publicado com sucesso!');
      return { success: true, cardId: data.id };
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
