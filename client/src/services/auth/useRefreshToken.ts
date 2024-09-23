import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import { RootState } from "../stores";
import { useRefreshAccessTokenMutation } from "./authApi";
import { logout, refreshedToken } from "./authSlice";

/**
 * Hook personnalisé pour rafraîchir le token d'accès
 * Vérifie si le token est expiré et le rafraîchit si nécessaire
 */
export const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state: RootState) => state.auth?.refreshToken);
  const accessToken = useSelector((state: RootState) => state.auth?.accessToken);
  const isAuth = useSelector((state: RootState) => state.auth?.isAuthenticated);
  const [refreshAccessToken] = useRefreshAccessTokenMutation();

  // Fonction pour vérifier si le token est expiré
  const isTokenExpired = (token: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp * 1000 < Date.now();  // Convertir en millisecondes
    } catch (error) {
      return true;  // Si une erreur survient, considérer que le token est expiré
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isAuth || !refreshToken) return;

      // Si le access token est expiré, tente de le rafraîchir
      if (accessToken && isTokenExpired(accessToken)) {
        try {
          const response = await refreshAccessToken({ refreshToken }).unwrap();
          dispatch(refreshedToken(response.data.accessToken));  // Mise à jour du accessToken
        } catch (error) {
          dispatch(logout());  // Si l'opération échoue, déconnecter l'utilisateur
          console.log('Token refresh failed, logging out...');
        }
      }
    }, 1000 * 60 * 5);  // Vérifie toutes les 5 minutes

    return () => clearInterval(interval);
  }, [isAuth, refreshToken, accessToken, refreshAccessToken, dispatch]);
};
