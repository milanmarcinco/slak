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
  flex-direction: column;
  justify-content: center;

  height: 100%;
  width: 100%;
  max-width: 24rem;
  
  padding: 16px;
  margin: 0 auto;
}
</style>
