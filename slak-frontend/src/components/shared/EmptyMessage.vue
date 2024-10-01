<template>
  <div
    v-if="show"
    class="empty-message"
    :class="{
      'empty-message--larger': larger,
    }"
  >
    <p class="q-ma-none">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { text, show } = defineProps<{
  text: string;
  show?: boolean;
  larger?: boolean;
}>();

defineOptions({
  name: 'EmptyMessage',
});
</script>

<style lang="scss" scoped>
.empty-message {
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: $font-xs;
  color: $light;

  &--larger {
    font-size: $font-sm;
  }
}
</style>
