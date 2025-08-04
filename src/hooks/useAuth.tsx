import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  otpSent: boolean;
  otpLoading: boolean;
  userRoles: string[];
  hasRole: (role: string) => boolean;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<{ error: any }>;
  signUpWithPhone: (phone: string, fullName: string, email?: string) => Promise<{ error: any }>;
  checkUserByPhone: (phone: string) => Promise<{ exists: boolean; error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Conta criada com sucesso! Você já está logado.');
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error('Erro ao criar conta');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error(error.message);
        }
        return { error };
      }

      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Erro ao fazer login');
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        toast.error(error.message);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error('Erro ao fazer login com Google');
      return { error };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      setOtpLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        console.error('Phone sign in error:', error);
        toast.error(error.message);
        return { error };
      }

      setOtpSent(true);
      toast.success('Código enviado via SMS!');
      return { error: null };
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      toast.error('Erro ao enviar código');
      return { error };
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyPhoneOtp = async (phone: string, otp: string) => {
    try {
      setOtpLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        console.error('OTP verification error:', error);
        toast.error('Código inválido ou expirado');
        return { error };
      }

      setOtpSent(false);
      toast.success('Verificação concluída!');
      return { error: null };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error('Erro ao verificar código');
      return { error };
    } finally {
      setOtpLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, fullName: string, email?: string) => {
    try {
      setOtpLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            full_name: fullName,
            email: email || '',
          }
        }
      });

      if (error) {
        console.error('Phone sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      setOtpSent(true);
      toast.success('Código enviado via SMS!');
      return { error: null };
    } catch (error: any) {
      console.error('Phone sign up error:', error);
      toast.error('Erro ao enviar código');
      return { error };
    } finally {
      setOtpLoading(false);
    }
  };

  const checkUserByPhone = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('phone_number', phone)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user by phone:', error);
        return { exists: false, error };
      }

      return { exists: !!data, error: null };
    } catch (error: any) {
      console.error('Error checking user by phone:', error);
      return { exists: false, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Erro ao fazer logout');
      } else {
        setOtpSent(false);
        toast.success('Logout realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const userRoles = profile?.roles || ['customer'];
  const hasRole = (role: string): boolean => userRoles.includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        otpSent,
        otpLoading,
        userRoles,
        hasRole,
        refreshProfile,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithPhone,
        verifyPhoneOtp,
        signUpWithPhone,
        checkUserByPhone,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};