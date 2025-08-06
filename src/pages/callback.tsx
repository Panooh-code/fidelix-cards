// src/pages/callback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        toast.error('Erro ao autenticar');
        console.error('Erro ao obter sessão:', error);
        return navigate('/'); // fallback em caso de erro
      }

      // 🔁 Recupera o caminho salvo antes do login
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';

      sessionStorage.removeItem('redirectAfterLogin'); // limpa após redirecionar

      navigate(redirectPath);
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
