<script setup>
import { ref } from "vue";

const props = defineProps({
  selectedEntityName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["run", "send"]);

const code = ref(
  'const name = "Greenie";\nconst message = `Hallo ${name}!`;\nreturn message;'
);

function runCode() {
  emit("run", code.value);
}

function sendCode() {
  emit("send", code.value);
}
</script>

<template>
  <section class="editor-card">
    <div class="editor-top">
      <h2>Code-Editor</h2>
      <small>Empfaenger: {{ props.selectedEntityName }}</small>
    </div>

    <textarea
      v-model="code"
      spellcheck="false"
      placeholder="Schreibe hier JavaScript-Code..."
    ></textarea>

    <div class="editor-actions">
      <button type="button" class="run" @click="runCode">Code ausfuehren</button>
      <button type="button" class="send" @click="sendCode">
        Code verschicken
      </button>
    </div>
  </section>
</template>

<style scoped>
.editor-card {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 1rem;
}

.editor-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.7rem;
}

.editor-top h2 {
  margin: 0;
  font-size: 1rem;
}

.editor-top small {
  opacity: 0.88;
}

textarea {
  width: 100%;
  min-height: 150px;
  border: none;
  border-radius: 10px;
  padding: 0.8rem;
  font-size: 0.9rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  resize: vertical;
}

.editor-actions {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.6rem;
}

button {
  border: none;
  border-radius: 10px;
  padding: 0.55rem 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.run {
  background: #a7ffce;
  color: #0f4422;
}

.send {
  background: #2df07f;
  color: #0d3f1e;
}
</style>
