// src/pages/callback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        toast.error('Erro ao autenticar');
        console.error('Erro ao obter sessão:', error);
        return navigate('/'); // ou redirecione para página de erro
      }

      // Redirecionar para a página principal ou para onde o usuário estava
      navigate('/');
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-white bg-black">
      <p>Aguarde enquanto fazemos o login com Google...</p>
    </div>
  );
};

export default CallbackPage;

