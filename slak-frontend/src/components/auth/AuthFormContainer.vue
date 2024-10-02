<template>
  <div class="auth-form-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AuthFormContainer',
});
</script>

<style lang="scss" scoped>
.auth-form-container {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
}
</style>
