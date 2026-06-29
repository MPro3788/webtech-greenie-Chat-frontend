<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const emit = defineEmits(["logged-in"]);

const { login } = useAuth();
const username = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

async function submitLogin() {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    const user = await login(username.value, password.value);
    emit("logged-in", user);
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ??
      error?.message ??
      "Anmeldung fehlgeschlagen.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="login-card">
    <h1>HTW-Account Anmeldung</h1>
    <p>Melde dich mit deinem HTW-Berlin-Account an.</p>

    <form class="login-form" @submit.prevent="submitLogin">
      <label>
        HTW-Benutzername
        <input
          v-model="username"
          type="text"
          placeholder="z. B. s1234567"
          autocomplete="username"
          :disabled="isSubmitting"
          required
        />
      </label>

      <label>
        Passwort
        <input
          v-model="password"
          type="password"
          placeholder="HTW-Passwort"
          autocomplete="current-password"
          :disabled="isSubmitting"
          required
        />
      </label>

      <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Anmeldung..." : "Anmelden" }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.login-card {
  width: min(420px, 100%);
  background: rgba(16, 68, 35, 0.72);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.25);
}

h1 {
  margin: 0;
  font-size: 1.4rem;
}

p {
  margin: 0.5rem 0 1rem;
  opacity: 0.9;
}

.login-form {
  display: grid;
  gap: 0.85rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

input {
  border: none;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
}

button {
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  background: #2df07f;
  color: #0e411f;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-error {
  margin: 0;
  color: #ffd0d0;
  font-size: 0.88rem;
}
</style>
