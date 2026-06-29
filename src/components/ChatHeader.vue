<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  onlineCount: {
    type: Number,
    required: true
  },
  userName: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["logout"]);
</script>

<template>
  <header class="chat-header">
    <div>
      <h1>{{ title }}</h1>
      <p>{{ onlineCount }} Nutzer online</p>
      <p v-if="userName" class="user-line">Angemeldet als {{ userName }}</p>
    </div>

    <div class="header-actions">
      <button type="button" class="logout-btn" @click="emit('logout')">
        Abmelden
      </button>
      <span class="status-dot" aria-label="online"></span>
    </div>
  </header>
</template>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
}

h1 {
  margin: 0;
  font-size: 1.35rem;
}

p {
  margin: 0.25rem 0 0;
  font-size: 0.88rem;
  opacity: 0.9;
}

.user-line {
  font-size: 0.82rem;
  opacity: 0.85;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logout-btn {
  border: none;
  border-radius: 10px;
  padding: 0.5rem 0.85rem;
  background: rgba(255, 255, 255, 0.22);
  color: #f8fff8;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.32);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #7fff8e;
  box-shadow: 0 0 0 8px rgba(127, 255, 142, 0.2);
  animation: pulse 1.8s infinite ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.16);
  }
}
</style>
