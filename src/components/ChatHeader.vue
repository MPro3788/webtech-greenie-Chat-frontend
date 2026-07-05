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

const emit = defineEmits(["logout", "open-settings"]);
</script>

<template>
  <header class="chat-header">
    <div>
      <h1>{{ title }}</h1>
      <p>{{ onlineCount }} Nutzer online</p>
      <p v-if="userName" class="user-line">Angemeldet als {{ userName }}</p>
    </div>

    <div class="header-actions">
      <div class="action-column">
        <button
          type="button"
          class="settings-btn"
          aria-label="Einstellungen"
          @click="emit('open-settings')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="gear-icon">
            <path
              fill="currentColor"
              d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm8.227 4.88a1.125 1.125 0 0 0-.22-1.237l-1.05-1.05a7.5 7.5 0 0 0 .18-1.08 7.5 7.5 0 0 0-.18-1.08l1.05-1.05a1.125 1.125 0 0 0 .22-1.237l-1.5-2.598a1.125 1.125 0 0 0-1.237-.22l-1.242.717a7.43 7.43 0 0 0-.936-.54l-.188-1.425A1.125 1.125 0 0 0 13.875 2h-3.75a1.125 1.125 0 0 0-1.119.985l-.188 1.425c-.33.12-.645.28-.936.54l-1.242-.717a1.125 1.125 0 0 0-1.237.22L3.903 6.533a1.125 1.125 0 0 0-.22 1.237l1.05 1.05a7.5 7.5 0 0 0-.18 1.08c0 .37.06.73.18 1.08l-1.05 1.05a1.125 1.125 0 0 0-.22 1.237l1.5 2.598a1.125 1.125 0 0 0 1.237.22l1.242-.717c.29.26.606.42.936.54l.188 1.425A1.125 1.125 0 0 0 10.125 22h3.75a1.125 1.125 0 0 0 1.119-.985l.188-1.425c.33-.12.645-.28.936-.54l1.242.717a1.125 1.125 0 0 0 1.237-.22l1.5-2.598Z"
            />
          </svg>
        </button>
        <button type="button" class="logout-btn" @click="emit('logout')">
          Abmelden
        </button>
      </div>
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

.action-column {
  display: grid;
  gap: 0.45rem;
}

.settings-btn,
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

.settings-btn:hover,
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.32);
}

.settings-btn {
  display: grid;
  place-items: center;
  padding: 0.45rem;
}

.gear-icon {
  width: 1.1rem;
  height: 1.1rem;
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
