<script setup>
import { computed, ref } from "vue";
import ChatHeader from "./components/ChatHeader.vue";
import CodeEditor from "./components/CodeEditor.vue";
import EntityList from "./components/EntityList.vue";

const entities = ref([
  { id: 1, name: "Anna", role: "Moderatorin", mood: "motiviert" },
  { id: 2, name: "Ben", role: "Entwickler", mood: "fokussiert" },
  { id: 3, name: "Clara", role: "Support", mood: "hilfsbereit" },
  { id: 4, name: "David", role: "Product Owner", mood: "neugierig" }
]);

const selectedEntity = ref(entities.value[0]);
const input = ref("");
const messages = ref([
  {
    id: 1,
    author: "System",
    text: "Willkommen im Greenie Chat!",
    timestamp: "09:00"
  }
]);

const onlineCount = computed(() => entities.value.length);
const selectedEntityId = computed(() => selectedEntity.value?.id ?? null);

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function pushMessage(author, text) {
  messages.value.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    author,
    text,
    timestamp: getTimestamp()
  });
}

function selectEntity(entity) {
  selectedEntity.value = entity;
}

function sendMessage() {
  const trimmed = input.value.trim();
  if (!trimmed || !selectedEntity.value) {
    return;
  }

  pushMessage(selectedEntity.value.name, trimmed);

  input.value = "";
  autoBotReply(trimmed);
}

function autoBotReply(text) {
  const lower = text.toLowerCase();
  let reply = "Bot: Ich habe deine Nachricht erhalten.";

  if (lower.includes("hallo") || lower.includes("hi")) {
    reply = "Bot: Hallo! Schoen, dass du hier bist.";
  } else if (lower.includes("hilfe")) {
    reply = "Bot: Ich helfe dir gern. Frag mich etwas zum Chat oder Code.";
  } else if (lower.includes("code")) {
    reply = "Bot: Nutze den Editor unten, um JavaScript zu testen und zu teilen.";
  }

  setTimeout(() => {
    pushMessage("Greenie Bot", reply);
  }, 600);
}

function runCodeFromEditor(code) {
  try {
    const wrapped = new Function(code);
    const result = wrapped();
    const output =
      result === undefined
        ? "Code ausgefuehrt (kein Rueckgabewert)."
        : `Code ausgefuehrt: ${String(result)}`;

    pushMessage("System", output);
  } catch (error) {
    pushMessage("System", `Fehler beim Ausfuehren: ${error.message}`);
  }
}

function sendCodeToChat(code) {
  if (!selectedEntity.value) {
    return;
  }

  pushMessage(
    selectedEntity.value.name,
    `Code an Team gesendet:\n${code}`
  );

  setTimeout(() => {
    pushMessage(
      "Greenie Bot",
      `Bot: Code von ${selectedEntity.value.name} wurde an alle User verteilt.`
    );
  }, 500);
}
</script>

<template>
  <main class="app-shell">
    <div class="chat-layout">
      <ChatHeader title="Greenie Chat Tool" :online-count="onlineCount" />

      <EntityList
        :entities="entities"
        :selected-id="selectedEntityId"
        @select="selectEntity"
      />

      <CodeEditor
        :selected-entity-name="selectedEntity.name"
        @run="runCodeFromEditor"
        @send="sendCodeToChat"
      />

      <section class="chat-box">
        <div class="chat-meta">
          <strong>Aktiv:</strong>
          <span>
            {{ selectedEntity.name }} ({{ selectedEntity.role }}) -
            {{ selectedEntity.mood }}
          </span>
        </div>

        <div class="messages">
          <article v-for="message in messages" :key="message.id" class="message">
            <div class="line">
              <strong>{{ message.author }}</strong>
              <small>{{ message.timestamp }}</small>
            </div>
            <p class="message-content">{{ message.text }}</p>
          </article>
        </div>

        <form class="input-row" @submit.prevent="sendMessage">
          <input
            v-model="input"
            type="text"
            placeholder="Nachricht schreiben..."
            autocomplete="off"
          />
          <button type="submit">Senden</button>
        </form>
      </section>
    </div>
  </main>
</template>
