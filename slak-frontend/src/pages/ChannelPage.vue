<template>
  <q-page class="container">
    <q-infinite-scroll @load="undefined" reverse class="messages q-pa-md">
      <!-- <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template> -->

      <q-chat-message name="me" :text="['hey, how are you?']" sent />
      <q-chat-message name="Jane" :text="['doing fine, how r you?']" />
    </q-infinite-scroll>

    <div class="">
      <q-card flat bordered class="q-ma-sm">
        <q-card-section class="command-line">
          <q-input
            v-model="message"
            standout
            autogrow
            class="command-line__input"
          />

          <q-btn
            color="primary"
            :label="t('command_line.send')"
            class="command-line__button"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const message = ref('');

defineOptions({
  name: 'ChannelPage',
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.messages {
  flex-grow: 1;
}

.command-line {
  display: flex;
  gap: 8px;

  &__input {
    flex-grow: 1;
  }
}
</style>
