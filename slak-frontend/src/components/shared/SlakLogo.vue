<template>
  <svg
    version="1.2"
    xmlns="http://www.w3.org/2000/svg"
    class="slak-logo"
    :class="{
      'slak-logo--white': white,
    }"
    viewBox="0 0 427 427"
    width="512"
    height="512"
  >
    <title>slak-logo</title>

    <g id="logo">
      <path
        id="Shape 1"
        class="s0"
        d="m100.1 349l158.4-158.4c12.5-12.5 32.8-12.5 45.3 0l22.6 22.7c12.5 12.5 12.5 32.7 0 45.2l-158.4 158.4c-12.5 12.5-32.7 12.5-45.2 0l-22.7-22.6c-12.5-12.5-12.5-32.8 0-45.3z"
      />
      <path
        id="Shape 2"
        class="s1"
        d="m99.1 168l158.4-158.4c12.5-12.5 32.8-12.5 45.3 0l22.6 22.7c12.5 12.5 12.5 32.7 0 45.2l-158.4 158.4c-12.5 12.5-32.7 12.5-45.2 0l-22.7-22.6c-12.5-12.5-12.5-32.8 0-45.3z"
      />
      <path
        id="Shape 3"
        class="s2"
        d="m326.4 122.8l22.6-22.7c12.5-12.5 32.8-12.5 45.3 0l22.6 22.7c12.5 12.5 12.5 32.7 0 45.2l-22.6 22.6c-12.5 12.5-32.8 12.5-45.3 0l-22.6-22.6c-12.5-12.5-12.5-32.7 0-45.2z"
      />
      <path
        id="Shape 4"
        class="s3"
        d="m9.6 258.5l22.7-22.6c12.5-12.5 32.7-12.5 45.2 0l22.6 22.6c12.5 12.5 12.5 32.8 0 45.3l-22.6 22.6c-12.5 12.5-32.7 12.5-45.2 0l-22.7-22.6c-12.5-12.5-12.5-32.8 0-45.3z"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
const { white } = defineProps<{
  white?: boolean;
}>();

defineOptions({
  name: 'SlakLogo',
});
</script>

<style scoped lang="scss">
.slak-logo {
  height: 100%;
  width: 100%;

  padding: 6px;

  .s0 {
    fill: #e0305a;
  }

  .s1 {
    fill: #5bc6f1;
  }

  .s2 {
    fill: #5db586;
  }

  .s3 {
    fill: #ecb43e;
  }

  &--white {
    .s0,
    .s1,
    .s2,
    .s3 {
      fill: white;
    }
  }
}
</style>
