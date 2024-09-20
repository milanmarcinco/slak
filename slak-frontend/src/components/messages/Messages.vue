<template>
  <q-infinite-scroll
    @load="undefined"
    reverse
    class="messages full-height q-pa-md"
  >
    <!-- <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template> -->

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />

    <Message author="Milaj" content="Hello, world!" />
    <Message author="Hnaty" content="Hello, world!" sent />
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import Message from './Message.vue';

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Messages',
});
</script>

<style scoped lang="scss"></style>
