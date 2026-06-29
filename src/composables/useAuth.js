import { computed, ref } from "vue";
import { login as loginRequest, logout as logoutRequest } from "../api/authApi";
import { clearAuth, getStoredUser, saveAuth } from "../auth/session";

const user = ref(getStoredUser());

export function useAuth() {
  const isAuthenticated = computed(() => user.value !== null);

  async function login(username, password) {
    const data = await loginRequest(username, password);
    const session = {
      token: data.token,
      user: {
        username: data.username,
        displayName: data.displayName
      }
    };

    saveAuth(session);
    user.value = session.user;
    return session.user;
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch {
      // Session wird lokal trotzdem beendet.
    } finally {
      clearAuth();
      user.value = null;
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
}
