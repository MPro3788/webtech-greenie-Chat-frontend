<script setup>
import { ref } from "vue";

defineProps({
  entities: {
    type: Array,
    required: true
  },
  selectedId: {
    type: Number,
    default: null
  },
  isSaving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["select", "create"]);

const newId = ref("");
const newName = ref("");
const newBeruf = ref("");
const newAlter = ref("");

function submitEntity() {
  const id = Number(newId.value);
  const name = newName.value.trim();
  const beruf = newBeruf.value.trim();
  const alter = Number(newAlter.value);

  if (!Number.isInteger(id) || id <= 0 || !name || !beruf || Number.isNaN(alter)) {
    return;
  }

  emit("create", { id, name, beruf, alter });
  newId.value = "";
  newName.value = "";
  newBeruf.value = "";
  newAlter.value = "";
}
</script>

<template>
  <section class="entity-list">
    <h2>Entitäten (Backend)</h2>
    <ul>
      <li
        v-for="entity in entities"
        :key="entity.id"
        :class="{ active: selectedId === entity.id }"
        @click="emit('select', entity)"
      >
        <strong>{{ entity.name }}</strong>
        <span>{{ entity.role }} · {{ entity.age }} J.</span>
      </li>
    </ul>

    <form class="entity-form" @submit.prevent="submitEntity">
      <h3>Neue Entität speichern</h3>
      <input
        v-model="newId"
        type="number"
        min="1"
        placeholder="ID"
        autocomplete="off"
        :disabled="isSaving"
      />
      <input
        v-model="newName"
        type="text"
        placeholder="Name"
        autocomplete="off"
        :disabled="isSaving"
      />
      <input
        v-model="newBeruf"
        type="text"
        placeholder="Beruf"
        autocomplete="off"
        :disabled="isSaving"
      />
      <input
        v-model="newAlter"
        type="number"
        min="0"
        placeholder="Alter"
        :disabled="isSaving"
      />
      <button type="submit" :disabled="isSaving">
        {{ isSaving ? "Speichern..." : "POST /data/{id}" }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.entity-list h2 {
  font-size: 1rem;
  margin: 0 0 0.75rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.6rem;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.22);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

li:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.32);
}

li.active {
  background: rgba(0, 0, 0, 0.16);
}

span {
  font-size: 0.8rem;
  opacity: 0.8;
}

.entity-form {
  margin-top: 1rem;
  display: grid;
  gap: 0.5rem;
}

.entity-form h3 {
  margin: 0;
  font-size: 0.9rem;
}

.entity-form input,
.entity-form button {
  border: none;
  border-radius: 8px;
  padding: 0.55rem 0.65rem;
  font-size: 0.85rem;
}

.entity-form button {
  background: #2df07f;
  color: #0e411f;
  font-weight: 600;
  cursor: pointer;
}

.entity-form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
