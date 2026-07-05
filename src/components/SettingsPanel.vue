<script setup>
import { computed, ref, watch } from "vue";
import { useSettings } from "../composables/useSettings";

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    default: ""
  },
  messages: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["close", "profile-saved"]);

const {
  settings,
  effectivePrivacy,
  setStrictPrivacy,
  setRegularPrivacy,
  updateIndividualPrivacy,
  updateProfile,
  updateDesign
} = useSettings();

const localDisplayName = ref("");
const backupStatus = ref("");
const saveStatus = ref("");

const privacyOptions = [
  {
    key: "hideOnlineStatus",
    label: "Online-Status verbergen",
    strictHint: "Im distrikten Modus immer aktiv"
  },
  {
    key: "anonymizeMessages",
    label: "Nachrichten anonymisieren",
    strictHint: "Im distrikten Modus immer aktiv"
  },
  {
    key: "hideProfileDetails",
    label: "Profildetails ausblenden",
    strictHint: "Im distrikten Modus immer aktiv"
  },
  {
    key: "shareReadReceipts",
    label: "Lesebestätigungen teilen",
    strictHint: "Im distrikten Modus deaktiviert"
  }
];

const isStrictPrivacy = computed(() => settings.value.privacy.strictMode);
const isRegularPrivacy = computed(() => !settings.value.privacy.strictMode);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      localDisplayName.value =
        settings.value.profile.displayName || props.userName || "";
      backupStatus.value = "";
      saveStatus.value = "";
    }
  }
);

function closePanel() {
  emit("close");
}

function handleStrictToggle(event) {
  setStrictPrivacy(event.target.checked);
}

function handleRegularToggle(event) {
  setRegularPrivacy(event.target.checked);
}

function privacyValue(key) {
  return effectivePrivacy.value[key];
}

function saveProfile() {
  updateProfile({ displayName: localDisplayName.value.trim() });
  emit("profile-saved", localDisplayName.value.trim());
  saveStatus.value = "Persönliche Daten gespeichert.";
}

function downloadChatBackup() {
  const payload = {
    exportedAt: new Date().toISOString(),
    user: props.userName,
    messageCount: props.messages.length,
    messages: props.messages
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `greenie-chat-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  backupStatus.value = "Chat-Backup wurde heruntergeladen.";
}
</script>

<template>
  <div v-if="open" class="settings-overlay" @click.self="closePanel">
    <section class="settings-panel" role="dialog" aria-labelledby="settings-title">
      <header class="settings-header">
        <h2 id="settings-title">Einstellungen</h2>
        <button type="button" class="close-btn" aria-label="Schließen" @click="closePanel">
          ×
        </button>
      </header>

      <div class="settings-body">
        <section class="settings-section">
          <h3>Persönliche Daten</h3>
          <label class="field-label">
            Anzeigename
            <input
              v-model="localDisplayName"
              type="text"
              placeholder="Dein Anzeigename"
              autocomplete="name"
            />
          </label>
          <button type="button" class="action-btn" @click="saveProfile">
            Speichern
          </button>
          <p v-if="saveStatus" class="status-text">{{ saveStatus }}</p>
        </section>

        <section class="settings-section">
          <h3>Design</h3>
          <label class="field-label">
            Farbschema
            <select
              :value="settings.design.theme"
              @change="updateDesign({ theme: $event.target.value })"
            >
              <option value="green">Grün (Standard)</option>
              <option value="dark">Dunkel</option>
              <option value="light">Hell</option>
            </select>
          </label>
        </section>

        <section class="settings-section">
          <h3>Chat-Backup</h3>
          <p class="section-hint">
            Exportiert den aktuellen Chatverlauf als JSON-Datei.
          </p>
          <button type="button" class="action-btn" @click="downloadChatBackup">
            Backup herunterladen
          </button>
          <p v-if="backupStatus" class="status-text">{{ backupStatus }}</p>
        </section>

        <section class="settings-section">
          <h3>Datenschutz</h3>

          <div class="privacy-mode">
            <label class="checkbox-row">
              <input
                type="checkbox"
                :checked="isStrictPrivacy"
                @change="handleStrictToggle"
              />
              <span>
                <strong>Distrikter Datenschutz</strong>
                <small>Alle Privatsphäre-Einstellungen werden dauerhaft anonymisiert.</small>
              </span>
            </label>

            <label class="checkbox-row">
              <input
                type="checkbox"
                :checked="isRegularPrivacy"
                @change="handleRegularToggle"
              />
              <span>
                <strong>Regulärer Datenschutz</strong>
                <small>Einzelne Privatsphäre-Optionen individuell konfigurierbar.</small>
              </span>
            </label>
          </div>

          <div class="privacy-details">
            <h4>Privatsphäre-Einstellungen</h4>
            <p v-if="isStrictPrivacy" class="strict-note">
              Distrikter Modus aktiv: Alle Einstellungen sind gesperrt und anonymisiert.
            </p>

            <label
              v-for="option in privacyOptions"
              :key="option.key"
              class="checkbox-row"
              :class="{ disabled: isStrictPrivacy }"
            >
              <input
                type="checkbox"
                :checked="privacyValue(option.key)"
                :disabled="isStrictPrivacy"
                @change="updateIndividualPrivacy(option.key, $event.target.checked)"
              />
              <span>
                {{ option.label }}
                <small v-if="isStrictPrivacy">{{ option.strictHint }}</small>
              </span>
            </label>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.45);
}

.settings-panel {
  width: min(520px, 100%);
  max-height: min(90vh, 760px);
  overflow: auto;
  background: #0f3d22;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.settings-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.85;
}

.settings-body {
  display: grid;
  gap: 1rem;
  padding: 1rem 1.2rem 1.2rem;
}

.settings-section {
  display: grid;
  gap: 0.65rem;
  padding: 0.85rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}

.settings-section h3,
.settings-section h4 {
  margin: 0;
  font-size: 1rem;
}

.section-hint,
.strict-note,
.status-text {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.field-label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.field-label input,
.field-label select {
  border: none;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  color: #123a20;
}

.action-btn {
  justify-self: start;
  border: none;
  border-radius: 10px;
  padding: 0.55rem 0.9rem;
  background: #2df07f;
  color: #0e411f;
  font-weight: 600;
  cursor: pointer;
}

.privacy-mode,
.privacy-details {
  display: grid;
  gap: 0.55rem;
}

.checkbox-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.6rem;
  align-items: start;
  font-size: 0.9rem;
  cursor: pointer;
}

.checkbox-row.disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.checkbox-row input {
  margin-top: 0.15rem;
}

.checkbox-row span {
  display: grid;
  gap: 0.15rem;
}

.checkbox-row small {
  opacity: 0.85;
  font-size: 0.8rem;
}
</style>
