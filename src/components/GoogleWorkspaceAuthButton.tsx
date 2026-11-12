import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getCurrentGoogleUser,
  getAccessToken,
  CUENTA_OBJETIVO_GMAIL,
} from '../services/gmailAuthService';
import { getGmailProfile, GmailProfile } from '../services/gmailApiService';
import { LogOut, RefreshCw, AlertCircle } from 'lucide-react';

interface GoogleWorkspaceAuthButtonProps {
  onAuthStateChanged?: (user: User | null, token: string | null) => void;
  className?: string;
  compact?: boolean;
}

export const GoogleWorkspaceAuthButton: React.FC<GoogleWorkspaceAuthButtonProps> = ({
  onAuthStateChanged: onParentAuthStateChanged,
  className = '',
  compact = false,
}) => {
  const [user, setUser] = useState<User | null>(getCurrentGoogleUser());
  const [gmailProfile, setGmailProfile] = useState<GmailProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        if (onParentAuthStateChanged) onParentAuthStateChanged(authUser, token);
        const profile = await getGmailProfile();
        setGmailProfile(profile);
      },
      () => {
        setUser(null);
        setGmailProfile(null);
        if (onParentAuthStateChanged) onParentAuthStateChanged(null, null);
      }
    );

    getAccessToken().then(async (tok) => {
      if (tok) {
        const profile = await getGmailProfile();
        setGmailProfile(profile);
      }
    });

    return () => unsubscribe();
  }, [onParentAuthStateChanged]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn(CUENTA_OBJETIVO_GMAIL);
      if (res) {
        setUser(res.user);
        const profile = await getGmailProfile();
        setGmailProfile(profile);
        if (onParentAuthStateChanged) onParentAuthStateChanged(res.user, res.accessToken);
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión con Gmail:', err);
      if (err.message && (err.message.includes('access_denied') || err.message.includes('blocked'))) {
        setError(
          'Acceso bloqueado por Google: la cuenta debe estar agregada como "Usuario de prueba" en Google Cloud Console para este proyecto.'
        );
      } else {
        setError(err.message || 'Error al conectar con Gmail.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logoutGoogle();
      setUser(null);
      setGmailProfile(null);
      if (onParentAuthStateChanged) onParentAuthStateChanged(null, null);
    } catch (err: any) {
      console.error('Error cerrando sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  // Si está autenticado, mostrar badge y usuario
  if (user) {
    const displayEmail = gmailProfile?.emailAddress || user.email || 'Cuenta Gmail';

    return (
      <div className={`flex items-center gap-2.5 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 shadow-sm text-xs ${className}`}>
        <div className="flex items-center gap-2">
          <div className="relative">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="h-6 w-6 rounded-full border border-emerald-400"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                {displayEmail.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-slate-900" />
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white max-w-[150px] truncate" title={displayEmail}>
                {displayEmail}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gmail Activo
              </span>
            </div>
            {!compact && (
              <span className="text-[10px] text-slate-400 font-mono">Google Workspace</span>
            )}
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={loading}
          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer ml-1"
          title="Cerrar sesión de Gmail"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // Si no está autenticado, renderizar botón de Google estándar
  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      {error && (
        <span className="text-[10px] text-rose-400 flex items-center gap-1 max-w-xs">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </span>
      )}
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-300 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        title="Conectar con Gmail"
      >
        {loading ? (
          <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />
        ) : (
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
        )}
        <span>{compact ? 'Gmail' : 'Conectar Gmail'}</span>
      </button>
    </div>
  );
};
