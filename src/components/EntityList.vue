<script setup>
defineProps({
  entities: {
    type: Array,
    required: true
  },
  selectedId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(["select"]);
</script>

<template>
  <section class="entity-list">
    <h2>Beispiel-Entitäten</h2>
    <ul>
      <li
        v-for="entity in entities"
        :key="entity.id"
        :class="{ active: selectedId === entity.id }"
        @click="emit('select', entity)"
      >
        <strong>{{ entity.name }}</strong>
        <span>{{ entity.role }}</span>
      </li>
    </ul>
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
</style>
