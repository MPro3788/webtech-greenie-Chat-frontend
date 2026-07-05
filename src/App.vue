<script setup>
import { computed, onMounted, ref } from "vue";
import ChatHeader from "./components/ChatHeader.vue";
import CodeEditor from "./components/CodeEditor.vue";
import EntityList from "./components/EntityList.vue";
import LoginForm from "./components/LoginForm.vue";
import { getData, getHello, postData } from "./api/greenieApi";
import { useAuth } from "./composables/useAuth";

const { user, isAuthenticated, logout } = useAuth();

const entities = ref([]);
const selectedEntity = ref(null);
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
const isLoadingEntities = ref(false);
const isSavingEntity = ref(false);

function mapGreenieToEntity(item) {
  return {
    id: item.id,
    name: item.name,
    role: item.beruf,
    age: item.alter,
    mood: "online"
  };
}

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

async function loadEntities() {
  isLoadingEntities.value = true;
  try {
    const data = await getData();
    const mapped = (Array.isArray(data) ? data : []).map(mapGreenieToEntity);
    entities.value = mapped;

    if (mapped.length > 0) {
      const currentId = selectedEntity.value?.id;
      selectedEntity.value =
        mapped.find((entity) => entity.id === currentId) ?? mapped[0];
    } else {
      selectedEntity.value = null;
    }
  } catch (error) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Unbekannter Fehler bei GET /data";
    pushMessage("System", `Fehler beim Laden (GET /data): ${String(message)}`);
  } finally {
    isLoadingEntities.value = false;
  }
}

async function createEntity(payload) {
  isSavingEntity.value = true;
  try {
    const created = await postData(payload.id, payload);
    const entity = mapGreenieToEntity(created);
    const existingIndex = entities.value.findIndex((item) => item.id === entity.id);

    if (existingIndex >= 0) {
      entities.value[existingIndex] = entity;
    } else {
      entities.value = [...entities.value, entity];
    }

    selectedEntity.value = entity;
    pushMessage(
      "Backend",
      `POST /data/${entity.id} OK: ${entity.name} (${entity.role}), Alter ${entity.age}`
    );
  } catch (error) {
    let message =
      error?.response?.data?.message ??
      error?.message ??
      "Unbekannter Fehler beim POST /data/{id}";

    if (error?.response?.status === 405) {
      message =
        "POST /data/{id} ist auf dem Backend noch nicht verfuegbar. Bitte das Backend neu deployen.";
    }

    pushMessage(
      "System",
      `Fehler beim Speichern (POST /data/${payload.id}): ${String(message)}`
    );
  } finally {
    isSavingEntity.value = false;
  }
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

  if (lower.includes("hallo") || lower.includes("hey")) {
    reply = "Bot: Hallo! Schoen, dass du hier bist.";
  } else if (lower.includes("hilfe")) {
    reply = "Bot: Ich helfe dir gern. Frag mich etwas zum Chat oder Code.";
  } else if (lower.includes("code")) {
    reply = "Bot: Nutze den Editor unten, um JavaScript zu testen und zu teilen.";
  } else if (lower.includes("stop")) {
    reply = "Bot: OK, ich hoere auf.";
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

async function handleLogout() {
  await logout();
}

async function initializeApp() {
  try {
    const hello = await getHello();
    pushMessage("Backend", `GET / OK: ${String(hello)}`);
  } catch (error) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Unbekannter Fehler bei GET /";
    pushMessage("System", `Backend nicht erreichbar (GET /): ${String(message)}`);
  }

  await loadEntities();
}

onMounted(async () => {
  if (isAuthenticated.value) {
    await initializeApp();
  }
});
</script>

<template>
  <main class="app-shell">
    <LoginForm v-if="!isAuthenticated" @logged-in="initializeApp" />

    <div v-else class="chat-layout">
      <aside class="info-box">
        <ChatHeader
          title="Greenie Chat Tool"
          :online-count="onlineCount"
          :user-name="user?.displayName ?? user?.username ?? ''"
          @logout="handleLogout"
        />

        <EntityList
          :entities="entities"
          :selected-id="selectedEntityId"
          :is-saving="isSavingEntity"
          @select="selectEntity"
          @create="createEntity"
        />
      </aside>

      <section class="content-box">
        <CodeEditor
          :selected-entity-name="selectedEntity?.name ?? 'Keine Entitaet'"
          @run="runCodeFromEditor"
          @send="sendCodeToChat"
        />

        <section class="chat-box">
          <div class="chat-meta">
            <strong>Aktiv:</strong>
            <span v-if="selectedEntity">
              {{ selectedEntity.name }} ({{ selectedEntity.role }}) -
              {{ selectedEntity.age }} Jahre
            </span>
            <span v-else>Keine Entitaet ausgewaehlt</span>
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
              :disabled="isLoadingEntities || !selectedEntity"
            />
            <button type="submit" :disabled="isLoadingEntities || !selectedEntity">
              Senden
            </button>
          </form>
        </section>
      </section>
    </div>
  </main>
</template>
