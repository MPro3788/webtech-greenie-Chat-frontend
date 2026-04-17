<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  onlineCount: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <header class="chat-header">
    <div>
      <h1>{{ title }}</h1>
      <p>{{ onlineCount }} Nutzer online</p>
    </div>
    <span class="status-dot" aria-label="online"></span>
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
